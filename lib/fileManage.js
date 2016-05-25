"use strict";
/// <reference path="../../typings/main.d.ts" />
/// <reference path="../declare/main.d.ts" />
var path = require('path');
var configUtil = require('./configUtil.js');
var fileManage = (function () {
    /* 构造函数 */
    function fileManage(file, config, basePath) {
        this.config = config;
        this.originfile = file;
        this.basePath = basePath;
        this.parseFileExt();
        this.parseFileName();
        this.parseFilePath();
        this.parseFileCommand();
    }
    fileManage.getFile = function (file, config, basePath) {
        var fileCache = fileManage._instance;
        var fileObject = null;
        if (fileCache[file]) {
            fileObject = fileCache[file];
        }
        else {
            fileObject = new fileManage(file, config, basePath);
            fileManage._instance[file] = fileObject;
        }
        return fileObject;
    };
    fileManage.clear = function () {
        var fileCache = fileManage._instance;
        for (var key in fileCache) {
            fileCache[key] = null;
        }
        fileCache = {};
        fileManage._instance = fileCache;
    };
    Object.defineProperty(fileManage.prototype, "fileName", {
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "fileExt", {
        get: function () {
            return this._fileExt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "filePath", {
        get: function () {
            return this._filePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "cmdPath", {
        get: function () {
            return this._cmdPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "command", {
        get: function () {
            return this._command;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "file", {
        get: function () {
            return this._file;
        },
        enumerable: true,
        configurable: true
    });
    fileManage.prototype.parseFileExt = function () {
        var ext = path.extname(this.originfile);
        this._fileExt = ext;
    };
    fileManage.prototype.parseFileName = function () {
        var fileName = path.basename(this.originfile, this.fileExt);
        this._fileName = fileName;
    };
    fileManage.prototype.parseFilePath = function () {
        var filePath = path.dirname(this.originfile);
        this._filePath = filePath;
    };
    fileManage.prototype.parseFileCommand = function () {
        var config = this.config;
        var result = [];
        var file = this.originfile;
        var fileName = this.fileName;
        var filePath = this.filePath;
        var ext = this.fileExt;
        var relativePath = path.relative(process.cwd(), filePath);
        // result.push(file)
        if (path.sep != '/') {
            relativePath = relativePath.replace('\\', '/');
            file = file.replace('\\', '/');
        }
        var cmdDefine = config.define;
        var pathNode = false;
        var cmdArray = [];
        var variable = config.variable;
        if (cmdDefine[relativePath]) {
            pathNode = cmdDefine[relativePath];
        }
        else if (cmdDefine[relativePath + '/']) {
            pathNode = cmdDefine[relativePath + '/'];
        }
        else {
            pathNode = cmdDefine;
        }
        if (pathNode.path) {
            this._cmdPath = pathNode.path;
        }
        var varReplace = function (a, b) {
            if (b == 'file') {
                return file;
            }
            else if (b == 'fileName') {
                return fileName;
            }
            else if (b == 'relativePath') {
                return relativePath || '.';
            }
            else if (variable && variable[b]) {
                return variable[b];
            }
            else {
                return a;
            }
        };
        var cmdNode = pathNode[ext];
        if (cmdNode) {
            cmdArray = [].concat(cmdNode.command);
            for (var i = 0, j = cmdArray.length; i < j; i++) {
                var item = cmdArray[i];
                item = item.replace(/\#\{([^}]+)\}/g, varReplace);
                cmdArray[i] = item;
            }
            result = result.concat(cmdArray);
        }
        this._command = result;
        this.originFileName = path.relative(this.basePath, this.originfile);
        if (cmdNode.file) {
            this._file = cmdNode.file.replace(/\#\{([^}]+)\}/g, varReplace)
                .replace(/^\.\//, '');
        }
    };
    fileManage._instance = {};
    return fileManage;
}());
module.exports = fileManage;
