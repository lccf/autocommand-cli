var program = require('commander');
var pkg = require('../package.json');
var watchAction = require('./watch.js');
var configUtil = require('./configUtil');
module.exports = function (args) {
    program.version(pkg.version);
    program.command('watch', '')
        .description('watch file change')
        .option('-c, --config [config]', 'config file')
        .action(watchAction.run.bind(watchAction));
    program.command('config [action]', '')
        .description('config tool')
        .option('-f, --file [config]', 'config file')
        .action(configUtil.action.bind(configUtil));
    program.parse(args);
};
