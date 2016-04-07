"use strict";
/// <reference path="../../typings/main" />
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
            finally { }
        }
        else {
            console.log('config file not found');
        }
    };
    configUtil.initConfig = function (options) {
        var configContent = ' { ' +
            '   // 侦听的文件 ' +
            '   "watchFile": ["*.sass", "*.scss", "*.ts", "*.sass"], ' +
            '   // 过滤 ' +
            '   "ignore": ["^_", ".d.ts$"], ' +
            '   // 变量 ' +
            '   "variable": { }, ' +
            '   // 定义 ' +
            '   "define": { ' +
            '     "jade/": { ' +
            '       // ~代表baseDir ' +
            '       // .代表当前 ' +
            '       "path": "~", ' +
            '       ".jade": { ' +
            '         "command": [ ' +
            '           "jade -Po ../ jade/#{$fileName}.jade" ' +
            '         ] ' +
            '       } ' +
            '     }, ' +
            '     ".sass": { ' +
            '       "file": "#{$fileName}.css", ' +
            '       "command": "sass #{$file} #{$fileName}.css" ' +
            '     }, ' +
            '     ".ls": { ' +
            '       "command": [ ' +
            '         "lsc -cbp live/#{$fileName}.ls>../js/#{$fileName}.js" ' +
            '          /* , "cp -fp ../js/#{$fileName}.js ../../../statics/web/africa/js" */ ' +
            '       ] ' +
            '     } ' +
            '   } ' +
            ' } ';
        var fileName = '_config';
        if (options.file) {
            fileName = options.file;
        }
        try {
            fs.writeFileSync(fileName, configContent);
        }
        catch (e) {
            console.log('failure error:');
            console.log(e);
        }
    };
    configUtil.action = function (action, options) {
        if (action == 'init') {
            this.initConfig(options);
        }
    };
    configUtil._instance = [];
    return configUtil;
}());
module.exports = configUtil;
