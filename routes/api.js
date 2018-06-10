var express = require('express');
var router = express.Router();
var URL = require("url");
var request = require("request");
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
/* GET home page. */
router.get('/dictionary', function (req, res, next) {
	var query = req.query.query || "";
	var locale = req.query.language || "en";
	var url = URL.format({
		protocol: 'https',
		hostname: `${locale}.wiktionary.org`,
		pathname: '/w/api.php',
		query: {
			action: 'opensearch',
			format: 'json',
			formatversion: '2',
			search: query.toLowerCase(),
			namespace: 0,
			limit: 1,
			suggest: true
		}
	});

	request.get(url, function (err, res2, body) {
		body = JSON.parse(body);
		var query = (body && body[1] && body[1][0]) ? body[1][0] : "";
		var url = URL.format({
			protocol: 'https',
			hostname: `${locale}.wiktionary.org`,
			pathname: '/w/api.php',
			query: {
				action: 'query',
				format: 'json',
				prop: 'extracts',
				titles: query
			}
		});
		request.get(url, function (err, res2, body) {
			body = JSON.parse(body);
			var key = (body && body.query && body.query.pages) ? Object.keys(body.query.pages)[0] : undefined;
			if (!key) {
				res.json({});
				return;
			}
			var dictionary = body.query.pages[key];

			var result = {
				word: dictionary.title,
				url: `https://${locale}.wiktionary.org/wiki/${query}`,
				html: dictionary.extract,
				source: `Wiktionary`
			}
			res.json(result);
		});
	});
});

router.post("/mt", upload.none(), function (req, res, next) {
	var sentence = req.body.sentence;
	var origin_lang = req.body.origin_lang;
	var trans_lang = req.body.trans_lang;

	var lanugages = {
		"en": 2,
		"ko": 1
	}

	var getLanguageIdFromCode = code => { return lanugages[code] };
	var reqMt = request.post({
		url: "https://translator.ciceron.me/translate",
		strictSSL: false,
		form: {
			source_lang_id: getLanguageIdFromCode(origin_lang),
			target_lang_id: getLanguageIdFromCode(trans_lang),
			where: "phone",
			sentence: sentence,
			user_email: "admin@sexycookie.com"
		}
	}, function (err, res2, body) {
		if (err || !body) {
			console.log(err);
			res.send({ result: "no results" });
			return;
		}
		body = JSON.parse(body ? body : "");
		if (err || !body || !body.ciceron) {
			console.log(err);
			res.send({ result: "no results" });
			return;
		}
		console.log(body);
		res.send({
			result: (body.ciceron).trim(),
			source: "ciceron"
		});
	});

	req.connection.on('close', function () {
		// code to handle connection abort
		console.log('user cancelled');
		reqMt.abort();
	});
})

module.exports = router;
