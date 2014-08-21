/**
 * @depends {lm.js}
 */
var Lm = (function(Lm, $, undefined) {
	function LoadContacts() {
		Lm.Contacts = {};

		Lm.Database.select("contacts", null, function(error, contacts) {
			if (contacts && contacts.length) {
				$.each(contacts, function(index, contact) {
					Lm.Contacts[contact.account] = contact;
				});
			}
		});
	}

	function ContactsPage() {
		if (!Lm.DatabaseSupport) {
			$("#contact_page_database_error").show();
			$("#contacts_table_container").hide();
			$("#add_contact_button").hide();
			Lm.PageLoaded();
			return;
		}

		$("#contacts_table_container").show();
		$("#contact_page_database_error").hide();

		Lm.Database.select("contacts", null, function(error, contacts) {
			var rows = "";

			if (contacts && contacts.length) {
				contacts.sort(function(a, b) {
					if (a.name.toLowerCase() > b.name.toLowerCase()) {
						return 1;
					} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
						return -1;
					} else {
						return 0;
					}
				});

				$.each(contacts, function(index, contact) {
					var contactDescription = contact.description;

					if (contactDescription.length > 100) {
						contactDescription = contactDescription.substring(0, 100) + "...";
					} else if (!contactDescription) {
						contactDescription = "-";
					}

					rows += "<tr><td><a href='#' data-toggle='modal' data-target='#update_contact_modal' data-contact='" +
						String(contact.id).escapeHTML() + "'>" + contact.name.escapeHTML() + "</a></td>" +
						"<td><a href='#' data-user='" + Lm.GetAccountFormatted(contact, "account") + "' class='user_info'>" +
						Lm.GetAccountFormatted(contact, "account") + "</a></td>" +
						"<td>" + (contact.email ? contact.email.escapeHTML() : "-") + "</td>" +
						"<td>" + contactDescription.escapeHTML() + "</td>" +
						"<td style='white-space:nowrap'><a class='btn btn-xs btn-default' href='#' data-toggle='modal' " +
						"data-target='#send_money_modal' data-contact='" + String(contact.name).escapeHTML() + "'>" + $.t("send_lm") +
						"</a> <a class='btn btn-xs btn-default' href='#' data-toggle='modal' data-target='#send_message_modal' data-contact='" +
						String(contact.name).escapeHTML() + "'>" + $.t("message") + "</a> " +
						"<a class='btn btn-xs btn-default' href='#' data-toggle='modal' data-target='#delete_contact_modal' data-contact='" +
						String(contact.id).escapeHTML() + "'>" + $.t("delete") + "</a></td></tr>";
				});
			}

			Lm.DataLoaded(rows);
		});
	}

	function AddContactForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.account_id = String(data.account_id);

		if (!data.name) {
			return {
				"error": $.t("error_contact_name_required")
			};
		} else if (!data.account_id) {
			return {
				"error": $.t("error_account_id_required")
			};
		}

		if (/^\d+$/.test(data.name) || /^LMA\-/i.test(data.name)) {
			return {
				"error": $.t("error_contact_name_alpha")
			};
		}

		if (data.email && !/@/.test(data.email)) {
			return {
				"error": $.t("error_email_address")
			};
		}

		if (data.account_id.charAt(0) == '@') {
			var convertedAccountId = $modal.find("input[name=converted_account_id]").val();
			if (convertedAccountId) {
				data.account_id = convertedAccountId;
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		}

		if (/^LMA\-/i.test(data.account_id)) {
			data.account_rs = data.account_id;

			var address = new LmAddress();

			if (address.set(data.account_rs)) {
				data.account = address.account_id();
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		} else {
			var address = new LmAddress();

			if (address.set(data.account_id)) {
				data.account_rs = address.toString();
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		}

		Lm.SendRequest("getAccount", {
			"account": data.account_id
		}, function(response) {
			if (!response.errorCode) {
				if (response.account != data.account || response.accountRS != data.account_rs) {
					return {
						"error": $.t("error_account_id")
					};
				}
			}
		}, false);

		var $btn = $modal.find("button.btn-primary:not([data-dismiss=modal], .ignore)");

		Lm.Database.select("contacts", [{
			"account": data.account_id
		}, {
			"name": data.name
		}], function(error, contacts) {
			if (contacts && contacts.length) {
				if (contacts[0].name == data.name) {
					$modal.find(".error_message").html($.t("error_contact_name_exists")).show();
				} else {
					$modal.find(".error_message").html($.t("error_contact_account_id_exists")).show();
				}
				$btn.button("reset");
				$modal.modal("unlock");
			} else {
				Lm.Database.insert("contacts", {
					name: data.name,
					email: data.email,
					account: data.account_id,
					accountRS: data.account_rs,
					description: data.description
				}, function(error) {
					Lm.Contacts[data.account_id] = {
						name: data.name,
						email: data.email,
						account: data.account_id,
						accountRS: data.account_rs,
						description: data.description
					};

					setTimeout(function() {
						$btn.button("reset");
						$modal.modal("unlock");
						$modal.modal("hide");
						$.growl($.t("success_contact_add"), {
							"type": "success"
						});

						if (Lm.CurrentPage == "contacts") {
							Lm.LoadPage("contacts");
						} else if (Lm.CurrentPage == "messages" && Lm.SelectedContext) {
							var heading = Lm.SelectedContext.find("h4.list-group-item-heading");
							if (heading.length) {
								heading.html(data.name.escapeHTML());
							}
							Lm.SelectedContext.data("context", "messages_sidebar_update_context");
						}
					}, 50);
				});
			}
		});
	}

	function UpdateContractModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var contactId = parseInt($invoker.data("contact"), 10);

		if (!contactId && Lm.SelectedContext) {
			var accountId = Lm.SelectedContext.data("account");

			var dbKey = (/^LMA\-/i.test(accountId) ? "accountRS" : "account");

			var dbQuery = {};
			dbQuery[dbKey] = accountId;

			Lm.Database.select("contacts", [dbQuery], function(error, contact) {
				contact = contact[0];

				$("#update_contact_id").val(contact.id);
				$("#update_contact_name").val(contact.name);
				$("#update_contact_email").val(contact.email);
				$("#update_contact_account_id").val(contact.accountRS);
				$("#update_contact_description").val(contact.description);
			});
		} else {
			$("#update_contact_id").val(contactId);

			Lm.Database.select("contacts", [{
				"id": contactId
			}], function(error, contact) {
				contact = contact[0];

				$("#update_contact_name").val(contact.name);
				$("#update_contact_email").val(contact.email);
				$("#update_contact_account_id").val(contact.accountRS);
				$("#update_contact_description").val(contact.description);
			});
		}
	}

	function UpdateContactForm($modal) {
		var data = Lm.GetFormData($modal.find("form:first"));

		data.account_id = String(data.account_id);

		if (!data.name) {
			return {
				"error": $.t("error_contact_name_required")
			};
		} else if (!data.account_id) {
			return {
				"error": $.t("error_account_id_required")
			};
		}

		if (data.account_id.charAt(0) == '@') {
			var convertedAccountId = $modal.find("input[name=converted_account_id]").val();
			if (convertedAccountId) {
				data.account_id = convertedAccountId;
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		}

		var contactId = parseInt($("#update_contact_id").val(), 10);

		if (!contactId) {
			return {
				"error": $.t("error_contact")
			};
		}

		if (/^LMA\-/i.test(data.account_id)) {
			data.account_rs = data.account_id;

			var address = new LmAddress();

			if (address.set(data.account_rs)) {
				data.account_id = address.account_id();
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		} else {
			var address = new LmAddress();

			if (address.set(data.account_id)) {
				data.account_rs = address.toString();
			} else {
				return {
					"error": $.t("error_account_id")
				};
			}
		}

		Lm.SendRequest("getAccount", {
			"account": data.account_id
		}, function(response) {
			if (!response.errorCode) {
				if (response.account != data.account_id || response.accountRS != data.account_rs) {
					return {
						"error": $.t("error_account_id")
					};
				}
			}
		}, false);

		var $btn = $modal.find("button.btn-primary:not([data-dismiss=modal])");

		Lm.Database.select("contacts", [{
			"account": data.account_id
		}], function(error, contacts) {
			if (contacts && contacts.length && contacts[0].id != contactId) {
				$modal.find(".error_message").html($.t("error_contact_exists")).show();
				$btn.button("reset");
				$modal.modal("unlock");
			} else {
				Lm.Database.update("contacts", {
					name: data.name,
					email: data.email,
					account: data.account_id,
					accountRS: data.account_rs,
					description: data.description
				}, [{
					"id": contactId
				}], function(error) {
					if (contacts.length && data.account_id != contacts[0].accountId) {
						delete Lm.Contacts[contacts[0].accountId];
					}

					Lm.Contacts[data.account_id] = {
						name: data.name,
						email: data.email,
						account: data.account_id,
						accountRS: data.account_rs,
						description: data.description
					};

					setTimeout(function() {
						$btn.button("reset");
						$modal.modal("unlock");
						$modal.modal("hide");
						$.growl($.t("success_contact_update"), {
							"type": "success"
						});

						if (Lm.CurrentPage == "contacts") {
							Lm.LoadPage("contacts");
						} else if (Lm.CurrentPage == "messages" && Lm.SelectedContext) {
							var heading = Lm.SelectedContext.find("h4.list-group-item-heading");
							if (heading.length) {
								heading.html(data.name.escapeHTML());
							}
						}
					}, 50);
				});
			}
		});
	}

	function DeleteContactModal_OnShow(e) {
		var $invoker = $(e.relatedTarget);

		var contactId = $invoker.data("contact");

		$("#delete_contact_id").val(contactId);

		Lm.Database.select("contacts", [{
			"id": contactId
		}], function(error, contact) {
			contact = contact[0];

			$("#delete_contact_name").html(contact.name.escapeHTML());
			$("#delete_contact_account_id").val(Lm.GetAccountFormatted(contact, "account"));
		});
	}

	function DeleteContactForm($modal) {
		var id = parseInt($("#delete_contact_id").val(), 10);

		Lm.Database.delete("contacts", [{
			"id": id
		}], function() {
			delete Lm.Contacts[$("#delete_contact_account_id").val()];

			setTimeout(function() {
				$.growl($.t("success_contact_delete"), {
					"type": "success"
				});

				if (Lm.CurrentPage == "contacts") {
					Lm.LoadPage("contacts");
				}
			}, 50);
		});

		return {
			"stop": true
		};
	}


	$("#update_contact_modal").on("show.bs.modal", UpdateContractModal_OnShow);
	$("#delete_contact_modal").on("show.bs.modal", DeleteContactModal_OnShow);


	Lm.LoadContacts = LoadContacts;
	Lm.Pages.Contacts = ContactsPage;
	Lm.Forms.AddContact = AddContactForm;
	Lm.Forms.UpdateContact = UpdateContactForm;
	Lm.Forms.DeleteContact = DeleteContactForm;
	return Lm;
}(Lm || {}, jQuery));