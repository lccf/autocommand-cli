"use strict";
var fs = require('fs');
var configUtil = (function () {
    function configUtil() {
    }
    configUtil.getConfig = function (configFile, force) {
        if (force === void 0) { force = false; }
        var config = null;
        if (!configUtil._instance[configFile] || force) {
            config = configUtil.read(configFile);
        }
        else {
            config = configUtil._instance[configFile];
        }
        return config;
    };
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
                console.error(e.static);
                throw new Error("parse config error");
            }
        }
        else {
            throw new Error("config file not found");
        }
    };
    configUtil.initConfig = function (options) {
        var configContent = '{\n  // 侦听的文件\n  "watchFile": ["*.jade", "*.sass", "*.ts"],\n  // 过滤\n  "ignore": ["^_", ".d.ts$"],\n  // 变量\n  "variable": { },\n  // 定义\n  "define": {\n    "jade/": {\n      // ~代表baseDir\n      // .代表当前\n      "path": "~",\n      ".jade": {\n        "command": [\n          "jade -Po ../ jade/#{fileName}.jade"\n        ]\n      }\n    },\n    ".sass": {\n      "file": "#{fileName}.css",\n      "command": "sass #{file} #{fileName}.css"\n    },\n    ".ls": {\n      "command": [\n        "lsc -cbp live/#{fileName}.ls>../js/#{fileName}.js"\n      ]\n    }\n  }\n}';
        var fileName = '_config';
        if (options.config) {
            fileName = options.config;
        }
        try {
            fs.writeFileSync(fileName, configContent);
        }
        catch (e) {
            console.log('failure error:');
            console.log(e);
        }
    };
    configUtil.testConfig = function (configPath) {
        var fileName = '_config';
        if (configPath) {
            fileName = configPath;
        }
        var config = this.read(fileName);
        return config ? true : false;
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
            this.testAction(options.config);
        }
    };
    configUtil._instance = [];
    return configUtil;
}());
module.exports = configUtil;
