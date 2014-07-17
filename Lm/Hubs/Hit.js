/**!
 * LibreMoney hit 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Hit(hub, hitTime) {
	var obj = {};
	/*
	public final Hub hub;
	public final long hitTime;
	*/
	/*
	this.hub = hub;
	this.hitTime = hitTime;
	*/
	return obj;
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
