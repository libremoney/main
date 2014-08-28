/**!
 * LibreMoney accounts 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function GuaranteedBalance(height, balance) {
	this.height = height;
	this.balance = balance;
	this.ignore = false;
	return this;
}

function CompareTo(o) {
	if (this.height < o.height) {
		return -1;
	} else if (this.height > o.height) {
		return 1;
	}
	return 0;
}

function ToString() {
	return "height: " + this.height + ", guaranteed: " + this.balance;
}


GuaranteedBalance.prototype.CompareTo = CompareTo;
GuaranteedBalance.prototype.ToString = ToString;


module.exports = GuaranteedBalance;
