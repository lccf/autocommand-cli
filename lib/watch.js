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
    Watch.prototype.checkIgnore = function (filename) {
        var allow = false;
        return allow;
    };
    Watch.prototype.checkExtention = function (ext) {
        var allow = true;
        return allow;
    };
    Watch.prototype.compileTask = function (file, ext, reload) {
    };
    Watch.prototype.compileCallbac = function (file) {
        var ext = path.extname(file);
        if (this.checkIgnore(file) != true || this.checkExtention(ext) != true) {
            return;
        }
        this.compileTask(file, ext, bs.reload);
    };
    return Watch;
}());
module.exports = new Watch();
