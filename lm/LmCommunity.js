/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0
 */

function LmCommunity(Name, Description, Lead) {
	this.Id = 1;
	this.Name = Name;
	this.Description = Description;
	this.Lead = Lead;
	this.Users = new Array();
	this.Projects = new Array();
	this.Weight = 1.0;
	this.Users.push(Lead);
	return this;
}

module.exports = LmCommunity;
