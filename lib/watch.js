"use strict";
var configUtil = require('./configUtil.js');
var fileManage = require('./fileManage.js');
var path = require('path');
var child_process = require('child_process');
var browserSync = require('browser-sync');
var chokidar = require('chokidar');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.run = function (options) {
        var configFile = '_config';
        if (options.config && options.config != true) {
            configFile = options.config;
        }
        this.basePath = process.cwd();
        configFile = path.resolve(this.basePath, configFile);
        if (!this.config) {
            this.config = configUtil.getConfig(configFile);
        }
        var config = this.config;
        if (!options.test) {
            var watchFile = [];
            if (config.watchFile || config.watchFile.length) {
                for (var i = 0, j = config.watchFile.length; i < j; i++) {
                    var file = config.watchFile[i];
                    file = file.replace(/\\/g, '/');
                    watchFile.push(path.resolve(this.basePath, file));
                }
                if (this.config.browserSync) {
                    if (!this.browserSync) {
                        this.browserSync = browserSync.create();
                    }
                    if (config.browserSync) {
                        this.browserSync.init(config.browserSync);
                    }
                    else {
                        this.browserSync.init();
                    }
                    this.browserSync.watch(watchFile).on('change', this.compileCallback.bind(this));
                }
                else {
                    console.log('watch model，files:\n' + watchFile.join('\n'));
                    this.watcher = chokidar.watch(watchFile).on('change', this.compileCallback.bind(this));
                }
            }
        }
        else {
            var testFile = 'test.sass';
            if (options.test !== true) {
                testFile = options.test;
            }
            this.compileCallback(path.resolve(this.basePath + '/' + testFile));
        }
    };
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
        var workPath = '';
        var basePath = this.basePath;
        var cmdIndex = -1;
        if (fileObject.cmdPath && fileObject.cmdPath != '~') {
            workPath = path.resolve(fileObject.filePath, fileObject.cmdPath);
        }
        var execCallback = function (err, stdo, stde) {
            if (workPath) {
                process.chdir(basePath);
            }
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
                if (workPath) {
                    process.chdir(workPath);
                }
                exec(currCmd, execCallback);
            }
        };
        execCmd();
    };
    Watch.prototype.compileCallback = function (file) {
        if (this.checkIgnore(file) != true) {
            return;
        }
        this.compileTask(file, this.browserSync ? this.browserSync.reload : null);
    };
    return Watch;
}());
module.exports = new Watch();
