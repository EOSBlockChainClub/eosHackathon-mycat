var fs = require('fs');
var path = require('path');

var cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '/env.json')));

module.exports = cfg;