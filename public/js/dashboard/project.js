$(document).ready(function () {
	// /api/v1/projects
	var projectListRenderer = new Maro.listRenderer(".project-list", "<tr>" + $(".project-list tr").html() + "</tr>", []);

	$.ajax({
		url: '/api/v1/projects',
		processData: false,
		contentType: false,
		dataType: "json",
		cache: false,
		type: 'GET'
	}).done(function (data) {
		projectListRenderer.setRenderData(data.results);
	}).fail(function () {
	}).always(function () {
	});

	$("body").on("click", ".project-list tr", function () {
		var project_id = $($(this).find("td")[0]).text();

		$.ajax({
			url: '/api/v1/projects/' + project_id + '/docs',
			processData: false,
			contentType: false,
			dataType: "json",
			cache: false,
			type: 'GET'
		}).done(function (data) {
			location.href = "/document/" + data.results[0].id;
		}).fail(function () {
		}).always(function () {
		});

	});

});