$(document).ready(function () {

	var divTooltip = $("<div></div>");
	divTooltip.addClass("m-tooltip");
	$("body").prepend(divTooltip);

	$("body").on("mouseenter", "[data-tooltip]", function () {
		var strTooltip = $(this).attr("data-tooltip").toString();
		$(divTooltip).text(strTooltip);
		$(divTooltip).css({
			left: $(this).offset().left - $(divTooltip).outerWidth() / 4,
			top: $(this).offset().top - $(divTooltip).outerHeight() - 4
		})
		$(divTooltip).addClass("show");
	});
	$("body").on("mouseout", "[data-tooltip]", function () {
		$(divTooltip).removeClass("show");
		$(divTooltip).text("");
	});
});