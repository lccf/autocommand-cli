/// <reference path="../../typings/index.d.ts" />
"use strict";
var program = require('commander');
var pkg = require('../package.json');
var watch_1 = require('./watch');
var configUtil_1 = require('./configUtil');
function default_1(args) {
    var watch = new watch_1.default();
    program.version(pkg.version);
    program.command('watch', '')
        .description('watch file change run command')
        .option('-c, --config [config]', 'config file')
        .option('-t, --test [testFile]', 'test mode')
        .action(watch.run.bind(watch));
    program.command('config', '')
        .description('create and test config file')
        .option('-i, --init [config]', 'create config file')
        .option('-t, --test [config]', 'test config file')
        .action(configUtil_1.default.action.bind(configUtil_1.default));
    program.command('run', '')
        .description('run command by config')
        .option('-f, --file <file>', 'run command by file')
        .action(watch.compile.bind(watch));
    program.parse(args);
    if (!process.argv.slice(2).length) {
        program.help();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
