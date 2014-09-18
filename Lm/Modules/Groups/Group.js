/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

function Group(name, description, leader) {
	this.id = 1;
	this.name = name;
	this.description = description;
	this.leader = leader;
	this.users = [];
	this.projects = [];
	this.weight = 1.0;
	this.users.push(leader);
	return this;
}

module.exports = Group;
