$(document).ready(function () {
	$("body").on("submit", "#frmSignin", function (e) {
		e.preventDefault();
		var form = $(this)[0];
		var formData = new FormData(form);
		$(form).find("button").attr("disabled", "disabled");

		$.ajax({
			url: '/api/v1/auth/local/signin',
			processData: false,
			contentType: false,
			dataType: "json",
			data: formData,
			cache: false,
			type: 'POST'
		}).done(function (data) {
			console.log(data);
			location.href = "/project"
			// location.href = '/static/front/project/projects.html';
		}).fail(function () {
			alert("로그인에 실패하였습니다.");
		}).always(function () {
			$(form).find("button").removeAttr("disabled");
			// $(".loader").remove();
		});
	});

	$.ajax({
		url: '/api/v1/auth/check',
		processData: false,
		contentType: false,
		dataType: "json",
		cache: false,
		type: 'GET'
	}).done(function (data) {
		console.log(data);
		if (data.user_id) {
			// location.href = '/static/front/project/projects.html';
		}
	}).fail(function () {
		// alert("로그인에 실패하였습니다.");
	}).always(function () {
		// $(form).find("button").removeAttr("disabled");
		// $(".loader").remove();
	});

	$("body").on("click", "#btnSignin", function (e) {
		e.preventDefault();
		$(".main-right").toggleClass("activated");
		$("#frmSignin input[type=email]").focus();
	});
	$("body").on("click", function (e) {
		if (!$(e.target).hasClass("main-right") && $(".main-right").find(e.target).length < 1 && $(e.target).attr("id") != "btnSignin") {
			$(".main-right").removeClass("activated");
		}
	});
});