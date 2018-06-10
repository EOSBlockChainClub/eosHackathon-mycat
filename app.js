var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

var config = require("./config/config");
var fs = require("fs");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/api/v1', api);
app.use('/api/', api);
app.use('/', index);

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  ssl: {
    key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
    cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
  },
  changeOrigin: true
});

app.use('/api/block', function (req, res, next) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
  req.headers['x-forwarded-for-client-ip'] = ip;
  req.headers['host'] = "etos.ciceron.xyz";
  proxy.web(req, res, {
    target: {
      protocol: 'http:',
      host: "etos.ciceron.xyz",
      path: '/api/block',
      port: 5000,
    }
  });
  proxy.on('error', function (err) {
    console.log(err);
    next(err);
  });
});

app.use('/api/search1', function (req, res, next) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
  req.headers['x-forwarded-for-client-ip'] = ip;
  req.headers['host'] = config.proxy.mycat.host;
  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: config.proxy.mycat.host,
      path: '/api/v1/search',
      port: config.proxy.mycat.port,
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
      // passphrase: 'password',
    },
    // `${config.proxy.mycat.url}:${config.proxy.mycat.port}/api`,
    ssl: {
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
    },
    changeOrigin: true,
    secure: false
  });
  proxy.on('error', function (err) {
    console.log(err);
    next(err);
  });
});
app.use('/api/v1/projects', function (req, res, next) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
  req.headers['x-forwarded-for-client-ip'] = ip;
  req.headers['host'] = config.proxy.mycat.host;
  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: config.proxy.mycat.host,
      path: '/api/v1/projects',
      port: config.proxy.mycat.port,
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
      // passphrase: 'password',
    },
    // `${config.proxy.mycat.url}:${config.proxy.mycat.port}/api`,
    ssl: {
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
    },
    changeOrigin: true,
    secure: false
  });
  proxy.on('error', function (err) {
    console.log(err);
    next(err);
  });
});
app.use('/api', function (req, res, next) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0]
    || req.connection.remoteAddress;
  req.headers['x-forwarded-for-client-ip'] = ip;
  req.headers['host'] = config.proxy.mycat.host;
  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: config.proxy.mycat.host,
      path: '/api',
      port: config.proxy.mycat.port,
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
      // passphrase: 'password',
    },
    // `${config.proxy.mycat.url}:${config.proxy.mycat.port}/api`,
    ssl: {
      key: fs.readFileSync('pfx.mycattool_com.key', 'utf8'),
      cert: fs.readFileSync('pfx.mycattool_com.crt', 'utf8')
    },
    changeOrigin: true,
    secure: false
  });
  proxy.on('error', function (err) {
    console.log(err);
    next(err);
  });
});






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
