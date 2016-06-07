"use strict";
var AutocommandBase = (function () {
    function AutocommandBase() {
    }
    AutocommandBase.prototype.replaceVariable = function (allText, context, match) {
        if (match === void 0) { match = /\#\{([^}]+)\}/g; }
        return allText.replace(match, AutocommandBase.replaceVariableHandler.bind(context));
    };
    AutocommandBase.replaceVariableHandler = function (allText, variableName) {
        var result = allText;
        var context = this;
        var allowName = ['file', 'fileName', 'basePath', 'relativePath', 'definePath', 'defineRelativePath'];
        if (allowName.indexOf(variableName) >= 0 && context[variableName]) {
            result = context[variableName];
        }
        else if (context.variable && context.variable[variableName]) {
            result = context.variable[variableName].replace(/^~\//, context.basePath + '/');
        }
        return result;
    };
    return AutocommandBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AutocommandBase;
