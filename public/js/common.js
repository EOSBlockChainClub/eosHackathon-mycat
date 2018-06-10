var myCat;
myCat = !myCat ? {} : myCat;

myCat.checkAuth = !myCat.checkAuth ? {} : myCat.checkAuth;
myCat.beforeLoad = !myCat.beforeLoad ? {} : myCat.beforeLoad;



myCat.loadUserInformation = function (callback) {
	var userInformation = {};
	$.ajax({
		url: '/api/v1/auth/check',
		processData: false,
		contentType: false,
		dataType: "json",
		cache: false,
		type: 'GET'
	}).done(function (data) {
		userInformation = data;
	}).fail(function () {
		userInformation = undefined;
	}).always(function () {
		userInformation = userInformation.user_id ? userInformation : undefined;
		callback && callback(userInformation);
	});

}

myCat.beforeLoad = function (callback) {
	myCat.loadUserInformation(function (userInformation) {
		callback && callback(userInformation);
	});
};