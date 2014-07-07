
//var url = require('url');

function Main(req, res) {
	var S = '';
	for (var i = 0; i < Lm.Projects.length; i++) {
		var Proj = Lm.Projects[i];
		if (req.query.Community == Proj.Community && req.query.ProjectGroup == Proj.ProjGroup && req.query.ProjectState == Proj.State) {
			var State = '';
			switch (Proj.State) {
				case 0: State = '<font color="black">Сбор средств</font>'; break;
				case 1: State = '<font color="gray">Выполняется</font>'; break;
				case 2: State = '<font color="green">Сделано</font>'; break;
			}
			S = S + '<div class="divProjectBlock">'+
				'<h3>'+Proj.Name+'</h3>'+Proj.Description+'<br/>'+State+'<br/><b>'+Proj.Sum1+' / '+Proj.Sum2+'</b>'+
			'</div>';
		}
	}
	res.send(S);
}

module.exports = Main;
