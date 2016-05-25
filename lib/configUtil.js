"use strict";
/// <reference path="../../typings/main" />
var fs = require('fs');
var configUtil = (function () {
    function configUtil() {
    }
    /**
     * 获取配置文件
     * @param configFile {string} 配置文件名
     * @param force {boolean} 是否强制更新，默认仅首次读取
     */
    configUtil.getConfig = function (configFile, force) {
        if (force === void 0) { force = false; }
        var config = null;
        if (!configUtil._instance[configFile] || force) {
            config = configUtil._instance[configFile] = configUtil.read(configFile);
        }
        else {
            config = configUtil._instance[configFile];
        }
        return config;
    };
    /**
     * 读取配置文件
     * @param configFile {string} 配置文件名
     */
    configUtil.read = function (configFile) {
        var result = null;
        if (!configFile.length) {
            configFile = '_config';
        }
        if (fs.existsSync(configFile)) {
            var configContent = fs.readFileSync(configFile, 'utf-8');
            configContent = configContent.replace(/\s*\/\/.*/g, '').replace(/\s*\/\*.*\*\//g, '');
            try {
                result = JSON.parse(configContent);
                return result;
            }
            catch (e) {
                console.error(e.stack);
                throw new Error("parse config error");
            }
        }
        else {
            throw new Error("config file not found");
        }
    };
    configUtil.initConfig = function (options) {
        var configContent = '{\n  // 侦听文件\n  "file": ["**/*.jade", "*.sass", "*.ls"],\n  // 过滤\n  "ignore": ["^_"],\n  // 变量\n  "variable": { },\n  // 定义\n  "define": {\n    ".jade": {\n      "file": "#{fileName}.html",\n      "command": "jade -Po ./ #{fileName}.jade"\n    },\n    ".sass": {\n      "command": "sass --sourcemap=none --style compact #{fileName}.sass ./#{fileName}.css"\n    },\n    ".ls": {\n      "file": "#{fileName}.js",\n      "command": "lsc -cbp ./#{fileName}.ls>./#{fileName}.js"\n    },\n    // 嵌套目录\n    "jade/": {\n      // ~代表baseDir\n      // .代表当前\n      "path": "~",\n      ".jade": {\n        "file": "#{fileName}.html",\n        "command": "jade -Po ./ jade/#{fileName}.jade"\n      }\n    }\n  },\n  // browserSync配置\n  "browserSync": {\n    // 初始化配置\n    "init": {\n      "server": {\n        "baseDir": "./"\n      },\n      "open": false\n    },\n    // 启动livereload\n    "reload": true\n  }\n}\n';
        var fileName = configUtil.defaultConfig;
        if (options.init !== true) {
            fileName = options.init;
        }
        try {
            fs.writeFileSync(fileName, configContent);
        }
        catch (e) {
            console.error('failure error:');
            console.error(e.stack);
        }
    };
    configUtil.testConfig = function (configPath) {
        var fileName = '_config';
        if (configPath) {
            fileName = configPath;
        }
        try {
            var config = this.read(fileName);
            return config ? true : false;
        }
        catch (e) {
            return false;
        }
    };
    configUtil.testAction = function (configPath) {
        try {
            var result = this.read(configPath);
            if (result) {
                console.log('success');
            }
            else {
                console.log('error');
            }
        }
        catch (e) {
            console.error(e.message);
        }
    };
    configUtil.action = function (options) {
        if (options.init) {
            this.initConfig(options);
        }
        else if (options.test) {
            if (options.test !== true) {
                this.testAction(options.test);
            }
            else {
                this.testAction(configUtil.defaultConfig);
            }
        }
    };
    configUtil.defaultConfig = '_config';
    configUtil._instance = {};
    return configUtil;
}());
module.exports = configUtil;
