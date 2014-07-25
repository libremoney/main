var widgetIds = ["transactions", "peers", "blocks", "accounts"];
var widgetToggleClassNames = ["Transactions", "Peers", "Blocks", "Accounts"];
var advancedWidgetIds = ["library", "shops", "assetExchange", "reputation"];
var advancedWidgetToggleClassNames = ["Library", "Shops", "AssetExchange", "Reputation"];
var user = Math.random();
var numberOfPendingRequests = 0;
var account = "";
var selectedAssetId;

function adjustAmount() {
	var quantity = parseInt(document.getElementById("input").value);
	var price = parseFloat(document.getElementById("price").value);
	document.getElementById("amount").value = isNaN(quantity) || isNaN(price) ? "" : quantity * price;
}

function adjustDeadlineTime() {
	var deadline = document.getElementById("deadline").value;
	document.getElementById("deadlineTime").value = isNaN(deadline) ? "" :
		("~ " + (new Date((new Date()).getTime() + deadline * 3600000)).toLocaleString());
}

function adjustFee() {
	var amount = parseInt(document.getElementById("amountLm").value);
	document.getElementById("feeLm").value = isNaN(amount) ? 1 : (amount < 500 ? 1 : Math.round(amount / 1000));
}

function adjustSections(widgetIndex, widgetHeight, sections) {
	var widget = document.getElementById(widgetIds[widgetIndex]),
		widgetWidth = parseInt(widget.style.width.substr(0, widget.style.width.length - 2));
	var section2 = document.getElementById(sections[1]), section3 = document.getElementById(sections[2]),
		section1Frame = document.getElementById(sections[0] + "Frame"),
		section2Frame = document.getElementById(sections[1] + "Frame"),
		section3Frame = document.getElementById(sections[2] + "Frame");
	section3.style.width = section2.style.width = document.getElementById(sections[0]).style.width = (widgetWidth - 30) + "px";
	section3Frame.style.width = section2Frame.style.width = section1Frame.style.width = (widgetWidth - 20 - 2) + "px";
	var sectionVisibilityFlags = [document.getElementById(sections[0] + "Collapse").style.display != "none",
		document.getElementById(sections[1] + "Collapse").style.display != "none",
		document.getElementById(sections[2] + "Collapse").style.display != "none"], sectionHeight = 0;
	for (i = 3; i-- > 0; ) {
		if (sectionVisibilityFlags[i]) {
			sectionHeight++;
		}
	}
	sectionHeight = sectionHeight == 0 ? 0 : Math.floor((widgetHeight - 30 - 115) / sectionHeight);
	section1Frame.style.height = (sectionHeight - 1) + "px";
	section2.style.top = (45 + (sectionVisibilityFlags[0] ? sectionHeight : 0)) + "px";
	section2Frame.style.top = (70 + (sectionVisibilityFlags[0] ? sectionHeight : 0)) + "px";
	section2Frame.style.height = (sectionHeight - 1) + "px";
	section3.style.top = (70 + (sectionVisibilityFlags[0] ? sectionHeight : 0) +
		(sectionVisibilityFlags[1] ? sectionHeight : 0) + 10) + "px";
	section3Frame.style.top = (105 + (sectionVisibilityFlags[0] ? sectionHeight : 0) +
		(sectionVisibilityFlags[1] ? sectionHeight : 0)) + "px";
	section3Frame.style.height = (widgetHeight - 30 - (105 + (sectionVisibilityFlags[0] ? sectionHeight : 0) +
		(sectionVisibilityFlags[1] ? sectionHeight : 0)) - 10 - 1) + "px";
	section1Frame.style.display = sectionVisibilityFlags[0] ? "block" : "none";
	section2Frame.style.display = sectionVisibilityFlags[1] ? "block" : "none";
	section3Frame.style.display = sectionVisibilityFlags[2] ? "block" : "none";
}

function adjustWidgets() {
	var visibleWidgets = [], i, widget, widgetWidth, widgetHeight;
	for (i = 0; i < 4; i++) {
		widget = document.getElementById(widgetIds[i]);
		if (document.getElementById(widgetIds[i] + "Toggle").className == "enabled" + widgetToggleClassNames[i]) {
			widget.style.display = "block";
			visibleWidgets[visibleWidgets.length] = widget;
		} else {
			widget.style.display = "none";
		}
	}
	widgetWidth = Math.floor((innerWidth - 10 - visibleWidgets.length * 10) / visibleWidgets.length);
	widgetHeight = innerHeight - 122;
	for (i = visibleWidgets.length; i-- > 0; ) {
		visibleWidgets[i].style.left = (10 + i * (widgetWidth + 10)) + "px";
		visibleWidgets[i].style.width = ((i == visibleWidgets.length - 1 ? (innerWidth - 10 - 10 * visibleWidgets.length - i * widgetWidth)
			: widgetWidth) - 2) + "px";
		visibleWidgets[i].style.height = widgetHeight + "px";
		document.getElementById(visibleWidgets[i].id + "Content").style.height = (innerHeight - 102) + "px";
	}
	if (document.getElementById(widgetIds[0] + "Toggle").className == "enabledTransactions") {
		adjustSections(0, widgetHeight, ["myTransactions", "unconfirmedTransactions", "doubleSpendingTransactions"]);
	}
	if (document.getElementById(widgetIds[1] + "Toggle").className == "enabledPeers") {
		adjustSections(1, widgetHeight, ["activePeers", "knownPeers", "blacklistedPeers"]);
	}
	if (document.getElementById(widgetIds[2] + "Toggle").className == "enabledBlocks") {
		adjustSections(2, widgetHeight, ["recentBlocks", "orphanedBlocks", "weirdBlocks"]);
	}
	if (document.getElementById(widgetIds[3] + "Toggle").className == "enabledAccounts") {
		adjustSections(3, widgetHeight, ["activeAccounts", "newAccounts", "suspiciousAccounts"]);
	}
}

