/// <reference path="../../typings/main" />
/// <reference path="../declare/main.d.ts" />
var program = require('commander');
var pkg = require('../package.json');
var watchAction = require('./watch.js');
var configUtil = require('./configUtil');
module.exports = function (args) {
    program.version(pkg.version);
    program.command('watch', '')
        .description('watch file change')
        .option('-c, --config [config]', 'config file')
        .option('-t, --test [testFile]', 'test mode')
        .action(watchAction.run.bind(watchAction));
    program.command('config', '')
        .description('config tool')
        .option('-c, --config [config]', 'config file')
        .option('-i, --init', 'create config file')
        .option('-t, --test', 'test config file')
        .action(configUtil.action.bind(configUtil));
    program.parse(args);
};
