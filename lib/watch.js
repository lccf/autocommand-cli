/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../declare/main.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require('path');
var exec = require('child_process').exec;
var browserSync = require('browser-sync');
var chokidar = require('chokidar');
var glob = require('glob');
var ignore = require('ignore');
var fileManage_1 = require('./fileManage');
var configUtil_1 = require('./configUtil');
var AutocommandBase_1 = require('./AutocommandBase');
var Watch = (function (_super) {
    __extends(Watch, _super);
    function Watch() {
        _super.apply(this, arguments);
    }
    Watch.prototype.debugInfo = function (info) {
        if (this.config.debug) {
            console.log(info);
        }
    };
    Watch.prototype.callModel = function (config) {
        this.config = config;
        this.basePath = process.cwd();
        return this;
    };
    Watch.prototype.compile = function () {
        this.run({ compile: true });
    };
    /* 主入口函数 */
    Watch.prototype.run = function (options) {
        var configFile = configUtil_1.default.defaultConfig;
        if (options.config && options.config != true) {
            configFile = options.config;
        }
        this.basePath = process.cwd();
        configFile = path.resolve(this.basePath, configFile);
        if (!this.config) {
            this.config = configUtil_1.default.getConfig(configFile);
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
            fileList = this.checkIgnore(fileList);
            if (!fileList) {
                console.error('file ignore');
                return;
            }
            if (!fileList.length) {
                console.error('file not find');
                return;
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
            if (this.configFile) {
                // 命令行模式没有配置文件
                watchFile.push(this.configFile);
            }
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
        fileManage_1.default.clear();
    };
    /* 重新载入监听及配置 */
    Watch.prototype.reloadWatch = function () {
        if (configUtil_1.default.testConfig(this.configFile)) {
            this.stopWatch();
            this.config = configUtil_1.default.getConfig(this.configFile, true);
            console.log("\n");
            console.log("====================reload config====================");
            this.startWatch();
        }
        else {
            console.error('config parse error');
        }
    };
    /* 检测忽略 */
    Watch.prototype.checkIgnore = function (file) {
        var result = [].concat(file);
        var ignoreRules = [].concat(this.config.ignore);
        // 筛选字符串过滤规则
        var stringIgnoreRules = ignoreRules.filter(function (item) { return typeof item == 'string' ? true : false; });
        if (stringIgnoreRules && stringIgnoreRules.length) {
            var ig = ignore().add(stringIgnoreRules);
            result = ig.filter(file);
        }
        // 筛选函数过滤规则
        var functionIgnoreRules = ignoreRules.filter(function (item) { return typeof item == 'function' ? true : false; });
        if (functionIgnoreRules && functionIgnoreRules.length) {
            for (var _i = 0, functionIgnoreRules_1 = functionIgnoreRules; _i < functionIgnoreRules_1.length; _i++) {
                var rule = functionIgnoreRules_1[_i];
                result = result.filter(rule);
            }
        }
        // 筛选正则表达式过滤规则
        var regexpIgnoreRules = ignoreRules.filter(function (item) { return typeof item == 'object' && item.constructor == RegExp ? true : false; });
        if (regexpIgnoreRules && regexpIgnoreRules.length) {
            var _loop_1 = function(rule) {
                result = result.filter(function (item) { return item.match(rule) == null; });
            };
            for (var _a = 0, regexpIgnoreRules_1 = regexpIgnoreRules; _a < regexpIgnoreRules_1.length; _a++) {
                var rule = regexpIgnoreRules_1[_a];
                _loop_1(rule);
            }
        }
        if (result && result.length) {
            return result;
        }
    };
    /* 编译任务 */
    Watch.prototype.compileTask = function (file, reload) {
        var _this = this;
        var fileObject = fileManage_1.default.getFile(file, this.config, this.basePath);
        var command = fileObject.command, relativeFile = fileObject.relativeFile;
        var fileName = fileObject.file;
        var workPath = '';
        var basePath = this.basePath;
        var environment = null;
        var cmdIndex = -1;
        if (!(command && command.length)) {
            console.log('command not define! file:' + file);
            return;
        }
        if (fileObject.cmdPath) {
            workPath = fileObject.cmdPath;
            console.log('workPath:' + workPath);
        }
        /**
         * 计算环境变量
         */
        if (this.config.environment) {
            var variableContext_1 = {
                file: fileObject.file,
                fileName: fileObject.fileName,
                basePath: basePath,
                relativePath: path.relative(basePath, fileObject.filePath),
                definePath: fileObject.definePath,
                defineRelativePath: fileObject.defineRelativePath,
                variable: this.config.variable
            };
            environment = Object.assign({}, process.env);
            for (var key in this.config.environment) {
                var value = [].concat(this.config.environment[key]);
                value = value.map(function (item) {
                    return _this.replaceVariable(item, variableContext_1);
                });
                value = value.join(path.delimiter);
                // 如果是以:开头的，则使用追加模式
                if (key.charAt(0) == ':') {
                    var realKey = key.substr(1);
                    environment[realKey] = value + path.delimiter + environment[realKey];
                }
                else {
                    environment[key] = value;
                }
            }
        }
        /**
         * 执行命令的回调
         */
        var execCallback = function (err, stdo, stde) {
            if (err == null && !stde) {
                console.log("compiled " + (fileName || relativeFile));
                if (reload && fileName) {
                    reload(fileName);
                }
            }
            else {
                console.error(err || stde);
            }
        };
        /**
         * 执行命令
         */
        var execCmd = function () {
            var currCmd = command[++cmdIndex];
            if (command.length <= cmdIndex + 1) {
                cmdIndex = -1;
            }
            if (currCmd) {
                this.debugInfo("exec command:" + currCmd);
                var execOptions = {};
                if (workPath) {
                    execOptions.cwd = workPath;
                }
                if (environment) {
                    execOptions.env = environment;
                }
                if (workPath || environment) {
                    exec(currCmd, execOptions, execCallback);
                }
                else {
                    exec(currCmd, execCallback);
                }
            }
        };
        execCmd.bind(this)();
    };
    /* 编译回调 */
    Watch.prototype.compileCallback = function (file) {
        if (file == this.configFile) {
            if (configUtil_1.default.testConfig(file)) {
                this.reloadWatch();
            }
        }
        else {
            if (!this.checkIgnore(file)) {
                return;
            }
            this.compileTask(file, this.browserSync && this.config.browserSync.reload ? this.browserSync.reload : null);
        }
    };
    return Watch;
}(AutocommandBase_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Watch;