function closeDialog() {
	document.getElementById("interfaceDisabler").style.display = "none";
}

function collapse(section) {
	document.getElementById(section + "Expand").style.display = "block";
	document.getElementById(section + "Collapse").style.display = "none";
	adjustWidgets();
}

function expand(section) {
	document.getElementById(section + "Expand").style.display = "none";
	document.getElementById(section + "Collapse").style.display = "block";
	adjustWidgets();
}

function formatAmount(amount) {
	var digits=[], formattedAmount = "", i, isNegative = false;
	if (amount < 0) {
		isNegative = true;
		amount = -amount;
	}
	var fractionalPart = amount % 100000000;
	amount = Math.floor(amount / 100000000);
	do {
		digits[digits.length] = amount % 10;
		amount = Math.floor(amount / 10);
	} while (amount > 0);
	for (i = 0; i < digits.length; i++) {
		if (i > 0 && i % 3 == 0) {
			formattedAmount = "'" + formattedAmount;
		}
		formattedAmount = digits[i] + formattedAmount;
	}
	if (isNegative) {
		formattedAmount = "-" + formattedAmount;
	}
	var fractionalPartString = "";
	for (i = ("" + fractionalPart).length; i < 8; i++) {
		fractionalPartString += "0";
	}
	fractionalPartString += fractionalPart;
	return formattedAmount + "<span class='cents'>." + fractionalPartString + "</span>";
}

function generateAuthorizationToken() {
	document.getElementById("input").readOnly = true;
	document.getElementById("generateAuthorizationToken").disabled = true;
	document.getElementById("secretPhrase").readOnly = true;
	sendRequest("generateAuthorizationToken", "website=" + encodeURIComponent(document.getElementById("input").value) +
		"&secretPhrase=" + encodeURIComponent(document.getElementById("secretPhrase").value));
}

function initialize() {
	adjustWidgets();
	sendRequest("getInitialData", "");
}

function issueAsset() {
	var element, name, description, quantity, fee;
	element = document.getElementById("input");
	name = element.value;
	element.readOnly = true;
	element = document.getElementById("description");
	description = element.value;
	element.readOnly = true;
	element = document.getElementById("quantity");
	quantity = element.value;
	element.readOnly = true;
	element = document.getElementById("fee");
	fee = element.value;
	element.readOnly = true;
	document.getElementById("issueAsset").disabled = true;
	sendRequest("issueAsset", "name=" + encodeURIComponent(name) + "&description=" + encodeURIComponent(description) +
		"&quantity=" + quantity + "&fee=" + fee);
}

function placeAskOrder() {
	var element, quantity, price, fee;
	element = document.getElementById("input");
	quantity = element.value;
	element.readOnly = true;
	element = document.getElementById("price");
	price = element.value;
	element.readOnly = true;
	element = document.getElementById("fee");
	fee = element.value;
	element.readOnly = true;
	document.getElementById("placeAskOrder").disabled = true;
	sendRequest("placeAskOrder", "asset=" + selectedAssetId + "&quantity=" + quantity + "&price=" + price + "&fee=" + fee);
}

function placeBidOrder() {
	var element, quantity, price, fee;
	element = document.getElementById("input");
	quantity = element.value;
	element.readOnly = true;
	element = document.getElementById("price");
	price = element.value;
	element.readOnly = true;
	element = document.getElementById("fee");
	fee = element.value;
	element.readOnly = true;
	document.getElementById("placeBidOrder").disabled = true;
	sendRequest("placeBidOrder", "asset=" + selectedAssetId + "&quantity=" + quantity + "&price=" + price + "&fee=" + fee);
}

function requestAccountLocking() {
	sendRequest("lockAccount", "");
}

function requestAssets() {
	sendRequest("getAssets", "showIssuedAssets=" + (document.getElementById("issuedAssets").className == "enabledIssuedAssets") +
		"&showOwnedAssets=" + (document.getElementById("ownedAssets").className == "enabledOwnedAssets") + "&showOtherAssets=" +
		(document.getElementById("otherAssets").className == "enabledOtherAssets"));
}

function sendMoney() {
	var element, recipient, amountLm, feeLm, deadline, secretPhrase;
	element = document.getElementById("input");
	recipient = element.value;
	element.readOnly = true;
	element = document.getElementById("amountLm");
	amountLm = element.value;
	element.readOnly = true;
	element = document.getElementById("feeLm");
	feeLm = element.value;
	element.readOnly = true;
	element = document.getElementById("deadline");
	deadline = element.value;
	element.readOnly = true;
	element = document.getElementById("secretPhrase");
	secretPhrase = element.value;
	element.readOnly = true;
	document.getElementById("sendMoney").disabled = true;
	sendRequest("sendMoney", "recipient=" + recipient + "&amountLm=" + amountLm + "&feeLm=" + feeLm + "&deadline=" + deadline +
		"&secretPhrase=" + encodeURIComponent(secretPhrase));
}

