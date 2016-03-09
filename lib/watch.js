/// <reference path="../../typings/main" />
var configUtil = require('./configUtil.js');
var Watch = (function () {
    function Watch() {
    }
    Watch.prototype.run = function () {
        var config = configUtil.read();
    };
    return Watch;
}());
module.exports = new Watch();
