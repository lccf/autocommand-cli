"use strict";
var configUtil = require('./configUtil.js');
var path = require('path');
var child_process = require('child_process');
var bs = require('browser-sync');
var exec = child_process.exec;
var Watch = (function () {
    function Watch() {
        this.config = configUtil.read();
    }
    Watch.prototype.run = function () {
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
            bs.watch(watchFile).on('change', this.compileCallbac);
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
    Watch.prototype.getCompileCmdAndFileName = function (file, ext) {
        var result = [];
        var config = this.config;
        var fileName = path.basename(file, ext);
        var filePath = path.dirname(file);
        var relativePath = path.resolve(config.baseDir, filePath);
        if (path.sep != '/') {
            relativePath = relativePath.replace('\\', '/');
            file = file.replace('\\', '/');
        }
        return result;
    };
    Watch.prototype.compileTask = function (file, ext, reload) {
        var cmdAndFileName = this.getCompileCmdAndFileName(file, ext);
    };
    Watch.prototype.compileCallbac = function (file) {
        var ext = path.extname(file);
        if (this.checkIgnore(file) != true) {
            return;
        }
        this.compileTask(file, ext, bs.reload);
    };
    return Watch;
}());
module.exports = new Watch();
