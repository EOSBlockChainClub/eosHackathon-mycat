$(document).ready(function () {
	// 1. Translate
	// 	a. Translate ${user} translated the sentence '${sentence_id}' and claim reward: ${token} LC, and ${point} LCP. 
	// 2. Gain
	// 	a. Gain ${objective} transfer ${issued_token} LC to ${user} for sentence ${sentence_id}.
	// 3. Search
	// 	a. Search ${user} transfer ${issued_token} LC to ${objective} for sentence ${sentence_id}. 


	var actionListRenderer = new Maro.listRenderer(".actions-log-list", $(".actions-log-list").html(), []);


	var user_profile_image = {

	};

	var randomUserIndex = 1;



	myCat.beforeLoad(function (userInformation) {
		$.ajax({
			url: '/api/block/explorer/' + userInformation.eos_id + '?page=1',
			processData: false,
			contentType: false,
			dataType: "json",
			cache: false,
			type: 'GET'
		}).done(function (data) {
			for (i = 0; i < data.data.length; i++) {
				var log = data.data[i];
				if (!user_profile_image[log.user]) {
					user_profile_image[log.user] = "https://randomuser.me/api/portraits/women/" + (randomUserIndex++) + ".jpg"
				}
				if (!user_profile_image[log.objective]) {

					user_profile_image[log.objective] = "https://randomuser.me/api/portraits/women/" + (randomUserIndex++) + ".jpg"
				}
				switch (log.action_type) {
					case "search":
						log.text = "<span class='actions-log-list-item-user'>" + log.user + "</span><img src='" + user_profile_image[log.user] + "'> transfer " + log.issued_token + " to <span class='actions-log-list-item-user'>" + log.objective + "</span><img src='" + user_profile_image[log.objective] + "'> for sentence " + log.sentence_id + ".";
						log.action_type_color = "red";
						break;
					case "gain":
						log.text = "<span class='actions-log-list-item-user'>" + log.objective + "</span><img src='" + user_profile_image[log.objective] + "'> transfer " + log.issued_token + " to <span class='actions-log-list-item-user'>" + log.user + "</span><img src='" + user_profile_image[log.user] + "'> for sentence " + log.sentence_id + "."
						log.action_type_color = "blue";

						break;
					case "translate":
						log.text = "<span class='actions-log-list-item-user'>" + log.user + "</span><img src='" + user_profile_image[log.user] + "'> translated the sentence '" + log.sentence_id + "' and claim reward: " + log.issued_token + ", and " + log.issued_point + " LCP. "
						log.action_type_color = "green";

						break;
					default:
						log.text = "";
						break;
				}
			}

			actionListRenderer.setRenderData(data.data);

			for (i = 0; i < $(".actions-log-list-item-description").length; i++) {

				var el = $(".actions-log-list-item-description")[i];

				$(el).html($(el).text());
			}



		}).fail(function () {
		}).always(function () {
		});
	});




});