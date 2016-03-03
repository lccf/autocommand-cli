var program = require('commander');
var pkg = require('../package.json');
var watchAction = require('./watch.js')

var main = function(args) {
  program
  .version(pkg.version);

  program
  .command('watch', {isDefault: true})
  .action(watchAction.run);

  program
  .parse(args);

  return false;
}

module.exports = main;
