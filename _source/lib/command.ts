/// <reference path="../../typings/main" />
let program:commander.IExportedCommand = require('commander');
let pkg:any = require('../package.json');
let watchAction:any = require('./watch.js');

module.exports = function (args:string):void {
    program.version()
}