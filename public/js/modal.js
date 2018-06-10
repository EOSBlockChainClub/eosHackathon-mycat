$(document).ready(function () {
	$("[m-modal-show]").click(function (e) {
		e.preventDefault();
		var clickedElement = $(this);
		var targetModal = $($(clickedElement).attr("m-modal-show"))[0];
		var targetModalInside = $($(clickedElement).attr("m-modal-show") + " .m-modal-inside")[0];
		$(targetModalInside).css("left", $(clickedElement).offset().left);
		$(targetModalInside).css("top", $(clickedElement).offset().top + $(clickedElement).outerHeight());
		$(targetModal).addClass("m-show");
		setTimeout(function () {
			$("body").off("click", $(clickedElement).attr("m-modal-show"));
			$("body").on("click", $(clickedElement).attr("m-modal-show"), function (e) {
				if(!targetModalInside.contains(e.target)){
					$(targetModalInside).addClass("m-hiding");
					setTimeout(function () {
						$(targetModalInside).removeClass("m-hiding");
						$(targetModal).removeClass("m-show");
					}, 400);
				}
			});
		}, 10);
	});
});