/**!
 * LibreMoney Project 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
State: 0 - Announce; 1 - Start founding; 2 - WorkBegin; 3 - WorkSuccess
*/
function Project(group, projGroup, name, description, author, state, sum1, sum2, announceTime, startTime, beginTime, endTime) {
	this.group = group;
	this.projGroup = projGroup;
	this.name = name;
	this.description = description;
	this.author = author;
	this.state = state;
	this.sum1 = sum1;
	this.sum2 = sum2;
	this.announceTime = announceTime;
	this.startTime = startTime;
	this.beginTime = beginTime;
	this.endTime = endTime;
	return this;
}


module.exports = Project;
