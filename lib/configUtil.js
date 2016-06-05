"use strict";
/// <reference path="../../typings/main" />
var fs = require('fs');
var hjson = require('hjson');
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
            try {
                result = hjson.parse(configContent);
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
        var configContent = "{\n  // \u4FA6\u542C\u7684\u6587\u4EF6\n  \"file\": [\"**/*.jade\", \"*.sass\", \"*.ls\"],\n  // \u8FC7\u6EE4\n  \"ignore\": [\"_*\", \"node_modules/\"],\n  // \u53D8\u91CF\n  \"variable\": {\n    \"LocalBin\": \"~/node_modules/.bin\"\n  },\n  // \u73AF\u5883\u53D8\u91CF\n  \"environment\": {\n    \":PATH\": \"#{LocalBin}\"\n  },\n  // \u5B9A\u4E49\n  \"define\": {\n    \".jade\": {\n      \"file\": \"#{relativePath}/#{fileName}.html\",\n      \"command\": \"pug -Po . #{file}\"\n    },\n    \".sass\": {\n      \"file\": \"#{relativePath}/#{fileName}.html\",\n      \"command\": \"node-sass --output-style compact #{fileName}.sass ./#{fileName}.css\"\n    },\n    \".ls\": {\n      \"file\": \"#{relativePath}/#{fileName}.js\",\n      \"command\": \"lsc -cbp ./#{fileName}.ls>./#{fileName}.js\"\n    },\n    // \u5D4C\u5957\u76EE\u5F55\n    \"jade/\": {\n      // ~\u4EE3\u8868baseDir\n      // .\u4EE3\u8868\u5F53\u524D\n      \"path\": \".\",\n      \".jade\": {\n        \"file\": \"#{relativePath}/#{fileName}.html\",\n        \"command\": \"pug -Po . #{file}\"\n      }\n    }\n  },\n  // browserSync\u914D\u7F6E\n  \"browserSync\": {\n    // \u521D\u59CB\u5316\u914D\u7F6E\n    \"init\": {\n      \"server\": {\n        \"baseDir\": \"./\"\n      },\n      \"open\": false\n    },\n    // \u542F\u52A8livereload\n    \"reload\": true\n  }\n}\n// vim: se sw=2 ts=2 sts=2 ft=javascript et:";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configUtil;
