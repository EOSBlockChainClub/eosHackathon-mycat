var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
var checkAuth = function (req, res, next) {

  req.userInformation = {};
  request({
    url: req.protocol + '://' + req.get('host') + '/api/v1/auth/check',
    headers: req.headers,
    rejectUnauthorized: false//,
    // qs: req.query
  }, function (err, res2, body) {
    try {
      console.log(body);
      body = JSON.parse(body);
      req.userInformation = body;
    } catch (error) {

    } finally {
      next();
    }
  });
}

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/tool', function (req, res, next) {
  res.redirect("/document/148");
});

router.get('/document/:did', checkAuth, function (req, res, next) {
  res.render('tool', {
    userInformation: req.userInformation,
    doc_id: req.params.did
  });
});

router.get('/project', checkAuth, function (req, res, next) {
  res.render('project');
});

router.get('/actions', checkAuth, function (req, res, next) {
  res.render('actions');
});

module.exports = router;
