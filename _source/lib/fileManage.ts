/// <reference path="../../typings/main.d.ts" />
/// <reference path="../declare/main.d.ts" />
import path = require('path');
let configUtil:any = require('./configUtil.js');

class fileManage {
  private static _instance = {}
  public static getFile(file: string, config: configStructure): fileManage {
    let fileCache: any = fileManage._instance;
    let fileObject: any = null;
    if (fileCache[file]) {
      fileObject = fileCache[file];
    } else {
      fileObject = new fileManage(file, config);
      this._instance[file] = fileObject;
    }
    return fileObject;
  }
  config: configStructure;
  private file: string;
  /* 获取文件名 */
  private _fileName: string;
  get fileName(): string {
    return this._fileName;
  }
  /* 获取文件扩展名 */
  private _fileExt: string;
  get fileExt(): string {
    return this._fileExt;
  }
  /* 获取文件路径 */
  private _filePath: string;
  get filePath(): string {
    return this._filePath;
  }
  /* 执行命令路径 */
  private _cmdPath: string;
  get cmdPath(): string {
    return this._cmdPath;
  }
  /* 执行命令 */
  private _command: Array<string>;
  get command(): Array<string> {
    return this._command;
  }

  /* 文件名 */
  private _file: string;
  get file(): string {
    return this._file;
  }

  public parseFileExt(): void {
    let ext: string = path.extname(this.file);
    this._fileExt = ext;
  }
  public parseFileName(): void {
    let fileName: string = path.basename(this.file, this.fileExt);
    this._fileName = fileName;
  }
  public parseFilePath(): void {
    let filePath: string = path.dirname(this.file);
    this._filePath = filePath;
  }
  public parseFileCommand(): void {
    let config = this.config;
    let result: Array<any> = [];
    let file: string = this.file;
    let fileName: string = this.fileName;
    let filePath: string = this.filePath;
    let ext: string = this.fileExt;
    let relativePath: string = path.relative(process.cwd(), filePath);

    // result.push(file)

    if (path.sep != '/') {
      relativePath = relativePath.replace('\\', '/');
      file = file.replace('\\', '/');
    }
    let cmdDefine: any = config.define;
    let pathNode: any = false;
    let cmdArray: Array<string> = [];
    let variable: any = config.variable;
    if (cmdDefine[relativePath]) {
      pathNode = cmdDefine[relativePath];
    }
    else {
      pathNode = cmdDefine;
    }

    let varReplace: any = function(a, b) {
      if (b == 'file') {
        return file;
      }
      else if (b == 'fileName') {
        return fileName;
      }
      else if (b == 'relativePath') {
        return relativePath;
      }
      else if (variable && variable[b]) {
        return variable[b];
      }
      else {
        return a;
      }
    }

    let cmdNode: any = pathNode[ext];
    if (cmdNode) {
      cmdArray = [].concat(cmdNode.command);
      for(var i=0, j = cmdArray.length; i<j; i++) {
        let item: string = cmdArray[i];
        item = item.replace(/\#\{\$([^}]+)\}/g, varReplace);
        cmdArray[i] = item;
      }
      result = result.concat(cmdArray);
    }
    this._command = result;
    if (cmdNode.file) {
      this._file = cmdNode.file.replace(/\#\{\$([^}]+)\}/g, varReplace);
    }
  }
  /* 构造函数 */
  constructor(file: string, config: configStructure) {
    this.config = config;
    this.file = file;
    this.parseFileExt();
    this.parseFileName();
    this.parseFilePath();
    this.parseFileCommand();
  }
}

module.exports = fileManage;
