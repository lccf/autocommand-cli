"use strict";
/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>
var configUtil = require('./configUtil.js');
var fileManage = require('./fileManage.js');
var path = require('path');
var child_process = require('child_process');
var bs = require('browser-sync');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.run = function (dir, options) {
        if (dir === void 0) { dir = './'; }
        var cliPath = process.cwd();
        var configFile = '_config';
        if (options.config && options.config != true) {
            configFile = options.config;
        }
        configFile = path.normalize(cliPath + '/' + dir + configFile);
        console.log(configFile);
        if (!this.config) {
            this.config = configUtil.getConfig(configFile);
        }
        var config = this.config;
        var watchFile = [];
        if (config.watchFile || config.watchFile.length) {
            config.baseDir = (config.baseDir || '.')
                .replace(/\\/g, '/').replace(/\/$/, '');
            for (var i = 0, j = config.watchFile.length; i < j; i++) {
                var file = config.watchFile[i];
                file = file.replace(/\\/g, '/');
                watchFile.push(config.baseDir + '/' + file);
            }
            bs.watch(watchFile).on('change', this.compileCallback);
        }
    };
    /* 检测忽略 */
    Watch.prototype.checkIgnore = function (file) {
        var filename = path.basename(file);
        var allow = true;
        var ignore = this.config.ignore;
        for (var i = 0, j = ignore.length; i < j; i++) {
            var match = new RegExp(ignore[i]);
            if (match.exec(filename)) {
                allow = false;
                break;
            }
        }
        return allow;
    };
    Watch.prototype.compileTask = function (file, reload) {
        var fileObject = fileManage.getFile(file);
        var command = fileObject.command;
        console.log(command);
    };
    Watch.prototype.compileCallback = function (file) {
        if (this.checkIgnore(file) != true) {
            return;
        }
        this.compileTask(file, bs.reload);
    };
    return Watch;
}());
module.exports = new Watch();
