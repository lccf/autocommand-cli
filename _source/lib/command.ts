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
    .action(watchAction.run.bind(watchAction));

    program.command('config [action]', '')
    .description('config tool')
    .option('-f, --file [config]', 'config file')
    .action(configUtil.action.bind(configUtil));

    program.parse(args);
}
