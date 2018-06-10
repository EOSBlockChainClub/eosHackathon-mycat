$(document).ready(function () {

	$("[href='" + location.pathname + "']").addClass("selected");
	myCat.beforeLoad(function (userInformation) {
		if (!userInformation) {
			location.href = '/';
		}
		var ajaxReloadPointAndTokens = undefined;
		var reloadPointAndTokens = function () {
			ajaxReloadPointAndTokens && ajaxReloadPointAndTokens.abort();
			ajaxReloadPointAndTokens = $.ajax({
				url: '/api/block/status/point/' + userInformation.eos_id,
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				var sumPoint = 0;
				for (i = 0; i < data.data.length; i++) {
					sumPoint += parseInt(data.data[i].point);
				}
				$(".current-point").text(sumPoint);
			}).fail(function () {
			}).always(function () {
				$.ajax({
					url: '/api/block/status/token/' + userInformation.eos_id,
					processData: false,
					contentType: false,
					dataType: "json",
					cache: false,
					type: 'GET'
				}).done(function (data) {
					$(".current-token").text(parseFloat(data.data).toFixed(4));
				}).fail(function () {
				}).always(function () {
				});
			});
		}


		$(".header-profile-name").text(userInformation.user_nickname);
		$(".header-profile-picture").css("background-image", "url(" + userInformation.user_picture + ")");


		reloadPointAndTokens();
		var socket = io.connect(location.protocol + "//" + location.host);
		socket.on("forEos", function () {
			reloadPointAndTokens();
		})


	});
});