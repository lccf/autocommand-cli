interface contextStructure {
  file: string;
  fileName: string;
  basePath: string;
  relativePath: string;
  variable: any;
}

export default class AutocommandBase {

  replaceVariable(allText: string, context: any, match: RegExp = /\#\{([^}]+)\}/g): string {
    return allText.replace(match, AutocommandBase.replaceVariableHandler.bind(context));
  }

  static replaceVariableHandler(allText: string, variableName: string): string {
    let result = allText;
    let context: contextStructure = this;
    switch(variableName) {
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
          result = context.variable[variableName].replace(/^~\//, context.basePath+'/');
        }
        break;
    }
    return result;
  }
}
