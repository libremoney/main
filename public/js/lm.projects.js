var Lm = (function(Lm, $, undefined) {
	Lm.Projects = {};
	Lm.ProjectsRefresh = 0;

	function GetProjectListHtml(Community, ProjectGroup, ProjectState, DivId) {
		// TODO: Use Lm.ProcessAjaxRequest()
		$.ajax({
			url: '/api/getProjectListHtml',
			crossDomain: true,
			type: "GET",
			timeout: 30000,
			data: {
				Community: Community,
				ProjectGroup: ProjectGroup,
				ProjectState: ProjectState
			}
		}).done(function(html) {
			$(DivId).html(html);
		});
	}


	function ProjectsPage() {
		$("#projects_container").show();
		$("#projects_disabled").hide();

		var currentTime = new Date().getTime();

		if (currentTime - Lm.ProjectsRefresh > 10) { // 60 * 60 * 10 = 10 minutes before refreshing..
			Lm.ProjectsRefresh = currentTime;
			$(".projects-class").empty().addClass("data-loading").html("<img src='img/loading_indicator.gif' width='32' height='32' />");
			GetProjectListHtml(1, 3, 1, "#projects30");
			GetProjectListHtml(1, 3, 3, "#projects31");
			GetProjectListHtml(1, 3, 4, "#projects32");
			GetProjectListHtml(1, 4, 1, "#projects40");
			GetProjectListHtml(1, 4, 3, "#projects41");
			GetProjectListHtml(1, 4, 4, "#projects42");
			GetProjectListHtml(1, 1, 1, "#projects10");
			GetProjectListHtml(1, 1, 3, "#projects11");
			GetProjectListHtml(1, 1, 4, "#projects12");
			GetProjectListHtml(1, 2, 1, "#projects20");
			GetProjectListHtml(1, 2, 3, "#projects21");
			GetProjectListHtml(1, 2, 4, "#projects22");
		}
	}

	function ProjectsLoaded($el) {
		$el.removeClass("data-loading").find("img").remove();
	}

	function Init() {
		Lm.UpdateSettings("projects", 1);
		Lm.Pages.Projects();
	}


	Lm.Pages.Projects = ProjectsPage;
	Lm.ProjectsLoaded = ProjectsLoaded;
	Lm.Projects.Init = Init;
	return Lm;
}(Lm || {}, jQuery));


$(document).ready(function() {
	Lm.Projects.Init();
});
