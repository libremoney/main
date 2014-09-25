/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

private AccountLease(LessorId, LesseeId, FromHeight, ToHeight) {
	this.LessorId = LessorId;
	this.LesseeId = LesseeId;
	this.FromHeight = FromHeight;
	this.ToHeight = ToHeight;
	return this;
}


if (typeof module !== "undefined") {
	module.exports = AccountLease;
}