function sendRequest(cmd, requestParameters) {
	if (typeof requestParameters != undefined && requestParameters != "")
		var requestType = cmd + "&" + requestParameters
	else
		var requestType = cmd;
	console.log('sendRequest: cmd='+cmd+' requestParameters='+requestParameters);
	var request = new XMLHttpRequest();
	//var params = "user=" + user + "&requestType=" + requestParameters + "&" + Math.random();
	var params = {
		user: user,
		requestType: requestType,
		rand: Math.random()
	};
	request.open("POST", "/api");
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			sendRequest_onreadystatechange(this.responseText);
		}
	};
	numberOfPendingRequests++;
	params = JSON.stringify(params);
	request.send(params);
}


function sendRequest_onreadystatechange(responseText) {
	console.log('sendRequest_onreadystatechange: '+responseText);
	if (--numberOfPendingRequests < 1) {
		//window.setInterval(function() { sendRequest("getNewData", ""); }, 100);
		alert(1);
	}
	var responses = JSON.parse(responseText).responses;
	var i;
	var j;
	var response;
	var element;
	var object;
	var object2;
	if (!responses) return;
	for (i = 0; i < responses.length; i++) {
		response = responses[i];
		switch (response.response) {
		case "denyAccess":
			numberOfPendingRequests++;
			document.title = "Access denied";
			document.body.style.backgroundColor = "#000";
			document.body.innerHTML = "<div style='background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAAYCAMAAABHsyFpAAAC9FBMVEUBAAABCgIFJxYBEgQBEwoCGwsDGBMDJAsCCwoGNBkJOCYWVziH57aH9bqH6MaI98eW98iX+Nel+dglZ0kod1hHaFNHlXdJp3dmyaZo1aV22ad317Z66bYFLCEVOCYJRCgVSDYDBAmo6cil98obZka29tdXqIeX6cgJAQIqh1g3iVY3h2dGhlhIm2cJCwtWh2YZZTtXp3dIp4RKtYo4Z0dWuIpYt5Zot4dmupp1uZZayJdoyJlm1Jl5yZt11pokRywnSTUmVTcXWkVp5qh35akFDBF89Lp79sSFyamI1aiJ17iE5qgmV0g3WkWW6LmW9rwSJxaJ7NMpaFWJ+NRHdFgmdkkMSDRVe2MzaFdDZUsCGgSl++G5/OOZ2LUIQxsSSiwTQys0VztUd1xIeWUVNxsTQyQYdEhs1bR2yaea++Ft5rhovaQ7l3dpxIt56cVHjGWFxJhKinQcTC4JCgUWUypYi3ZVmHkJEwxKtHsKGw2F2sSW3sljh25lmXdjqXlGm4JYmYWX6dI4eEo0eltXqZOo7NQqd2Eze2S56tk2lmdcyaeKu6pni3UkZT1ymII4jHJmqZUlXVEhNyZ5qpdZ05kac1QNVThIpGk6e2U7fW9+3MM3lFlRk2gFMg6E154zfWvB+eQKUioMOzEYOjQ0XVEqhE5Rg12n6Lw3gk0bKyJnlYY6fFJ7zbNDWUsURRw0c2IdZ1N1tI2l1cVNyZQZQiRpp4ix6M0JBAuy880zSzkthmfB9txXwItTpWo3Yj51xYklcT8nOjQtlmo3o22Tx6aDyLdDe0orjHA9pnMdTCQxdVwjS0RasX1au6CT7KsaTEE5fl0SBA02elMdQSsQGBRBk1xr5ZsQBhBy4p+l37dKvJCi8L9M0I9u9bWV3tNTbGAulHBIX1IahWBc1KE0d2mAs5FynX9s0Iukz8M/dliy3M4+oV4wS0Zww381n4RlsXZwoX0KGAZ4roGYxraS3qsYcz6l7uBUbVuo/fE1dFQ+dVRwvKxgOGy0AAAMs0lEQVR4Xu1YU5wky7OezLLRtse2bdta27btPbZtG3/bNq5tv9yonp052z2zvzNzz30830NXRmVG4quIqK86AYAIMgoCriw19c0zD9XihEUBkRRFokC0ycIMKCEZmsnJN40gUCAA9sLAP7RZeXLOBMcFQdVk5OY+hGGdz4zkBdrQWDpILJjN76Z97Wvnvrjx9+/eIXzdrfStr2UX40r5v2+13s2zgQQWC2m7rac9KHaPycg7YMK3nAttr1CPtZOfskqAxYdVTdv/WODWZCyRus8OhIWC9U1NSt8MevLyFFVRXmbnT58cHwwI7xYV7ZgVBwKU77UmTesZZuM89vU7nQKNoLXw2lnNF74Q+NRjUPkVXWrrY5kxEZJ8U2DDZfGYdfxM2IGzy5sUzYA+NqZpR+5M2dTmrG1gUSxFCzKeKkqK5hpsyGRW18EcrX87c39uV2j0OVE0kYa9YISgfd3dbFziLATixaKutTyKX99Y6P8YYYHPmuxYeF+qTywRFaUsca2iPIQnn650mh8dHOQxeWN3FPYLfkzOo47gPmhT+7Q/pcnJr7vVpKRhGqjkBVPv92ZcETP5Jbd85E6e56OZSmGOxwSB/d/y0kAQojiOi/YAEHRiCubEvIdGcXQgJkMqv9Pn90/jGarA1Qd78rA3jk9QvN/vxTTNzqecwtGtI7hSKFpuGX7a7yGMHEAUE71JzHQuAVjYK9m46Yz6coH7oVM8w3H3lTc6zq9ZY8+tpZFR+/zmRJfbVXiajycOjR5v61K0/3kUC+WSqiX5aVo4Z3dv7tt88mWDDWzaWwfZv8ZuP//3gzSJB3JL7Xl33JHrkl1XMCKn0wrKyop7o7wh37mC0sIzHG/OK7Uf8cafAGirK3XJsivXTwJthNdc6Nosy1fbadY4PCNYHZtl14aT9/BsvKfJVpBo5ojRVWl5v7S1UwhhweZsvddu5imW5VPy8qweEmefyyu+G7OLj94AfmSvlMHx99WX+rj8ynoz5s7VKUqfBnC9RLMkDhe6FcNS7JBucUGQ2iaJyrFe3zm3omqygGvKJBUc143JZprd4y2S4LaBdeuO8nh7hQIkrt/cB5P3nMFclqhAd26Utn1bJFhTDpvrjaW3YRSzxwBzl9Gt67q2FphC3ldEMMbG9AP3GCMpU5kENQbWOXY6Lt5+XONUoP6+hH2HjRm+8hjFWZ2qDlDWmDG/G27KfjzcImlja42wWCwCtC/Vec6gzTHICTnOMNAGCacHO1Vt3fOP0lgoaOrrk1tFMDfwbBxtT9S31cvrvvPH2yW3rO334+2bukItJSWtId3O0yz+74qukA4IBpuv0UR3eouqAoW6lqRHtmGq+pW2rpB2EmdGNUZFCIqjIADvYwceR8mxtOG/keCsrc1Bfeykh0QrS0Khia0lLSH9eR+F0KoiRe1s3toZ0iMr4mjLXFkUUrUDj9M4HbrHL3i4DFEbOzUxERkfc4XxX8FOT/kp7xud+lgrVI7Fg8Xe9mmGv6+u3EdjvwnTXGq9qpb0d2RVqEm1HiOQNueGhUtWpyKfiRMTzECdWO5SZYeiOJxqq5+mVuXn75z0DVQk7fdDpDJVOW1i8d3DHR1ekkXon6qK4PSn3hhut1i8BCLw9tQ29ehMkhLVhztDnYlHXJre/DgZnyzMfZLauuIxb/+/6ht4OnNH1ciHXswJRbBDmmWFeqncxOHqQ8E38+PlDKra2iWl0Q2IK1JDt1XT2W1a0rMd3uqhCV1PxDi/OQS1hcUftoSaeXpJEoREiOSfqHP4SJYgWJIbKJdyOIJ4IL1NqvUImyTFdbpWEFbb1iv2uHCjPv6pZLOJKuSBrVRxAW3MIym2wtLX1is97XQDS4xeqmwzRWMfGRh9ul5NGrqxO5QcQCv/Tt09+05gvvpgSIVMvOqdnyvMT9rEXjqAmH9Qiz00kMytPpd7MtehqL2wzPbKLmei9cTU5H/1zz858dXvqmm4Aa0qU1u8CGdI2jaYABHLDKIonNHVyQOp1OGuCqBtiSD5VKCNZhFioXLf7ggTLPVAar07zP9bpaTK97rca9xuWUn6XkM8bU0p2Q+CCtlv+rbiHMR8SmmTZkDVehtAxDADleIwze4wWGMh+p5uU60YgTwG26jlL36kJs5F8OhxJxTRq/wC6oFJF8t4+i3E5KglngbEhAvcGpQ2SPlemiaZrKciEV115W2sXUA7r9waavGTOFWCJ0R6N6lreRq2goisUKcf47sk8VG6YQ/QBveXqoThleIwqhFKZvd0D9xeFyYzIerq3GEu2ykpURp0KMKn2unY2vbxz5tSJu8XFf0oZ2t0DvJpIN/0YFKSCrTRBm2Xyt29MK0BtsGgTYQnAkCscZN48S+UnFnaEANhriYlekk0n7ZUyck3/GwHkyMBfVTY0bdu7FQwCIVpGDggurMuTAThHaF/5VvzI2b0yU4It2yHAkWEqGpREz1Q/9gdxPHOpFrM2SQRnsce6tvqWg+9VBFM8gMO+yDsAGjD4V/XhekGoA2iDe+slBS5tbWlFdCSyKNY2rIrFTPzjaLO5nYuw+240+RoVJt3ddSkV3TKRpJmUtnl4gxtBHrrBz+gnmsTTRTLBgIJgejNVZsU26w85FKcqhrS9WKBitdtUdp89FuZM7RNFyha69GOZektIYi2TIR3TuLXj//jVihX1vmfcuj1ilBZtk1Rj9I0ev1BFcKDzAwgKJeiwBjR5jOqcI5iXzJtCPtS/sRRi2nSEJKrX6u7g26guCecohn7ctyNeQK3EnPc1BRHxLpBfMgbOWYq389wtnrn6jR3Y9kqapQRCkS519CelFAupmES1GjYhBGJU+rEMxiWYRHQRlCMUKYk+sAGBqdy1/eJu7c4Vc3+Mo3iaUtxO+Gpogdsit2HTaLimIY04+5yK4bQSa8vGCQIgqlZq53nyXm0UVu6JIdbg2CD9P6gS93GkyyLs0tVeAkwGUAbSdJTBcqsAEFErLInccypSeZGL8LTA18sXb+58KFajqS57L117sJaDx/e61Y3vMybKyUx8Zsmk/ldW6E1VoFQO231ssvajilmZ0qZKOcVipLjXXPaxvONirZh2AMn8m+SnFdOp12x9/SYHxn40u1Nij33yMbTPEVSvoG0jXluRS4+efQlHnQOaLpCjkkF4ea6Jy5m6Et7G2XrIOZMpQp8dYRbVHtYqDXngcD8zjUPzpGU4l7BL5xo1Z73LlTdPgJRPvYGBd8UaGdLSC0xCbWn7aoO4Ueld6lWf+0VO8jOMzwx87dM0TbPJzUcnyg4cdN28PcTT1BRY5/3/vrfNII667k3DcP+G0GErgmvLpegqsnXfD9p61KhD77z18ntDTHSZYsIcnHd/nZcswn0rtong7qLAhStfgyyk8XwdKN69z//fYtNAuUZNbSjmMZbQBne0MKaVSgAnawfCAsVcB07di2mRLGPtxi6+aTfKkqaPlacXdSlKnIPbAms3w7zRaqq9/T0yGDuolG8MH0rYTT9u6Ddaggj9Zn0Tl1PkuUeXW/2sjRhgl3IslG8tWPbMBBLDbgV+Eyc/WglnoMn2z5nsitERZwiDWOP935RDUV16S6M/W90QhOEZ3GScfVjrr8ZOg0c2IVjUzu/5VdQlS94ae+hzlAkEtyd/2fBCCBk/LzaDrOT3/jnpwzj1L9YuP6J0NuRKM5mQbRZJoIz1ngk2M8ffurt986+Wu2FawSuZMxC73wZPB++jV8x8XbkvcizuPqVYGR8fBx833v47DDO+gXMOw44+yxeQNAnGC9s/SreEzWZ/i8baz589rZqo1LgQzemejgyvotiYcf9wVDEMhdexJNwmPa57WReDOlvVlNRg1qZf/8hwK5+EKGUdyQ9q7+GGv1R/oqh/h8hRFBVliezsrKGLNVxX7toX1V+vqXjGRiDq/MtI+/sI7qX9cPAjvwRy0hVdC3UvWxk+ZBlGQyiqjpGLFG8sw9BkFfDsOiNF6r3oO6a/JEXvgDhWTNieeF6XF0nri8Dr2cQXT1iWf6HboS8I1mHDg1ZLMuHftdBo+7qkeVgXxx6YWHlhR4oUlvnjo6u9x/888uXLT8GGWTsz3Lx8uWL/2E5eBAWMM7X3X9wqPsT35XLD1pumvY6mHOlD8gBoKiJDCTMtua6jXYMazEjoAXGnA8YNw1GCzQBn/gaRvyA+IVifeAaN5VhLww0Ci/8RBrFjL7ZImJd4yZCt+hdUOQtRsIkzw5N/hSnQGC+7xIXA9y0SnK86y2PgggGT9okt4lE8Q639vsczHFr7vsgPRON/5gWic85RDWi8Y0T0sdvw+SivT7HypJXg8Hgm3/9lyvYJXh9DvqZKLrZzP/H3Ptfnz6ceiiCCGEAAAAASUVORK5CYII=); height:24px; left:50%; margin: -12px -155px; top:50%; width: 310px;'></div>";
			break;
		case "lockAccount":
			document.getElementById("unlock").style.display = "block";
			document.getElementById("lock").style.display = "none";
			document.getElementById("account").style.display = "none";
			account = "";
			document.getElementById("balance").style.display = "none";
			document.getElementById("enabledSendMoney").style.display = "none";
			document.getElementById("disabledSendMoney").style.display = "none";
			document.getElementById("myTransactionsFrame").contentWindow.removeAllTransactions();
			document.getElementById("recentBlocksFrame").contentWindow.setDeadline(-1);
			break;
		case "notifyOfAcceptedAskOrder":
			showMessage("The order is placed.");
			break;
		case "notifyOfAcceptedAssetIssuence":
			showMessage("The asset is issued.");
			break;
		case "notifyOfAcceptedBidOrder":
			showMessage("The order is placed.");
			break;
		case "notifyOfAcceptedTransaction":
			showMessage("The money is sent.");
			break;
		case "notifyOfIncorrectAskOrder":
			showMessage(response.message, function() {
				showAskOrderDialog(response.quantity, response.price, response.fee);
			});
			break;
		case "notifyOfIncorrectAssetIssuence":
			showMessage(response.message, function() {
				showAssetDialog(response.name, response.description, response.quantity, response.fee);
			});
			break;
		case "notifyOfIncorrectBidOrder":
			showMessage(response.message, function() {
				showBidOrderDialog(response.quantity, response.price, response.fee);
			});
			break;
		case "notifyOfIncorrectTransaction":
			showMessage(response.message, function() {
				showTransactionDialog(response.recipient, response.amountLm, response.feeLm, response.deadline);
			});
			break;
		case "processInitialData":document.title = "Lm " + response.version;
			if (response.unconfirmedTransactions) {
				document.getElementById("unconfirmedTransactionsFrame").contentWindow.addTransactions(response.unconfirmedTransactions);
			}
			if (response.activePeers) {
				document.getElementById("activePeersFrame").contentWindow.addPeers(response.activePeers);
			}
			if (response.knownPeers) {
				document.getElementById("knownPeersFrame").contentWindow.addPeers(response.knownPeers);
			}
			if (response.blacklistedPeers) {
				document.getElementById("blacklistedPeersFrame").contentWindow.addPeers(response.blacklistedPeers);
			}
			if (response.recentBlocks) {
				document.getElementById("recentBlocksFrame").contentWindow.addBlocks(response.recentBlocks, false);
			}
			break;
		case "processNewData":
			if (response.addedMyTransactions) {
				document.getElementById("myTransactionsFrame").contentWindow.addTransactions(response.addedMyTransactions, false);
			}
			if (response.addedConfirmedTransactions) {
				for (j = 0; j < response.addedConfirmedTransactions.length; j++) {
					object = response.addedConfirmedTransactions[j];
					if (object.sender == account) {
						object2 = {"index": object.index, "blockTimestamp": object.blockTimestamp,
							"transactionTimestamp": object.transactionTimestamp, "account": object.recipient,
							"sentAmountNQT": object.amountNQT, "feeNQT": object.feeNQT, "numberOfConfirmations": 0, "id": object.id};
						if (object.recipient == account) {
							object2.receivedAmountNQT = object.amountNQT;
						}
						document.getElementById("myTransactionsFrame").contentWindow.addTransaction(object2, true);
					} else if (object.recipient == account) {
						document.getElementById("myTransactionsFrame").contentWindow.addTransaction(
							{"index": object.index, "blockTimestamp": object.blockTimestamp,
							"transactionTimestamp": object.transactionTimestamp, "account": object.sender,
							"receivedAmountNQT": object.amountNQT, "feeNQT": object.feeNQT, "numberOfConfirmations": 0,
							"id": object.id}, true);
					}
				}
				;
			}
			if (response.addedUnconfirmedTransactions) {
				for (j = 0; j < response.addedUnconfirmedTransactions.length; j++) {
					object = response.addedUnconfirmedTransactions[j];
					if (object.sender == account) {
						object2 = {"index": object.index, "transactionTimestamp": object.timestamp, "deadline": object.deadline,
							"account": object.recipient, "sentAmountNQT": object.amountNQT, "feeNQT": object.feeNQT,
							"numberOfConfirmations": -1, "id": object.id};
						if (object.recipient == account) {
							object2.receivedAmount = object.amount;
						}
						document.getElementById("myTransactionsFrame").contentWindow.addTransaction(object2, true);
					} else if (object.recipient == account) {
						document.getElementById("myTransactionsFrame").contentWindow.addTransaction({"index": object.index,
							"transactionTimestamp": object.timestamp, "deadline": object.deadline, "account": object.sender,
							"receivedAmountNQT": object.amountNQT, "feeNQT": object.feeNQT, "numberOfConfirmations": -1, "id": object.id},
							true);
					}
				}
				document.getElementById("unconfirmedTransactionsFrame").contentWindow.addTransactions(response.addedUnconfirmedTransactions);
			}
			if (response.removedUnconfirmedTransactions) {
				document.getElementById("myTransactionsFrame").contentWindow.removeTransactions(response.removedUnconfirmedTransactions);
				document.getElementById("unconfirmedTransactionsFrame").contentWindow.removeTransactions(
					response.removedUnconfirmedTransactions);
			}
			if (response.addedActivePeers) {
				document.getElementById("activePeersFrame").contentWindow.addPeers(response.addedActivePeers);
			}
			if (response.addedKnownPeers) {
				document.getElementById("knownPeersFrame").contentWindow.addPeers(response.addedKnownPeers);
			}
			if (response.addedBlacklistedPeers) {
				document.getElementById("blacklistedPeersFrame").contentWindow.addPeers(response.addedBlacklistedPeers);
			}
			if (response.changedActivePeers) {
				document.getElementById("activePeersFrame").contentWindow.changePeers(response.changedActivePeers);
			}
			if (response.removedActivePeers) {
				document.getElementById("activePeersFrame").contentWindow.removePeers(response.removedActivePeers);
			}
			if (response.removedKnownPeers) {
				document.getElementById("knownPeersFrame").contentWindow.removePeers(response.removedKnownPeers);
			}
			if (response.removedBlacklistedPeers) {
				document.getElementById("blacklistedPeersFrame").contentWindow.removePeers(response.removedBlacklistedPeers);
			}
			if (response.addedRecentBlocks) {
				document.getElementById("myTransactionsFrame").contentWindow.incrementNumberOfConfirmations();
				for (j = 0; j < response.addedRecentBlocks.length; j++) {
					object = response.addedRecentBlocks[j];
					if (object.generator == account && object.totalFee > 0) {
						document.getElementById("myTransactionsFrame").contentWindow.addTransaction({"index": "block" + object.index,
							"blockTimestamp": object.timestamp, "block": object.block, "earnedAmountNQT": object.totalFeeNQT,
							"numberOfConfirmations": 0, "id": "-"}, true);
					}
				}
				document.getElementById("recentBlocksFrame").contentWindow.addBlocks(response.addedRecentBlocks, true);
			}
			if (response.addedOrphanedBlocks) {
				document.getElementById("recentBlocksFrame").contentWindow.removeBlocks(response.addedOrphanedBlocks);
				document.getElementById("orphanedBlocksFrame").contentWindow.addBlocks(response.addedOrphanedBlocks);
			}
			break;
		case "requestAssets":
			requestAssets();
			break;
		case "setBalance":
			document.getElementById("balance").innerHTML = formatAmount(response.balanceNQT);
			document.getElementById("enabledSendMoney").style.display = response.balanceNQT > 0 ? "block" : "none";
			document.getElementById("disabledSendMoney").style.display = response.balanceNQT > 0 ? "none" : "block";
			break;
		case "setBlockGenerationDeadline":
			document.getElementById("recentBlocksFrame").contentWindow.setDeadline(response.deadline);
			break;
		case "showAuthorizationToken":
			showDialog("Authorization", "<table style='margin-top: 50px;'><tr><td class='label'>Authorization token</td></tr>"
				+ "<tr><td class='input'><textarea id='input'>" + response.token + "</textarea></td></tr></table>");
			break;
		case "showMessage":
			showMessage(response.message);
			break;
		case "unlockAccount":
			document.getElementById("lock").style.display = "block";
			document.getElementById("unlock").style.display = "none";
			account = response.account;
			element = document.getElementById("account");
			element.innerHTML = account +
				"<div class='key' title='Click to authorize on a third-party website with this account' onclick='showAuthorizationDialog();'></div>";
			element.style.display = "block";
			element = document.getElementById("balance");
			element.innerHTML = formatAmount(response.balanceNQT);
			element.style.display = "block";
			document.getElementById(response.balanceNQT > 0 ? "enabledSendMoney" : "disabledSendMoney").style.display = "block";
			closeDialog();
			if (response.secretPhraseStrength < 4) {
				showMessage("Your secret phrase is <b>too short</b><br>and can be easily picked by a hacker!");
			}
			break;
		case "updateAssets":
			document.getElementById("assetsFrame").contentWindow.updateAssets(response.assets);
			break;
		}
	}
}



