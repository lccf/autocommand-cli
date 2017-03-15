"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var AutocommandBase_1 = require("./AutocommandBase");
var fileManage = (function (_super) {
    __extends(fileManage, _super);
    /* 构造函数 */
    function fileManage(file, config, basePath) {
        var _this = _super.call(this) || this;
        /* definePath */
        _this._definePath = '.';
        /* relativePath */
        _this._relativePath = '.';
        /* defineRelativePath */
        _this._defineRelativePath = '.';
        _this._stdout = null;
        _this._stderr = null;
        _this.config = config;
        _this.originfile = file;
        _this.basePath = basePath;
        _this.parseFileExt();
        _this.parseFileName();
        _this.parseFilePath();
        _this.parseFileCommand();
        return _this;
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
    Object.defineProperty(fileManage.prototype, "definePath", {
        get: function () {
            return this._definePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "relativePath", {
        get: function () {
            return this._relativePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "defineRelativePath", {
        get: function () {
            return this._defineRelativePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "stdout", {
        get: function () {
            return this._stdout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fileManage.prototype, "stderr", {
        get: function () {
            return this._stderr;
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
        var _this = this;
        var _a = this, config = _a.config, fileName = _a.fileName, filePath = _a.filePath;
        var result = [];
        var file = this.originfile;
        var ext = this.fileExt;
        var relativePath = path.relative(process.cwd(), filePath) || '.';
        if (path.sep != '/') {
            relativePath = relativePath.replace('\\', '/');
            file = file.replace('\\', '/');
        }
        var cmdDefine = config.define;
        var pathNode = false;
        var cmdArray = [];
        // 循环检测目录
        var definePath = relativePath;
        var defineRelativePath = '.';
        this._relativePath = relativePath;
        while (definePath != '.') {
            if (cmdDefine[definePath + '/'] && cmdDefine[definePath + '/'][ext]) {
                pathNode = cmdDefine[definePath + '/'];
                defineRelativePath = path.relative(definePath, relativePath) || '.';
                this._definePath = definePath;
                this._defineRelativePath = defineRelativePath;
                break;
            }
            definePath = path.dirname(definePath);
        }
        if (!pathNode && cmdDefine[ext]) {
            pathNode = cmdDefine;
        }
        // 如果未找到相关定义
        if (!pathNode) {
            return;
        }
        if (pathNode.path) {
            if (pathNode.path.match(/^~\//)) {
                this._cmdPath = path.resolve(this.basePath, pathNode.path.substr(2));
            }
            else if (pathNode.path !== '~') {
                this._cmdPath = path.resolve(this.filePath, pathNode.path);
            }
        }
        // 相对文件名
        this.relativeFile = path.relative(this.basePath, this.originfile);
        // 计算路径
        var cmdNode = pathNode[ext];
        var variableContext = {
            file: file,
            fileName: fileName,
            basePath: this.basePath,
            relativePath: relativePath,
            definePath: this.definePath,
            relativeFile: this.relativeFile,
            defineRelativePath: this.defineRelativePath,
            variable: config.variable
        };
        if (cmdNode) {
            cmdArray = [].concat(cmdNode.command);
            cmdArray = cmdArray.map(function (item) {
                var cmd;
                switch (typeof item) {
                    case 'string':
                        cmd = _this.replaceVariable(item, variableContext);
                        break;
                    case 'function':
                        cmd = item(variableContext);
                        break;
                    default:
                        cmd = item;
                }
                return cmd;
            });
            result = result.concat(cmdArray);
            if (cmdNode['behavior']) {
                this._stdout = cmdNode['behavior']['stdout'] || null;
                this._stderr = cmdNode['behavior']['stderr'] || null;
            }
        }
        this._command = result;
        // 计算file字段
        if (cmdNode.file) {
            // 处理file字段函数调用
            if (typeof cmdNode.file == 'string') {
                this._file = this.replaceVariable(cmdNode.file, variableContext).replace(/^\.\//, '');
            }
            else if (typeof cmdNode.file == 'function') {
                this._file = cmdNode.file(variableContext);
            }
            else {
                this._file = cmdNode.file;
            }
        }
    };
    return fileManage;
}(AutocommandBase_1.default));
fileManage._instance = {};
exports.default = fileManage;
