/// <reference path="../typings/main"/>
"use strict";
var watch_1 = require('./lib/watch');
var Autocommand = (function () {
    function Autocommand() {
    }
    Autocommand.create = function () {
    };
    Autocommand.prototype.watch = function (config) {
        watch_1.default.callModel(config).startWatch();
        return this;
    };
    Autocommand.prototype.run = function (config) {
        watch_1.default.callModel(config).runCommand();
        return this;
    };
    return Autocommand;
}());
module.exports = Autocommand;
