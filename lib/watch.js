"use strict";
/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>
var configUtil = require('./configUtil.js');
var path = require('path');
var child_process = require('child_process');
var bs = require('browser-sync');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.run = function (dir, options) {
        if (dir === void 0) { dir = '.'; }
        var configFile = '_config';
        if (options.config && options.config != true) {
            configFile = options.config;
        }
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
    Watch.prototype.getCompileCmdAndFileName = function (file, ext) {
        var config = this.config;
        var result = [];
        var fileName = path.basename(file, ext);
        var filePath = path.dirname(file);
        var relativePath = path.resolve(config.baseDir, filePath);
        result.push(fileName);
        if (path.sep != '/') {
            relativePath = relativePath.replace('\\', '/');
            file = file.replace('\\', '/');
        }
        var cmdDefine = this.config.define;
        var pathNode = false;
        var cmdArray = [];
        if (cmdDefine[relativePath]) {
            pathNode = cmdDefine[relativePath];
        }
        var cmdNode = pathNode["." + ext];
        if (cmdNode) {
            cmdArray = [].concat(cmdNode.command);
            result.push(cmdArray);
        }
        else {
            result = [];
        }
        return result;
    };
    Watch.prototype.compileTask = function (file, ext, reload) {
        var cmdAndFileName = this.getCompileCmdAndFileName(file, ext);
    };
    Watch.prototype.compileCallback = function (file) {
        var ext = path.extname(file);
        if (this.checkIgnore(file) != true) {
            return;
        }
        this.compileTask(file, ext, bs.reload);
    };
    return Watch;
}());
module.exports = new Watch();
