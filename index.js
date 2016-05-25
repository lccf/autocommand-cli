/// <reference path="../typings/main"/>
"use strict";
var Autocommand = (function () {
    function Autocommand() {
    }
    Autocommand.create = function () {
    };
    Autocommand.prototype.watch = function (config) {
        this.config = config;
        this.startWatch();
        return this;
    };
    Autocommand.prototype.run = function (config) {
        return this;
    };
    return Autocommand;
}());
module.exports = Autocommand;
