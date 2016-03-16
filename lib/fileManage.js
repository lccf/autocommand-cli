"use strict";
/// <reference path="../../typings/main.d.ts" />
/// <reference path="../declare/main.d.ts" />
var path = require('path');
var configUtil = require('./configUtil.js');
var fileManage = (function () {
    /* 构造函数 */
    function fileManage(file) {
        this.file = file;
        this.parseFileExt();
        this.parseFileName();
        this.parseFilePath();
        this.parseFileCommand();
    }
    fileManage.getInstance = function (file) {
        var fileCache = fileManage._instance;
        var fileObject = null;
        if (fileCache[file]) {
            fileObject = fileCache[file];
        }
        else {
            fileObject = new fileManage(file);
            this._instance[file] = fileObject;
        }
        return fileObject;
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
    fileManage.prototype.parseFileExt = function () {
        var ext = path.extname(this.file);
        this._fileExt = ext;
    };
    fileManage.prototype.parseFileName = function () {
        var fileName = path.basename(this.file, this.fileExt);
        this._fileName = fileName;
    };
    fileManage.prototype.parseFilePath = function () {
        var filePath = path.dirname(this.file);
        this._filePath = filePath;
    };
    fileManage.prototype.parseFileCommand = function () {
        var config = configUtil.getConfig();
        var result = [];
        var file = this.file;
        var fileName = this.fileName;
        var filePath = this.filePath;
        var ext = this.fileExt;
        var relativePath = path.resolve(config.baseDir, filePath);
        result.push(fileName);
        if (path.sep != '/') {
            relativePath = relativePath.replace('\\', '/');
            file = file.replace('\\', '/');
        }
        var cmdDefine = config.define;
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
        this._command = result;
    };
    fileManage._instance = {};
    return fileManage;
}());
