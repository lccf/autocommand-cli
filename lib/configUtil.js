"use strict";
/// <reference path="../../typings/main" />
var fs = require('fs');
var configUtil = (function () {
    function configUtil() {
    }
    configUtil.prototype.read = function (config) {
        var result = null;
        if (!config.length) {
            config = '_config';
        }
        if (fs.existsSync(config)) {
            var configContent = fs.readFileSync(config);
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
    return configUtil;
}());
module.exports = new configUtil();
