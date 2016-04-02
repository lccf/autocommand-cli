/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>
"use strict";
var configUtil = require('./configUtil.js');
var fileManage = require('./fileManage.js');
var path = require('path');
var child_process = require('child_process');
var browserSync = require('browser-sync');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.run = function (options) {
        var configFile = '_config';
        if (options.config && options.config != true) {
            configFile = options.config;
        }
        this.workPath = process.cwd();
        configFile = path.normalize(this.workPath + '/' + configFile);
        if (!this.config) {
            this.config = configUtil.getConfig(configFile);
        }
        if (!this.browserSync) {
            this.browserSync = browserSync.create();
        }
        var config = this.config;
        var watchFile = [];
        if (config.watchFile || config.watchFile.length) {
            for (var i = 0, j = config.watchFile.length; i < j; i++) {
                var file = config.watchFile[i];
                file = file.replace(/\\/g, '/');
                watchFile.push(path.normalize(this.workPath + '/' + file));
            }
            /* if (config.browserSync) {
              this.browserSync.init(browserSync);
            }
            else {
              this.browserSync.init();
            }
            console.log(watchFile);
            this.browserSync.watch(watchFile).on('change', this.compileCallback.bind(this)); */
            this.compileCallback('/Users/leaf/Documents/project/autocommand-cli/testDir/test.sass');
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
        var fileObject = fileManage.getFile(file, this.config);
        var command = fileObject.command;
        var fileName = fileObject.file;
        var cmdIndex = -1;
        var execCallback = function (err, stdo, stde) {
            if (err == null && !stde) {
                console.log("compiled " + fileName);
            }
            else {
                console.error(err || stde);
            }
        };
        var execCmd = function () {
            var currCmd = command[++cmdIndex];
            if (command.length <= cmdIndex + 1) {
                cmdIndex = -1;
            }
            if (currCmd) {
                exec(currCmd, execCallback);
            }
        };
        execCmd();
    };
    Watch.prototype.compileCallback = function (file) {
        if (this.checkIgnore(file) != true) {
            return;
        }
        this.compileTask(file, this.browserSync.reload);
    };
    return Watch;
}());
module.exports = new Watch();
