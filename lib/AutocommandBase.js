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
        switch (variableName) {
            case 'file':
                result = this.file;
                break;
            case 'fileName':
                result = this.fileName;
                break;
            case 'relativePath':
                result = this.relativePath || '.';
                break;
            default:
                if (this.variable && this.variable[variableName]) {
                    result = this.variable[variableName].replace(/^~\//, this.basePath + '/');
                }
                break;
        }
        return result;
    };
    return AutocommandBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AutocommandBase;