function setSelectedAsset(assetId) {
	selectedAssetId = assetId;
}

function showAccountDialog() {
	showDialog("Account", "<table style='margin-top: 20px;'><tr><td class='label'>Secret phrase</td></tr>" +
		"<tr><td class='input'><input type='password' id='input' onkeydown='if (event.keyCode == 13) unlockAccount(); else if (event.keyCode == 27) closeDialog();'></td></tr>" +
		"<tr><td><button id='unlockAccount' onclick='unlockAccount();'>Unlock account</button></td></tr>" +
		"<tr><td><b>If opening a new account, please note:</b><br /> " +
		"A simple passphrase will certainly result in your Lm being stolen! Do not use any phrase that appears in any printed or online material, " +
		"no matter how long or obscure. A secure passphrase will be at least 35 characters long and consist of random letters, numbers, and special " +
		"characters, or a meaningless combination of 10 random words.</td></tr></table>");
}

function showAuthorizationDialog() {
	showDialog("Authorization", "<table style='margin-top: 50px;'><tr><td class='label'>Website</td></tr>" +
	"<tr><td class='input'><input id='input' onkeydown='if (event.keyCode == 13) generateAuthorizationToken(); else if (event.keyCode == 27) closeDialog();'></td></tr>" +
	"<tr><td class='label'>Secret phrase</td></tr>" +
	"<tr><td class='input'><input type='password' id='secretPhrase' onkeydown='if (event.keyCode == 13) generateAuthorizationToken(); else if (event.keyCode == 27) closeDialog();'></td></tr>" +
	"<tr><td><button id='generateAuthorizationToken' onclick='generateAuthorizationToken();'>Generate authorization token</button></td></tr></table>");
}

