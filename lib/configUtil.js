"use strict";
var fs = require('fs');
var configUtil = (function () {
    function configUtil() {
    }
    configUtil.getConfig = function (configFile) {
        var config = null;
        if (!configUtil._instance[configFile]) {
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
                console.log('parse config error');
            }
        }
        else {
            console.log('config file not found');
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
    configUtil.testConfig = function (options) {
        var fileName = '_config';
        if (options.config) {
            fileName = options.config;
        }
        var config = this.read(fileName);
        if (config) {
            console.log('success');
        }
        else {
            console.log('failure');
        }
    };
    configUtil.action = function (options) {
        if (options.init) {
            this.initConfig(options);
        }
        else if (options.test) {
            this.testConfig(options);
        }
    };
    configUtil._instance = [];
    return configUtil;
}());
module.exports = configUtil;
