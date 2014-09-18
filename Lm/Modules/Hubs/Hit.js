/**!
 * LibreMoney Hit 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Hit(hub, hitTime) {
	this.hub = hub;
	this.hitTime = hitTime;
	return this;
}

function CompareTo(hit) {
	throw 'Not';
	/*
	if (this.hitTime < hit.hitTime) {
		return -1;
	} else if (this.hitTime > hit.hitTime) {
		return 1;
	} else {
		return this.hub.accountId.compareTo(hit.hub.accountId);
	}
	*/
}


Hit.prototype.CompareTo = CompareTo;


module.exports = Hit;