function showDialog(title, content, oncloseFunction) {
	document.getElementById("dialogTitle").innerHTML = title;
	document.getElementById("dialogContent").innerHTML = content;
	document.getElementById("dialogClose").onclick = oncloseFunction ? oncloseFunction : closeDialog;
	document.getElementById("interfaceDisabler").style.display = "block";
	var input = document.getElementById("input");
	if (input != null) {
		input.focus();
	}
}

function showMessage(message, oncloseFunction) {
	showDialog("Message", "<table><tr><td class='message'>" + message + "</td></tr></table>", oncloseFunction);
}

function showAskOrderDialog(quantity, price, fee) {
	showDialog("Ask order", "<table style='margin-top: 38px;'>" +
		"<tr><td class='label' style='padding-top: 0;'>Quantity</td><td class='label' style='padding-top: 0;'>Price</td></tr>" +
		"<tr><td class='input'><input type='number' id='input' oninput='adjustAmount();'></td><td class='input'><input type='number' id='price' oninput='adjustAmount();'></td></tr>" +
		"<tr><td class='label' style='padding-top: 0;'>Amount</td><td class='label' style='padding-top: 0;'>Fee</td></tr>" +
		"<tr><td class='input'><input type='number' id='amount' readonly></td><td class='input'><input type='number' id='fee'></td></tr>" +
		"<tr><td colspan='2'><button id='placeAskOrder' onclick='placeAskOrder();'>Place ask order</button></td></tr></table>");
	document.getElementById("input").value = quantity;
	document.getElementById("price").value = price;
	document.getElementById("fee").value = fee;
}

