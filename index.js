"use strict";
var watch_1 = require('./lib/watch');
var Autocommand = (function () {
    function Autocommand(_watch) {
        if (_watch === void 0) { _watch = new watch_1.default(); }
        this._watch = _watch;
    }
    Autocommand.create = function () {
        return new Autocommand();
    };
    Autocommand.prototype.watch = function (config) {
        this._watch.callModel(config).startWatch();
        return this;
    };
    Autocommand.prototype.run = function (config) {
        this._watch.callModel(config).runCommand();
        return this;
    };
    return Autocommand;
}());
module.exports = Autocommand;
