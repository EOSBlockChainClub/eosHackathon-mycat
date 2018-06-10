$(document).ready(function () {


	var sentenceRenderer = new Maro.listRenderer(".sentences-list", $(".sentences-list").html(), []);
	var mtRenderer = new Maro.listRenderer(".editor-assistant-mt-list", $(".editor-assistant-mt-list").html(), []);
	var tmRenderer = new Maro.listRenderer(".editor-assistant-tm-list", $(".editor-assistant-tm-list").html(), []);
	var tbRenderer = new Maro.listRenderer(".editor-assistant-tb-list", $(".editor-assistant-tb-list").html(), []);
	var documentCommentRenderer = new Maro.listRenderer("#comunication-chat-document", $("#comunication-chat-document").html(), []);
	var sentenceCommentRenderer = new Maro.listRenderer("#comunication-sentence .comunication-chat-list", $("#comunication-sentence .comunication-chat-list").html(), []);

	myCat.beforeLoad(function (userInformation) {


		$("body").on("change", "#settingSentencesOneLine", function (e) {
			if (this.checked) {
				$("#settingSentencesOneLine").prop("checked", true);
				$(".sentences-list").addClass("oneline");
			}
			else {
				$("#settingSentencesOneLine").prop("checked", false);
				$(".sentences-list").removeClass("oneline");
			}
			localStorage.setItem("sentencesOneLine", this.checked);
		});

		var getSetting = function () {
			if (localStorage.getItem("sentencesOneLine") == true || localStorage.getItem("sentencesOneLine") == "true") {
				$("#settingSentencesOneLine").prop("checked", true);
				$(".sentences-list").addClass("oneline");
			}
			else {
				$("#settingSentencesOneLine").prop("checked", false);
				$(".sentences-list").removeClass("oneline");
			}
		}
		getSetting();
		if (!userInformation) {
			location.href = "/"
			return;
		}
		$("#user-profile").text(userInformation.user_nickname);

		var ajaxTmTb;
		var ajaxMt;
		var ajaxSentenceComment;
		var selectedSentence;
		$("body").on("click", ".sentences-list-item", function (e) {
			selectedSentence = this;
			$(".sentences-list-item").removeClass("selected");
			$(this).addClass("selected");

			$(".editor-original-text").text($(this).attr("origin-text"));
			$(".editor-translate-text").val($(this).attr("trans-text"));
			$(".editor-translate-text").focus();
			$(".editor-translate-text").select();


			mtRenderer.setRenderData([]);
			tmRenderer.setRenderData([]);
			tbRenderer.setRenderData([{
				trans_text: "　　　　　　　　　　",
				origin_text: "　　　　　　"
			},
			{
				trans_text: "　　　　　　　　　　",
				origin_text: "　　　　　　"
			},
			{
				trans_text: "　　　　　　　　　　",
				origin_text: "　　　　　　"
			}]);
			$(".editor-assistant-tb-list-item-score, .editor-assistant-tb-list-item-translated, .editor-assistant-tb-list-item-original").addClass("animated-background");


			ajaxTmTb && ajaxTmTb.abort();
			ajaxTmTb = $.ajax({
				url: '/api/search1?' + $.param({
					q: $(this).attr("origin-text"),
					sentence: $(this).attr("origin-text"),
					target: "tm,tb",
					ol: $(this).attr("origin-lang"), //origin-lang
					tl: $(this).attr("trans-lang"), //trans-lang
					tid: 66
				}),
				headers: {
					"Upgrade-Insecure-Requests": 1
				},
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				// /api/v1 / search /
				console.log(data);
				// socket.emit("forEos");
				tmRenderer.setRenderData(data.tm);
				tbRenderer.setRenderData(data.tb);
			}).fail(function () {

			}).always(function () {

			});


			var formData = new FormData();
			formData.append("sentence", $(this).attr("origin-text"));
			formData.append("origin_lang", $(this).attr("origin-lang"));
			formData.append("trans_lang", $(this).attr("trans-lang"));
			ajaxMt && ajaxMt.abort();
			ajaxMt = $.ajax({
				url: '/api/v1/mt',
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'POST',
				data: formData
			}).done(function (data) {
				console.log(data);
				mtRenderer.setRenderData([data]);
			}).fail(function () {

			}).always(function () {

			});



			getCommentsOfSelectedSentence();


			$(".editor-translate-navigator i").removeClass("disabled");

			if ($(".sentences-list-item").index($(this)) <= 0) {
				$("#btnPrevious").addClass("disabled");
			}

			if ($(".sentences-list-item").index($(this)) >= $(".sentences-list-item").length - 1) {
				$("#btnNext").addClass("disabled");
			}

		});


		var ajaxDictionary;
		$("body").on("mouseup click contextmenu", ".editor-original-text", function (e) {
			if (getSelected().trim() == "") {
				return;
			}
			ajaxDictionary && ajaxDictionary.abort();
			ajaxDictionary = $.ajax({
				url: '/api/v1/dictionary?' + $.param({
					query: getSelected(),
					language: $(selectedSentence).attr("trans-lang")
				}),
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				console.log(data);
			}).fail(function () {
			}).always(function () {
				// $(form).find("button").removeAttr("disabled");
				// $(".loader").remove();
			});
			// /dictionary
		});

		$("body").on("click", "#btnPrevious", function (e) {
			$(selectedSentence).prev().click();
			clickEffect(this);
		});
		$("body").on("click", "#btnNext", function (e) {
			$(selectedSentence).next().click();
			clickEffect(this);
		});
		$("body").on("click", "#btnSave", function (e) {
			changeSentenceStatus($(selectedSentence).attr("sentence-id"), 1);
			clickEffect(this);

			$(selectedSentence).next().click();
		});
		$("body").on("click", ".editor-assistant-tb-list-item", function (e) {
			$(".editor-translate-text").val($(".editor-translate-text").val() + $(this).attr("trans-text"));
			$(".editor-translate-text").keyup();
		});
		$("body").on("click", ".editor-assistant-tm-list-item, .editor-assistant-mt-list-item", function (e) {
			$(".editor-translate-text").val($(this).attr("trans-text"));
			$(".editor-translate-text").keyup();
		});

		$(document).on("keydown", function (e) {
			if ((e.key == "ArrowLeft" || e.key == "ArrowUp") && e.ctrlKey) {
				$("#btnPrevious").click();
			}
			if ((e.key == "ArrowRight" || e.key == "ArrowDown") && e.ctrlKey) {
				$("#btnNext").click();
			}
			if (e.keyCode == 13 && e.ctrlKey) {
				$("#btnSave").click();
			}
		});


		var clickEffect = function (element) {
			var effect = $("<div class='clickEffect'></div>");
			console.log($(element).offset().left);
			console.log($(element).width());
			var left = $(element).offset().left + $(element).outerWidth() / 2;
			var top = $(element).offset().top + $(element).outerHeight() / 2;
			effect.css("left", left);
			effect.css("top", top);
			$(element).parent().prepend(effect);
			setTimeout(function () {
				effect.remove();
			}, 500);
		}

		var timerForSavingSentences = {};


		$("body").on("keydown", ".editor-translate-text", function (e) {
			var sid = $(selectedSentence).attr("sentence-id");
			changeSentenceStatus(sid, 0);
		});
		$("body").on("keyup", ".editor-translate-text", function (e) {
			var sid = $(selectedSentence).attr("sentence-id");
			saveSentence(sid, $(this).val().trim(), 500);
		});
		$("body").on("change", ".editor-translate-text", function (e) {
			var sid = $(selectedSentence).attr("sentence-id");
			saveSentence(sid, $(this).val().trim(), 0);
		});

		var saveSentence = function (sid, text, timeout) {
			$(selectedSentence).attr("trans-text", text);
			timerForSavingSentences[sid] && clearTimeout(timerForSavingSentences[sid]);
			timerForSavingSentences[sid] = setTimeout(function () {

				var formData = new FormData();
				formData.append("trans_text", $(".sentences-list-item[sentence-id=" + sid + "]").attr("trans-text"));
				formData.append("trans_type", "T");

				$.ajax({
					url: '/api/v1/toolkit/workbench/docs/sentences/' + sid + '/trans',
					processData: false,
					contentType: false,
					dataType: "json",
					cache: false,
					type: 'PUT',
					data: formData

				}).done(function (data) {
					console.log(data);
					// socket.emit("forEos");
				}).fail(function () {

				}).always(function () {

				});
				// /api/v1/toolkit/workbench/docs/sentences/:sid/trans PUT
			}, timeout);

		}

		var changeSentenceStatus = function (sid, status) {
			status = !status ? 0 : 1;
			var sentence = $(".sentences-list-item[sentence-id=" + sid + "]")[0];
			if ($(sentence).attr("trans-status") == status) {
				return;
			}
			$(sentence).attr("trans-status", status);
			$.ajax({
				url: '/api/v1/toolkit/workbench/docs/sentences/' + sid + '/status/' + status,
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'PUT'

			}).done(function (data) {
				console.log(data);
			}).fail(function () {

			}).always(function () {

			});
		}

		var getCommentsOfSelectedSentence = function () {



			if ($(selectedSentence).attr("sentence-id") != $("#comunication-sentence .comunication-insert").attr("sentence-id")) {
				sentenceCommentRenderer.setRenderData([{
					name: "　　　",
					comment: "　　　　　　　　　　　　",
					sentence_id: 0
				},
				{
					name: "　　　",
					comment: "　　　　　　　　　　　　",
					sentence_id: 0
				},
				{
					name: "　　　",
					comment: "　　　　　　　　　　　　",
					sentence_id: 0
				}]);
				$("#comunication-sentence .comunication-chat-list .comunication-chat-list-item-text *").addClass("animated-background");
			}


			// /api/v1/toolkit/workbench/docs/:did/sentences/:sid/comments
			// $("#others-sentence-comunication").text($(selectedSentence).attr("origin-text"));
			$("#comunication-sentence .comunication-insert").attr("sentence-id", "");

			ajaxSentenceComment && ajaxSentenceComment.abort();
			ajaxSentenceComment = $.ajax({
				url: '/api/v1/toolkit/workbench/docs/' + document_id + '/sentences/' + $(selectedSentence).attr("sentence-id") + '/comments?page=1&rows=30000',
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				// if(!data.results || data.results.length <= 0){
				// 	$(sentenceCommentRenderer.getRenderTarget()).text("There is no comment here.");
				// }
				// else{
				sentenceCommentRenderer.setRenderData(data.results);
				$(sentenceCommentRenderer.getRenderTarget()).scrollTop($(sentenceCommentRenderer.getRenderTarget())[0].scrollHeight);
				// }
				$("#comunication-sentence .comunication-insert").attr("sentence-id", $(selectedSentence).attr("sentence-id"));
			}).fail(function () {

			}).always(function () {

			});

		}

		var getDocumentInformation = function () {

			$(".document-information-content").addClass("animated-background");
			$.ajax({
				url: '/api/v1/projects/docs/' + document_id,
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				data.link = data.link != "" ? data.link : "(None)";
				data.due_date = !data.due_date ? "(지정되지 않음)" : data.due_date;

				$("#docs-title").text(data.title);
				$("#docs-status").text(data.status);
				$("#docs-link").text(data.link);
				$("#docs-original-language").text(data.origin_lang);
				$("#docs-target-language").text(data.trans_lang);
				$("#docs-due-date").text(data.due_date);
			}).fail(function () {

			}).always(function () {
				$(".document-information-content").removeClass("animated-background");
			});
		}



		var resizer = {};
		var initResizer = function () {
			resizer = {
				selected: null,
				parent: {
					element: null,
					originalWidth: null,
				},
				nextOfParent: {
					element: null,
					originalWidth: null
				},
				startX: null
			};
		}

		$("body").on("mousedown", ".resizer", function (e) {
			resizer.selected = $(this);
			resizer.startX = e.clientX;
			resizer.parent.element = $(this).parent();
			resizer.parent.originalWidth = $(resizer.parent.element).width();
			resizer.nextOfParent.element = $(this).parent().next();
			resizer.nextOfParent.originalWidth = $(resizer.nextOfParent.element).width();
		});

		$("body").on("mousemove", function (e) {
			if (resizer.selected) {
				$(resizer.parent.element).css("width", ((resizer.parent.originalWidth + (e.clientX - resizer.startX)) / $("body").width() * 100) + "%");

				// $(resizer.nextOfParent.element).css("width", ((resizer.nextOfParent.originalWidth - (e.clientX - resizer.startX)) / $("body").width() * 100) + "%");
				$(resizer.nextOfParent.element).css("width", ((resizer.parent.originalWidth + resizer.nextOfParent.originalWidth - $(resizer.parent.element).width()) / $("body").width() * 100) + "%");

				$(resizer.parent.element).css("width", ((resizer.parent.originalWidth + resizer.nextOfParent.originalWidth - $(resizer.nextOfParent.element).width()) / $("body").width() * 100) + "%");


			}
		});
		$("body").on("mouseup", function (e) {
			initResizer();
		});

		initResizer();


		$("body").on("click", ".others-list-item", function (e) {

			var index = $(".others-list-item").index(this);
			console.log(index);

			$(".others-list-item").removeClass("selected");
			$(this).addClass("selected");

			$(".others-tabs-item").removeClass("selected");
			$(".others-tabs-item:eq(" + index + ")").addClass("selected");

		});

		$(".others-list-item:eq(0)").click();

		$("body").on("click", ".comunication-chat-list-item-menu-delete", function (e) {
			var divComment = $(this).parents(".comunication-chat-list-item");

			$.ajax({
				url: '/api/v1/toolkit/workbench/docs/sentences/comments/' + $(divComment).attr("comment-id"),
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'DELETE'
			}).done(function (data) {
				socket.emit("chat", $(divComment).attr("sentence-id"));
			}).fail(function () {
				alert("실패");
			}).always(function () {

				getCommentsOfSelectedSentence();
			});
		});

		$("body").on("keydown", ".comunication-insert-textarea", function (e) {

			if (e.keyCode == 13 && !e.shiftKey) {
				e.preventDefault();
				var frmInsertComment = $(this).parents(".comunication-insert");

				$(frmInsertComment).submit();
			}
		});

		$("body").on("submit", ".comunication-insert", function (e) {
			e.preventDefault();


			var chatTarget = $(this).attr("target");
			var url = "";
			if (chatTarget == "sentence") {
				var sentence_id = $(this).attr("sentence-id");
				// /api/v1/toolkit/workbench/docs/:did/sentences/:sid/comments
				url = "/api/v1/toolkit/workbench/docs/" + document_id + "/sentences/" + sentence_id + "/comments";
			}
			else if (chatTarget == "document") {
				// /api/v1/toolkit/workbench/docs/:did/comments
				url = "/api/v1/toolkit/workbench/docs/" + document_id + "/comments";
			}

			if (url == "") {
				return;
			}

			var formData = new FormData($(this)[0]);
			$.ajax({
				url: url,
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'POST',
				data: formData
			}).done(function (data) {
				socket.emit('chat', sentence_id);
			}).fail(function () {
			}).always(function () {
				getCommentsOfSelectedSentence();
			});

			$(this)[0].reset();
		})






		function getSelected() {
			if (window.getSelection) {
				return $("<div>" + window.getSelection().toString() + "</div>").text();
			}
			else if (document.getSelection) {
				return document.getSelection().toString();
			}
			else {
				var selection = document.selection && document.selection.createRange();
				if (selection.text) { return selection.text; }
				return false;
			}
			return false;
		}

		// var socket = io.connect(location.protocol + "//" + location.host + (location.port ? ":" + location.port : (location.protocol.startsWith("https") ? ":443" : ":80")));
		var socket = io.connect(location.protocol + "//" + location.host);
		socket.on('welcome', function () {
			socket.emit('connectRoom', document_id);
			$(".disconnected").remove();




			// /api/v1/toolkit/workbench/docs/:did/comments



			$.ajax({
				url: '/api/v1/toolkit/workbench/docs/' + document_id,
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				console.log(data);
				sentenceRenderer.setRenderData(data.results);
				$(".sentences-list-item:eq(0)").click();
			}).fail(function () {
			}).always(function () {
				// $(form).find("button").removeAttr("disabled");
				// $(".loader").remove();
			});


			getDocumentInformation();

			$.ajax({
				url: '/api/v1/toolkit/workbench/docs/' + document_id + '/comments?page=1&rows=30000',
				processData: false,
				contentType: false,
				dataType: "json",
				cache: false,
				type: 'GET'
			}).done(function (data) {
				documentCommentRenderer.setRenderData(data.results);
			}).fail(function () {

			}).always(function () {

			});



		});
		socket.on('updateChat', function (sid) {
			if (parseInt($(selectedSentence).attr("sentence-id")) == parseInt(sid)) {
				getCommentsOfSelectedSentence();
			}
		});
		socket.on('disconnect', function (reason) {
			console.log(reason);
			$("body").prepend('<div class="disconnected"></div>');
			$(".disconnected").text(reason);
		})
	})
});