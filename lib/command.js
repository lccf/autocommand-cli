var program = require('commander');
var pkg = require('../package.json');

var main = function(args) {
  program
  .version(pkg.version)
  .parse(args);
}

module.exports = main;
