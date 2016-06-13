/// <reference path="../typings/index.d.ts"/>
"use strict";
var watch_1 = require('./lib/watch');
var Autocommand = (function () {
    function Autocommand() {
    }
    Autocommand.create = function () {
        return new Autocommand();
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
