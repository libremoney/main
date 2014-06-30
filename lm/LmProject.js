
function LmProject(Name, Description, Author, State, Sum1, Sum2, AnnounceTime, StartTime, BeginTime, EndTime) {
	this.Name = Name;
	this.Description = Description;
	this.Author = Author;
	this.State = State;
	this.Sum1 = Sum1;
	this.Sum2 = Sum2;
	this.AnnounceTime = AnnounceTime;
	this.StartTime = StartTime;
	this.BeginTime = BeginTime;
	this.EndTime = EndTime;
	return this;
}


module.exports = LmProject;
