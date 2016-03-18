/// <reference path="../../typings/main" />
let program:commander.IExportedCommand = require('commander');
let pkg:any = require('../package.json');
let watchAction:any = require('./watch.js');

module.exports = function (args:string[]):void {
    program.version(pkg.version);

    program.command('watch [dir]', '')
    .description('watch file change')
    .option('-c, --config [config]', 'config file')
    .action(watchAction.run.bind(watchAction));

    program.parse(args);
}
