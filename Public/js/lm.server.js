var Lm = (function(Lm, $, undefined) {
	Lm.MultiQueue = null;


	function SendOutsideRequest(url, data, callback, async) {
		if ($.isFunction(data)) {
			async = callback;
			callback = data;
			data = {};
		} else {
			data = data || {};
		}

		$.support.cors = true;

		$.ajax({
			url: url,
			crossDomain: true,
			dataType: "json",
			type: "GET",
			timeout: 30000,
			async: (async === undefined ? true : async),
			data: data
		}).done(function(json) {
			if (json.errorCode && !json.errorDescription) {
				json.errorDescription = (json.errorMessage ? json.errorMessage : "Unknown error occured.");
			}
			if (callback) {
				callback(json, data);
			}
		}).fail(function(xhr, textStatus, error) {
			if (callback) {
				callback({
					"errorCode": -1,
					"errorDescription": error
				}, {});
			}
		});
	}

	function SendRequest(requestType, data, callback, async) {
		if (requestType == undefined) {
			return;
		}

		if ($.isFunction(data)) {
			async = callback;
			callback = data;
			data = {};
		} else {
			data = data || {};
		}

		$.each(data, function(key, val) {
			if (key != "secretPhrase") {
				if (typeof val == "string") {
					data[key] = $.trim(val);
				}
			}
		});

		//convert Lm to MilliLm...
		try {
			var lmFields = ["feeLm", "amountLm"];

			for (var i = 0; i < lmFields.length; i++) {
				var lmField = lmFields[i];
				var field = lmField.replace("Lm", "");

				if (lmField in data) {
					data[field + "MilliLm"] = Lm.ConvertToMilliLm(data[lmField]);
					delete data[lmField];
				}
			}
		} catch (err) {
			if (callback) {
				callback({
					"errorCode": 1,
					"errorDescription": err + " (Field: " + field + ")"
				});
			}

			return;
		}

		//gets account id from secret phrase client side, used only for login.
		if (requestType == "getAccountId") {
			var accountId = Lm.GenerateAccountId(data.secretPhrase, true);

			if (callback) {
				callback({
					"accountId": accountId
				});
			}
			return;
		}

		//check to see if secretPhrase supplied matches logged in account, if not - show error.
		if ("secretPhrase" in data) {
			var accountId = Lm.GenerateAccountId(Lm.RememberPassword ? sessionStorage.getItem("secret") : data.secretPhrase);
			if (accountId != Lm.Account) {
				if (callback) {
					callback({
						"errorCode": 1,
						"errorDescription": "Incorrect secret phrase."
					});
				}
				return;
			} else {
				//ok, accountId matches..continue with the real request.
				Lm.ProcessAjaxRequest(requestType, data, callback, async);
			}
		} else {
			Lm.ProcessAjaxRequest(requestType, data, callback, async);
		}
	}

	function ProcessAjaxRequest(requestType, data, callback, async) {
		if (!Lm.MultiQueue) {
			Lm.MultiQueue = $.ajaxMultiQueue(8);
		}

		if (data["_extra"]) {
			var extra = data["_extra"];
			delete data["_extra"];
		} else {
			var extra = null;
		}

		var currentPage = currentSubPage = null;

		//means it is a page request, not a global request.. Page requests can be aborted.
		if (requestType.slice(-1) == "+") {
			requestType = requestType.slice(0, -1);
			currentPage = Lm.CurrentPage;
		} else {
			//not really necessary... we can just use the above code..
			var plusCharacter = requestType.indexOf("+");

			if (plusCharacter > 0) {
				var subType = requestType.substr(plusCharacter);
				requestType = requestType.substr(0, plusCharacter);
				currentPage = Lm.CurrentPage;
			}
		}

		if (currentPage && Lm.CurrentSubPage) {
			currentSubPage = Lm.CurrentSubPage;
		}

		var type = ("secretPhrase" in data ? "POST" : "GET");
		var url = Lm.Server + "/api/" + requestType + "?random=" + Math.random();
		var secretPhrase = "";
		
		if (!Lm.IsLocalHost && type == "POST" && requestType != "startForging" && requestType != "stopForging") {
			if (Lm.RememberPassword) {
				secretPhrase = sessionStorage.getItem("secret");
			} else {
				secretPhrase = data.secretPhrase;
			}

			delete data.secretPhrase;

			if (Lm.AccountInfo && Lm.AccountInfo.publicKey) {
				data.publicKey = Lm.AccountInfo.publicKey;
			} else {
				data.publicKey = Lm.GeneratePublicKey(secretPhrase);
				Lm.AccountInfo.publicKey = data.publicKey;
			}
		} else if (type == "POST" && Lm.RememberPassword) {
			data.secretPhrase = sessionStorage.getItem("secret");
		}

		$.support.cors = true;

		if (type == "GET") {
			var ajaxCall = Lm.MultiQueue.queue;
		} else {
			var ajaxCall = $.ajax;
		}

		//workaround for 1 specific case.. ugly
		if (data.querystring) {
			data = data.querystring;
			type = "POST";
		}

		ajaxCall({
			url: url,
			crossDomain: true,
			dataType: "json",
			type: type,
			timeout: 30000,
			async: (async === undefined ? true : async),
			currentPage: currentPage,
			currentSubPage: currentSubPage,
			shouldRetry: (type == "GET" ? 2 : undefined),
			data: data
		})
		.done(function(response, status, xhr) {
			ProcessAjaxRequest_OnAjaxDone(response, status, xhr, data, secretPhrase, callback, extra);
		})
		.fail(function(xhr, textStatus, error){
			ProcessAjaxRequest_OnAjaxFail(xhr, textStatus, error, callback);
		});
	}

	function ProcessAjaxRequest_OnAjaxDone(response, status, xhr, data, secretPhrase, callback, extra) {
		if (Lm.Console) {
			Lm.AddToConsole(this.url, this.type, this.data, response);
		}

		if (typeof data == "object" && "recipient" in data) {
			if (/^LMA\-/i.test(data.recipient)) {
				data.recipientRS = data.recipient;

				var address = new LmAddress();

				if (address.set(data.recipient)) {
					data.recipient = address.account_id();
				}
			} else {
				var address = new LmAddress();

				if (address.set(data.recipient)) {
					data.recipientRS = address.toString();
				}
			}
		}

		if (secretPhrase && response.unsignedTransactionBytes && !response.errorCode) {
			var publicKey = Lm.GeneratePublicKey(secretPhrase);
			var signature = lmCrypto.sign(response.unsignedTransactionBytes, converters.stringToHexString(secretPhrase));

			if (!lmCrypto.verify(signature, response.unsignedTransactionBytes, publicKey)) {
				if (callback) {
					callback({
						"errorCode": 1,
						"errorDescription": "Could not verify signature (client side)."
					}, data);
				} else {
					$.growl("Could not verify signature.", {
						"type": "danger"
					});
				}
				return;
			} else {
				var payload = response.unsignedTransactionBytes.substr(0, 192) + signature + response.unsignedTransactionBytes.substr(320);

				if (!Lm.VerifyTransactionBytes(payload, requestType, data)) {
					if (callback) {
						callback({
							"errorCode": 1,
							"errorDescription": "Could not verify transaction bytes (server side)."
						}, data);
					} else {
						$.growl("Could not verify transaction bytes.", {
							"type": "danger"
						});
					}
					return;
				} else {
					if (callback) {
						if (extra) {
							data["_extra"] = extra;
						}

						Lm.BroadcastTransactionBytes(payload, callback, response, data);
					} else {
						Lm.BroadcastTransactionBytes(payload);
					}
				}
			}
		} else {
			if (response.errorCode && !response.errorDescription) {
				response.errorDescription = (response.errorMessage ? response.errorMessage : "Unknown error occured.");
			}

			if (callback) {
				if (extra) {
					data["_extra"] = extra;
				}
				callback(response, data);
			}
		}
	}

	function ProcessAjaxRequest_OnAjaxFail(xhr, textStatus, error, callback) {
		if (Lm.Console) {
			Lm.AddToConsole(this.url, this.type, this.data, error, true);
		}

		if ((error == "error" || textStatus == "error") && (xhr.status == 404 || xhr.status == 0)) {
			if (type == "POST") {
				$.growl("Could not connect.", {
					"type": "danger",
					"offset": 10
				});
			}
		}

		if (error == "abort") {
			return;
		} else if (callback) {
			if (error == "timeout") {
				error = "The request timed out. Warning: This does not mean the request did not go through. "+
					"You should wait a couple of blocks and see if your request has been processed.";
			}
			callback({
				"errorCode": -1,
				"errorDescription": error
			}, {});
		}
	}

	function VerifyTransactionBytes(transactionBytes, requestType, data) {
		var transaction = {};

		var byteArray = converters.hexStringToByteArray(transactionBytes);

		var pos = 0;
		transaction.Type = byteArray[pos]; pos += 1;
		transaction.Subtype = byteArray[pos]; pos += 1;
		transaction.Timestamp = String(converters.byteArrayToSignedInt64(byteArray, pos)); pos += 8;
		transaction.Deadline = String(converters.byteArrayToSignedShort(byteArray, pos)); pos += 2;
		transaction.SenderPublicKey = converters.byteArrayToHexString(byteArray.slice(pos, pos+32)); pos += 32;
		transaction.Recipient = String(converters.byteArrayToBigInteger(byteArray, pos)); pos += 8;
		transaction.AmountMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos)); pos += 8;
		transaction.FeeMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos)); pos += 8;

		var refHash = byteArray.slice(pos, pos+32); pos += 32;
		transaction.referencedTransactionFullHash = converters.byteArrayToHexString(refHash);
		if (transaction.referencedTransactionFullHash == "0") {
			transaction.referencedTransactionFullHash = null;
		} else {
			transaction.referencedTransactionId = converters.byteArrayToBigInteger([refHash[7], refHash[6], refHash[5], refHash[4],
				refHash[3], refHash[2], refHash[1], refHash[0]], 0);
		}

		if (!("amountMilliLm" in data)) {
			data.amountMilliLm = "0";
		}

		if (!("recipient" in data)) {
			//recipient == genesis
			data.recipient = "2391470422895685625";
			data.recipientRS = "LMA-TVZT-PRDS-FB8M-4P3E4";
		}

		if (transaction.SenderPublicKey != Lm.AccountInfo.PublicKey) {
			return false;
		}

		if (transaction.Deadline !== data.Deadline || transaction.Recipient !== data.Recipient) {
			return false;
		}

		if (transaction.AmountMilliLm !== data.AmountMilliLm || transaction.FeeMilliLm !== data.FeeMilliLm) {
			return false;
		}

		if ("referencedTransactionFullHash" in data && transaction.referencedTransactionFullHash !== data.referencedTransactionFullHash) {
			return false;
		}
		if ("referencedTransactionId" in data && transaction.referencedTransactionId !== data.referencedTransactionId) {
			return false;
		}

		pos = 160;

		switch (requestType) {
			case "sendMoney":
				if (transaction.type !== 0 || transaction.subtype !== 0) {
					return false;
				}
				break;
			case "sendMessage":
				if (transaction.type !== 1 || transaction.subtype !== 0) {
					return false;
				}

				var messageLength = String(converters.byteArrayToSignedInt32(byteArray, pos));

				pos += 4;

				var slice = byteArray.slice(pos, pos + messageLength);

				transaction.message = converters.byteArrayToHexString(slice);

				if (transaction.message !== data.message) {
					return false;
				}
				break;
			case "setAlias":
				if (transaction.type !== 1 || transaction.subtype !== 1) {
					return false;
				}

				var aliasLength = parseInt(byteArray[pos], 10);

				pos++;

				transaction.aliasName = converters.byteArrayToString(byteArray, pos, aliasLength);

				pos += aliasLength;

				var uriLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.aliasURI = converters.byteArrayToString(byteArray, pos, uriLength);

				if (transaction.aliasName !== data.aliasName || transaction.aliasURI !== data.aliasURI) {
					return false;
				}
				break;
			case "createPoll":
				if (transaction.type !== 1 || transaction.subtype !== 2) {
					return false;
				}

				var nameLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

				pos += nameLength;

				var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

				pos += descriptionLength;

				var nr_options = byteArray[pos];

				pos++;

				for (var i = 0; i < nr_options; i++) {
					var optionLength = converters.byteArrayToSignedShort(byteArray, pos);

					pos += 2;

					transaction["option" + i] = converters.byteArrayToString(byteArray, pos, optionLength);

					pos += optionLength;
				}

				transaction.minNumberOfOptions = String(byteArray[pos]);

				pos++;

				transaction.maxNumberOfOptions = String(byteArray[pos]);

				pos++;

				transaction.optionsAreBinary = String(byteArray[pos]);

				if (transaction.name !== data.name || transaction.description !== data.description ||
						transaction.minNumberOfOptions !== data.minNumberOfOptions || transaction.maxNumberOfOptions !== data.maxNumberOfOptions ||
						transaction.optionsAreBinary !== data.optionsAreBinary) {
					return false;
				}

				for (var i = 0; i < nr_options; i++) {
					if (transaction["option" + i] !== data["option" + i]) {
						return false;
					}
				}

				if (("option" + i) in data) {
					return false;
				}

				break;
			case "castVote":
				if (transaction.type !== 1 || transaction.subtype !== 3) {
					return false;
				}

				transaction.poll = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var voteLength = byteArray[pos];

				pos++;

				transaction.votes = [];

				for (var i = 0; i < voteLength; i++) {
					transaction.votes.push(bytesArray[pos]);

					pos++;
				}

				return false;

				break;
			case "hubAnnouncement":
				if (transaction.type !== 1 || transaction.subtype != 4) {
					return false;
				}

				var minFeePerByte = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var numberOfUris = parseInt(byteArray[pos], 10);

				pos++;

				var uris = [];

				for (var i = 0; i < numberOfUris; i++) {
					var uriLength = parseInt(byteArray[pos], 10);

					pos++;

					uris[i] = converters.byteArrayToString(byteArray, pos, uriLength);

					pos += uriLength;
				}

				//do validation

				return false;

				break;
			case "setAccountInfo":
				if (transaction.type !== 1 || transaction.subtype != 5) {
					return false;
				}

				var nameLength = parseInt(byteArray[pos], 10);

				pos++;

				transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

				pos += nameLength;

				var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

				pos += descriptionLength;

				if (transaction.name !== data.name || transaction.description !== data.description) {
					return false;
				}

				break;
			case "issueAsset":
				if (transaction.type !== 2 || transaction.subtype !== 0) {
					return false;
				}

				var nameLength = byteArray[pos];

				pos++;

				transaction.name = converters.byteArrayToString(byteArray, pos, nameLength);

				pos += nameLength;

				var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.description = converters.byteArrayToString(byteArray, pos, descriptionLength);

				pos += descriptionLength;

				transaction.quantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.name !== data.name || transaction.description !== data.description || transaction.quantityQNT !== data.quantityQNT) {
					return false;
				}
				break;
			case "transferAsset":
				if (transaction.type !== 2 || transaction.subtype !== 1) {
					return false;
				}

				transaction.asset = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.quantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var commentLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Comment = converters.byteArrayToString(byteArray, pos, commentLength);

				if (transaction.Asset !== data.asset || transaction.QuantityQNT !== data.QuantityQNT || transaction.Comment !== data.comment) {
					return false;
				}
				break;
			case "placeAskOrder":
			case "placeBidOrder":
				if (transaction.type !== 2) {
					return false;
				} else if (requestType == "placeAskOrder" && transaction.Subtype !== 2) {
					return false;
				} else if (requestType == "placeBidOrder" && transaction.Subtype !== 3) {
					return false;
				}

				transaction.Asset = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.QuantityQNT = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.PriceMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.Asset !== data.asset || transaction.QuantityQNT !== data.quantityQNT || transaction.PriceMilliLm !== data.PriceMilliLm) {
					return false;
				}
				break;
			case "cancelAskOrder":
			case "cancelBidOrder":
				if (transaction.type !== 2) {
					return false;
				} else if (requestType == "cancelAskOrder" && transaction.subtype !== 4) {
					return false;
				} else if (requestType == "cancelBidOrder" && transaction.subtype !== 5) {
					return false;
				}

				transaction.Order = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.Order !== data.order) {
					return false;
				}

				break;
			case "digitalGoodsListing":
				if (transaction.Type !== 3 && transaction.Subtype != 0) {
					return false;
				}

				var nameLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Name = converters.byteArrayToString(byteArray, pos, nameLength);

				pos += nameLength;

				var descriptionLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Description = converters.byteArrayToString(byteArray, pos, descriptionLength);

				pos += descriptionLength;

				var tagsLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Tags = converters.byteArrayToString(byteArray, pos, tagsLength);

				pos += tagsLength;

				transaction.Quantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

				pos += 4;

				transaction.PriceMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.Name !== data.name || transaction.Description !== data.description || transaction.Tags !== data.tags ||
						transaction.Quantity !== data.quantity || transaction.PriceMilliLm !== data.PriceMilliLm) {
					return false;
				}

				break;
			case "digitalGoodsDelisting":
				if (transaction.Type !== 3 && transaction.Subtype !== 1) {
					return false;
				}

				transaction.GoodsId = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.GoodsId !== data.GoodsId) {
					return false;
				}

				break;
			case "digitalGoodsPriceChange":
				if (transaction.Type !== 3 && transaction.Subtype !== 2) {
					return false;
				}

				transaction.GoodsId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.PriceMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.GoodsId !== data.GoodsId || transaction.PriceMilliLm !== data.PriceMilliLm) {
					return false;
				}

				break;
			case "digitalGoodsQuantityChange":
				if (transaction.Type !== 3 && transaction.Subtype !== 3) {
					return false;
				}

				transaction.GoodsId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.DeltaQuantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

				if (transaction.GoodsId !== data.goodsId || transaction.DeltaQuantity !== data.deltaQuantity) {
					return false;
				}

				break;
			case "digitalGoodsPurchase":
				if (transaction.Type !== 3 && transaction.Subtype !== 4) {
					return false;
				}

				transaction.GoodsId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.Quantity = String(converters.byteArrayToSignedInt32(byteArray, pos));

				pos += 4;

				transaction.PriceMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.DeliveryDeadline = String(converters.byteArrayToSignedInt32(byteArray, pos));

				pos += 4;

				var noteLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Note = converters.byteArrayToString(byteArray, pos, noteLength);

				pos += noteLength;

				transaction.noteNonce = converters.byteArrayToString(byteArray, pos, 32);
				//XoredData note = new XoredData(noteBytes, noteNonceBytes);

				if (transaction.GoodsId !== data.goodsId || transaction.Quantity !== data.quantity ||
						transaction.PriceMilliLm !== data.priceMilliLm || transaction.DeliveryDeadline !== data.deliveryDeadline ||
						transaction.Note !== data.note || transaction.NoteNonce !== data.noteNonce) {
					return false;
				}

				break;
			case "digitalGoodsDelivery":
				if (transaction.Type !== 3 && transaction.Subtype !== 5) {
					return false;
				}

				transaction.GoodsId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var goodsLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Goods = converters.byteArrayToString(byteArray, pos, goodsLength);

				pos += goodsLength;

				transaction.GoodsNonce = converters.byteArrayToString(byteArray, pos, 32);

				pos += 32;

				transaction.DiscountMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				if (transaction.GoodsId !== data.goodsId || transaction.Goods !== data.goods ||
						transaction.GoodsNonce !== data.goodsNonce || transaction.DiscountMilliLm !== data.discountMilliLm) {
					return false;
				}

				break;
			case "digitalGoodsFeedback":
				if (transaction.Type !== 3 && transaction.Subtype !== 6) {
					return false;
				}

				transaction.PurchaseId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var noteLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Note = converters.byteArrayToString(byteArray, pos, noteLength);

				pos += noteLength;

				transaction.NoteNonce = converters.byteArrayToString(byteArray, pos, 32);

				if (transaction.PurchaseId !== data.purchaseId || transaction.Note !== data.note ||
						transaction.NoteNonce !== data.noteNonce) {
					return false;
				}

				break;
			case "digitalGoodsRefund":
				if (transaction.Type !== 3 && transaction.Subtype !== 7) {
					return false;
				}

				transaction.PurchaseId = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				transaction.RefundMilliLm = String(converters.byteArrayToBigInteger(byteArray, pos));

				pos += 8;

				var noteLength = converters.byteArrayToSignedShort(byteArray, pos);

				pos += 2;

				transaction.Note = converters.byteArrayToString(byteArray, pos, noteLength);

				pos += noteLength;

				transaction.NoteNonce = converters.byteArrayToString(byteArray, pos, 32);

				if (transaction.PurchaseId !== data.purchaseId || transaction.RefundMilliLm !== data.refundMilliLm ||
						transaction.Note !== data.note || transaction.NoteNonce !== data.noteNonce) {
					return false;
				}

				break;
			case "leaseBalance":
				if (transaction.Type !== 4 && transaction.Subtype !== 0) {
					return false;
				}

				transaction.Period = String(converters.byteArrayToSignedShort(byteArray, pos));

				if (transaction.Period !== data.period) {
					return false;
				}

				break;
			default:
				//invalid requestType..
				return false;
		}
		return true;
	}

	function BroadcastTransactionBytes(transactionData, callback, original_response, original_data) {
		$.ajax({
			url: Lm.Server + "/api?requestType=broadcastTransaction",
			crossDomain: true,
			dataType: "json",
			type: "POST",
			timeout: 30000,
			async: true,
			data: {
				"transactionBytes": transactionData
			}
		}).done(function(response, status, xhr) {
			if (Lm.Console) {
				Lm.AddToConsole(this.url, this.type, this.data, response);
			}

			if (callback) {
				if (response.errorCode && !response.errorDescription) {
					response.errorDescription = (response.errorMessage ? response.errorMessage : "Unknown error occured.");
					callback(response, original_data);
				} else if (response.error) {
					response.errorCode = 1;
					response.errorDescription = response.error;
					callback(response, original_data);
				} else {
					if ("transactionBytes" in original_response) {
						delete original_response.transactionBytes;
					}
					original_response.broadcasted = true;
					original_response.transaction = response.transaction;
					original_response.fullHash = response.fullHash;
					callback(original_response, original_data);
				}
			}
		}).fail(function(xhr, textStatus, error) {
			if (Lm.Console) {
				Lm.AddToConsole(this.url, this.type, this.data, error, true);
			}

			if (callback) {
				if (error == "timeout") {
					error = "The request timed out. Warning: This does not mean the request did "+
						"not go through. You should a few blocks and see if your request has been "+
						"processed before trying to submit it again.";
				}
				callback({
					"errorCode": -1,
					"errorDescription": error
				}, {});
			}
		});
	}


	Lm.BroadcastTransactionBytes = BroadcastTransactionBytes;
	Lm.ProcessAjaxRequest = ProcessAjaxRequest;
	Lm.SendOutsideRequest = SendOutsideRequest;
	Lm.SendRequest = SendRequest;
	Lm.VerifyTransactionBytes = VerifyTransactionBytes;
	return Lm;
}(Lm || {}, jQuery));