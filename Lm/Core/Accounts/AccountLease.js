/**!
 * LibreMoney 0.1
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

module.exports = AccountLease;
