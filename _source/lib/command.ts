/// <reference path="../../typings/main" />
/// <reference path="../declare/main.d.ts" />
let program:commander.IExportedCommand = require('commander');
let pkg:any = require('../package.json');
let watchAction:any = require('./watch.js');
let configUtil:any = require('./configUtil');

module.exports = function (args:string[]):void {
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

    program.command('run', '')
    .description('run command by config')
    .action(watchAction.compile.bind(watchAction));

    program.parse(args);
}
