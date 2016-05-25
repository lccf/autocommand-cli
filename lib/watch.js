/// <reference path="../../typings/main.d.ts"/>
"use strict";
var configUtil = require('./configUtil.js');
var fileManage = require('./fileManage.js');
var path = require('path');
var child_process = require('child_process');
var browserSync = require('browser-sync');
var chokidar = require('chokidar');
var glob = require('glob');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.compile = function () {
        this.run({ compile: true });
    };
    /* 主入口函数 */
    Watch.prototype.run = function (options) {
        var configFile = configUtil.defaultConfig;
        if (options.config && options.config != true) {
            configFile = options.config;
        }
        this.basePath = process.cwd();
        configFile = path.resolve(this.basePath, configFile);
        if (!this.config) {
            this.config = configUtil.getConfig(configFile);
        }
        this.configFile = configFile;
        if (!options.test) {
            if (options.compile) {
                this.runCommand();
            }
            else {
                this.startWatch();
            }
        }
        else {
            this.testCommand(options.test);
        }
    };
    /* 测试模式 */
    Watch.prototype.testCommand = function (testFile) {
        if (testFile === true) {
            testFile = 'test.sass';
        }
        this.compileCallback(path.resolve(this.basePath + '/' + testFile));
    };
    /* 编译模式 */
    Watch.prototype.runCommand = function () {
        var config = this.config;
        var files = [];
        if (config.file || config.file.length) {
            for (var _i = 0, _a = config.file; _i < _a.length; _i++) {
                var file = _a[_i];
                file = file.replace(/\\/g, '/');
                files.push(path.resolve(this.basePath, file));
            }
            var fileList = [];
            for (var _b = 0, files_1 = files; _b < files_1.length; _b++) {
                var item = files_1[_b];
                var file = glob.sync(item);
                fileList = fileList.concat(file);
            }
            console.log('find files:\n' + fileList.join('\n'));
            fileList.map(this.compileCallback.bind(this));
        }
    };
    /* 监听模式 */
    Watch.prototype.startWatch = function () {
        var config = this.config;
        var watchFile = [];
        if (config.file || config.file.length) {
            for (var _i = 0, _a = config.file; _i < _a.length; _i++) {
                var file = _a[_i];
                file = file.replace(/\\/g, '/');
                watchFile.push(path.resolve(this.basePath, file));
            }
            watchFile.push(this.configFile);
            if (config.browserSync) {
                if (!this.browserSync) {
                    this.browserSync = browserSync.create();
                }
                if (config.browserSync.init) {
                    this.browserSync.init(config.browserSync.init);
                }
                else {
                    this.browserSync.init();
                }
                this.watcher = this.browserSync.watch(watchFile).on('change', this.compileCallback.bind(this));
            }
            else {
                console.log('watch model，files:\n' + watchFile.join('\n'));
                this.watcher = chokidar.watch(watchFile).on('change', this.compileCallback.bind(this));
            }
        }
    };
    /* 停止监听 */
    Watch.prototype.stopWatch = function () {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        if (this.browserSync) {
            this.browserSync.exit();
            this.browserSync = null;
        }
        fileManage.clear();
    };
    /* 重新载入监听及配置 */
    Watch.prototype.reloadWatch = function () {
        if (configUtil.testConfig(this.configFile)) {
            this.stopWatch();
            this.config = configUtil.getConfig(this.configFile, true);
            console.log("\n");
            console.log("====================reload config====================");
            this.startWatch();
        }
        else {
            console.log('config parse error');
        }
    };
    /* 检测忽略 */
    Watch.prototype.checkIgnore = function (file) {
        var filename = path.basename(file);
        var allow = true;
        var ignore = this.config.ignore;
        for (var _i = 0, ignore_1 = ignore; _i < ignore_1.length; _i++) {
            var item = ignore_1[_i];
            var match = new RegExp(item);
            if (match.exec(filename)) {
                allow = false;
                break;
            }
        }
        return allow;
    };
    /* 编译任务 */
    Watch.prototype.compileTask = function (file, reload) {
        var fileObject = fileManage.getFile(file, this.config, this.basePath);
        var command = fileObject.command;
        var fileName = fileObject.file;
        var originFileName = fileObject.originFileName;
        var workPath = '';
        var basePath = this.basePath;
        var cmdIndex = -1;
        if (fileObject.cmdPath) {
            // 相对于当前配置文件的工作路径计算
            if (fileObject.cmdPath.match(/^~\//)) {
                workPath = path.resolve(basePath, fileObject.cmdPath.substr(2));
            }
            else if (fileObject.cmdPath !== '~') {
                workPath = path.resolve(fileObject.filePath, fileObject.cmdPath);
            }
        }
        var execCallback = function (err, stdo, stde) {
            if (workPath) {
                process.chdir(basePath);
            }
            if (err == null && !stde) {
                console.log("compiled " + (fileName || originFileName));
                if (reload && fileName) {
                    reload(fileName);
                }
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
                console.log("exec command:" + currCmd);
                exec(currCmd, execCallback);
            }
        };
        execCmd();
    };
    /* 编译回调 */
    Watch.prototype.compileCallback = function (file) {
        if (file == this.configFile) {
            if (configUtil.testConfig(file)) {
                this.reloadWatch();
            }
        }
        else {
            if (this.checkIgnore(file) != true) {
                return;
            }
            this.compileTask(file, this.browserSync && this.config.browserSync.reload ? this.browserSync.reload : null);
        }
    };
    return Watch;
}());
module.exports = new Watch();
