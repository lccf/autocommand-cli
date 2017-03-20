"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../declare/index.d.ts" />
var fs = require("fs");
var hjson = require("hjson");
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
        try {
            fs.statSync(configFile);
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
        catch (e) {
            throw new Error("config file not found");
        }
    };
    configUtil.initConfig = function (options) {
        var configContent = "{\n  // \u4FA6\u542C\u7684\u6587\u4EF6\n  \"file\": [\"**/*.jade\", \"*.sass\", \"*.ls\"],\n  // \u8FC7\u6EE4\n  \"ignore\": [\"_*.*\", \"node_modules/\"],\n  // \u53D8\u91CF\n  \"variable\": {\n    \"localBin\": \"~/node_modules/.bin\"\n  },\n  // \u73AF\u5883\u53D8\u91CF\n  // \u4EE5:\u6253\u5934\u8868\u793A\u8FFD\u52A0\n  \"environment\": {\n    \":PATH\": \"#{localBin}\"\n  },\n  // \u5B9A\u4E49\n  // #{file} \u8868\u793A\u5F53\u524D\u6587\u4EF6\n  // #{fileName} \u8868\u793A\u5F53\u524D\u6587\u4EF6\u540D(\u4E0D\u5305\u542B\u6269\u5C55\u540D)\n  // #{basePath} \u5F53\u524D\u547D\u4EE4\u7684\u5DE5\u4F5C\u8DEF\u5F84\n  // #{relativePath \u5F53\u524D\u6587\u4EF6\u76F8\u5BF9\u4E8E\u9879\u76EE\u6839\u76EE\u5F55\u7684\u8DEF\u5F84\n  // #{defilePath \u9488\u5BF9\u5F53\u524D\u6587\u4EF6\u7684\u5B9A\u4E49\u8DEF\u5F84\n  // #{relativeFile \u76F8\u5BF9\u4E8E\u5F53\u524D\u5DE5\u4F5C\u8DEF\u5F84\u7684\u6587\u4EF6\u540D\uFF0C\u542B\u8DEF\u5F84\n  // #{defineRelativePath \u6587\u4EF6\u76F8\u8DEF\u5F84\u76F8\u5BF9\u4E8E\u5B9A\u4E49\u547D\u4EE4\u76EE\u5F55\u7684\u8DEF\u5F84\n  // #{[variableKey]} variable\u4E2D\u5B9A\u81EA\u5B9A\u4E49\u7684\u53D8\u91CF\n  \"define\": {\n    \".jade\": {\n      \"file\": \"#{relativePath}/#{fileName}.html\",\n      \"command\": \"pug -Po . #{file}\"\n    },\n    \".sass\": {\n      \"file\": \"#{relativePath}/#{fileName}.html\",\n      \"command\": \"node-sass --output-style compact #{fileName}.sass ./#{fileName}.css\",\n      \"behavior\": {\n        \"stderr\": [\n          {\n            \"match\": \"/Rendering Complete/\",\n            \"message\": \"reject sass error\"\n          }\n        ]\n      }\n    },\n    \".ls\": {\n      \"file\": \"#{relativePath}/#{fileName}.js\",\n      \"command\": \"lsc -cbp ./#{fileName}.ls>./#{fileName}.js\"\n    },\n    // \u5D4C\u5957\u76EE\u5F55\n    \"jade/\": {\n      // ~\u4EE3\u8868baseDir\n      // .\u4EE3\u8868\u5F53\u524D\n      \"path\": \".\",\n      \".jade\": {\n        \"file\": \"#{relativePath}/#{fileName}.html\",\n        \"command\": \"pug -Po . #{file}\"\n      }\n    }\n  },\n  // browserSync\u914D\u7F6E\n  \"browserSync\": {\n    // \u521D\u59CB\u5316\u914D\u7F6E\n    \"init\": {\n      \"server\": {\n        \"baseDir\": \"./\"\n      },\n      \"open\": false,\n      \"ui\": false\n    },\n    // \u542F\u52A8livereload\n    \"reload\": true\n  }\n}\n// vim: se sw=2 ts=2 sts=2 ft=javascript et:";
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
            var result = this.testConfig(configPath);
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
    return configUtil;
}());
configUtil.defaultConfig = '_config';
configUtil._instance = {};
exports.default = configUtil;
