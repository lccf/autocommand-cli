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
            var configContent = fs.readFileSync(configFile);
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
    configUtil._instance = [];
    return configUtil;
}());
module.exports = configUtil;
