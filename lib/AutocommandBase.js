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
        switch (variableName) {
            case 'file':
                result = context.file;
                break;
            case 'fileName':
                result = context.fileName;
                break;
            case 'relativePath':
                result = context.relativePath || '.';
                break;
            default:
                if (context.variable && context.variable[variableName]) {
                    result = context.variable[variableName].replace(/^~\//, context.basePath + '/');
                }
                break;
        }
        return result;
    };
    return AutocommandBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AutocommandBase;