function showAssetDialog(name, description, quantity, fee) {
	showDialog("Asset", "<table><tr><td class='label' colspan='2'>Name</td></tr><tr><td class='input' colspan='2'><input id='input' maxlength='20'></td></tr>" +
		"<tr><td class='label' colspan='2'>Description</td></tr><tr><td class='input' colspan='2'><input id='description' maxlength='1000'></td></tr>" +
		"<tr><td class='label' style='padding-top: 0;'>Quantity</td><td class='label' style='padding-top: 0;'>Fee</td></tr>" +
		"<tr><td class='input'><input type='number' id='quantity'></td><td class='input'><input type='number' id='fee'></td></tr>" +
		"<tr><td colspan='2'><button id='issueAsset' onclick='issueAsset();'>Issue asset</button></td></tr></table>");
	document.getElementById("input").value = name;
	document.getElementById("description").value = description;
	document.getElementById("quantity").value = quantity;
	document.getElementById("fee").value = fee;
}

function showBidOrderDialog(quantity, price, fee) {
	showDialog("Bid order", "<table style='margin-top: 38px;'>" +
		"<tr><td class='label' style='padding-top: 0;'>Quantity</td><td class='label' style='padding-top: 0;'>Price</td></tr>" +
		"<tr><td class='input'><input type='number' id='input' oninput='adjustAmount();'></td><td class='input'><input type='number' id='price' oninput='adjustAmount();'></td></tr>" +
		"<tr><td class='label' style='padding-top: 0;'>Amount</td><td class='label' style='padding-top: 0;'>Fee</td></tr>" +
		"<tr><td class='input'><input type='number' id='amount' readonly></td><td class='input'><input type='number' id='fee'></td></tr>" +
		"<tr><td colspan='2'><button id='placeBidOrder' onclick='placeBidOrder();'>Place bid order</button></td></tr></table>");
	document.getElementById("input").value = quantity;
	document.getElementById("price").value = price;
	document.getElementById("fee").value = fee;
}

