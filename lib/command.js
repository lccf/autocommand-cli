/// <reference path="../../typings/main" />
var program = require('commander');
var pkg = require('../package.json');
var watchAction = require('./watch.js');
module.exports = function (args) {
    program.version(pkg.version);
    program.command('watch', '')
        .description('watch file change')
        .option('-c, --config [config]', 'config file')
        .action(watchAction.run.bind(watchAction));
    program.parse(args);
};
