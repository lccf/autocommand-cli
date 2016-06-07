export default class AutocommandBase {

  replaceVariable(allText: string, context: any, match: RegExp = /\#\{([^}]+)\}/g): string {
    return allText.replace(match, AutocommandBase.replaceVariableHandler.bind(context));
  }

  static replaceVariableHandler(allText: string, variableName: string): string {
    let result: string = allText;
    let context: any = this;
    let allowName: Array<string> = ['file', 'fileName', 'basePath', 'relativePath', 'definePath', 'defineRelativePath'];
      if (allowName.indexOf(variableName) >= 0 && context[variableName]) {
      result = context[variableName];
    }
    else if (context.variable && context.variable[variableName]) {
      result = context.variable[variableName].replace(/^~\//, context.basePath+'/');
    }
    return result;
  }
}