function showTransactionDialog(recipient, amountLm, feeLm, deadline) {
	showDialog("Transaction", "<table><tr><td class='label' colspan='2'>Recipient</td></tr><tr><td class='input' colspan='2'><input id='input'></td></tr>" +
		"<tr><td class='label' style='padding-top: 0;'>Amount</td><td class='label' style='padding-top: 0;'>Fee</td></tr>" +
		"<tr><td class='input'><input type='number' id='amountLm' oninput='adjustFee();'></td><td class='input'><input type='number' id='feeLm'></td></tr>" +
		"<tr><td class='label' colspan='2' style='padding-top: 0;'>Deadline (in hours)</td></tr><tr><td class='input'><input type='number' id='deadline' oninput='adjustDeadlineTime();'></td>" +
			"<td class='input'><input id='deadlineTime' readonly></td></tr>" +
		"<tr><td class='label' colspan='2'>Secret phrase</td></tr>" +
		"<tr><td class='input' colspan='2'><input type='password' id='secretPhrase'></td></tr>" +
		"<tr><td colspan='2'><button id='sendMoney' onclick='sendMoney();'>Send money</button></td></tr></table>");
	document.getElementById("input").value = recipient;
	document.getElementById("amount").value = amount;
	document.getElementById("fee").value = fee;
	document.getElementById("deadline").value = deadline;
	adjustDeadlineTime();
}

function toggleAdvancedWidget(advancedWidgetIndex) {
	var advancedWidgetToggle = document.getElementById(advancedWidgetIds[advancedWidgetIndex] + "Toggle"), i, element;
	if (advancedWidgetToggle.className == "enabled" + advancedWidgetToggleClassNames[advancedWidgetIndex]) {
		advancedWidgetToggle.className = "disabled" + advancedWidgetToggleClassNames[advancedWidgetIndex];
	} else {
		for (i = 0; i < 4; i++) {
			element = document.getElementById(advancedWidgetIds[i] + "Toggle");
			if (element.className == "enabled" + advancedWidgetToggleClassNames[i]) {
				element.className = "disabled" + advancedWidgetToggleClassNames[i];
			}
		}
		advancedWidgetToggle.className = "enabled" + advancedWidgetToggleClassNames[advancedWidgetIndex];
		switch (advancedWidgetIndex) {
		case 2:
			requestAssets();
			break;
		}
	}
	adjustWidgets();
}

function toggleAssetFilter(filterIndex) {
	var filterIds = ["issued", "owned", "other"], filterClassNames = ["Issued", "Owned", "Other"],
		element = document.getElementById(filterIds[filterIndex] + "Assets");
	element.className = element.className == "enabled" + filterClassNames[filterIndex] + "Assets" ?
		("disabled" + filterClassNames[filterIndex] + "Assets") : ("enabled" + filterClassNames[filterIndex] + "Assets");
	requestAssets();
}

function toggleWidget(widgetIndex) {
	var widgetToggle = document.getElementById(widgetIds[widgetIndex] + "Toggle");
	if (widgetToggle.className == "enabled" + widgetToggleClassNames[widgetIndex]) {
		widgetToggle.className = "disabled" + widgetToggleClassNames[widgetIndex];
	} else {
		widgetToggle.className = "enabled" + widgetToggleClassNames[widgetIndex];
	}
	adjustWidgets();
}

function unlockAccount() {
	document.getElementById("input").readOnly = true;
	document.getElementById("unlockAccount").disabled = true;
	sendRequest("unlockAccount", "secretPhrase=" + encodeURIComponent(document.getElementById("input").value));
}
