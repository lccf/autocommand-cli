/// <reference path="../../typings/index.d.ts" />

import path = require('path');
import AutocommandBase from './AutocommandBase';
import { configStructure } from '../declare/config';

export default class fileManage extends AutocommandBase {
  private static _instance = {}
  public static getFile(file: string, config: configStructure, basePath: string): fileManage {
    let fileCache: any = fileManage._instance;
    let fileObject: any = null;
    if (fileCache[file]) {
      fileObject = fileCache[file];
    } else {
      fileObject = new fileManage(file, config, basePath);
      fileManage._instance[file] = fileObject;
    }
    return fileObject;
  }
  public static clear() {
    let fileCache: any = fileManage._instance;
    for (let key in fileCache) {
      fileCache[key] = null;
    }
    fileCache = {}
    fileManage._instance = fileCache;
  }
  public config: configStructure;
  private originfile: string;

  public relativeFile: string;
  /* 获取文件名 */
  private _fileName: string;
  get fileName(): string {
    return this._fileName;
  }
  /* 基础路径 */
  private basePath: string;
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

  /* definePath */
  private _definePath: string = '.';
  get definePath(): string {
    return this._definePath;
  }

  /* relativePath */
  private _relativePath: string = '.';
  get relativePath(): string {
    return this._relativePath;
  }

  /* defineRelativePath */
  private _defineRelativePath: string = '.';
  get defineRelativePath(): string {
    return this._defineRelativePath;
  }

  public parseFileExt(): void {
    let ext: string = path.extname(this.originfile);
    this._fileExt = ext;
  }
  public parseFileName(): void {
    let fileName: string = path.basename(this.originfile, this.fileExt);
    this._fileName = fileName;
  }
  public parseFilePath(): void {
    let filePath: string = path.dirname(this.originfile);
    this._filePath = filePath;
  }
  public parseFileCommand(): void {
    let {config, fileName, filePath } = this;
    let result: Array<any> = [];
    let file: string = this.originfile;
    let ext: string = this.fileExt;
    let relativePath: string = path.relative(process.cwd(), filePath) || '.';

    if (path.sep != '/') {
      relativePath = relativePath.replace('\\', '/');
      file = file.replace('\\', '/');
    }

    let cmdDefine: any = config.define;
    let pathNode: any = false;
    let cmdArray: Array<any> = [];
    // 循环检测目录
    let definePath = relativePath;
    let defineRelativePath = '.';
    this._relativePath = relativePath;
    while(definePath != '.') {
      if (cmdDefine[definePath+'/'] && cmdDefine[definePath+'/'][ext]) {
        pathNode = cmdDefine[definePath+'/'];
        defineRelativePath = path.relative(definePath, relativePath) || '.';
        this._definePath = definePath;
        this._defineRelativePath = defineRelativePath;
        break;
      }
      definePath = path.dirname(definePath);
    }
    if (!pathNode && cmdDefine[ext]) {
      pathNode = cmdDefine;
    }
    // 如果未找到相关定义
    if (!pathNode) {
      return;
    }

    if (pathNode.path) {
      if (pathNode.path.match(/^~\//)) {
        this._cmdPath = path.resolve(this.basePath, pathNode.path.substr(2));
      }
      else if (pathNode.path !== '~') {
        this._cmdPath = path.resolve(this.filePath, pathNode.path);
      }
    }

    // 相对文件名
    this.relativeFile  = path.relative(this.basePath, this.originfile);

    // 计算路径
    let cmdNode: any = pathNode[ext];
    let variableContext = {
      file: file,
      fileName: fileName,
      basePath: this.basePath,
      relativePath: relativePath,
      definePath: this.definePath,
      relativeFile: this.relativeFile,
      defineRelativePath: this.defineRelativePath,
      variable: config.variable
    }
    if (cmdNode) {
      cmdArray = [].concat(cmdNode.command);
      cmdArray = cmdArray.map((item) => {
        let cmd: any;
        switch(typeof item) {
          case 'string':
            cmd = this.replaceVariable(item, variableContext);
            break;
          case 'function':
            cmd = item(variableContext);
            break;
          default:
            cmd = item;
        }
        return cmd;
      })
      result = result.concat(cmdArray);
    }
    this._command = result;


    // 计算file字段
    if (cmdNode.file) {
      // 处理file字段函数调用
      if (typeof cmdNode.file == 'string') {
        this._file = this.replaceVariable(cmdNode.file, variableContext).replace(/^\.\//,'');
      } else if (typeof cmdNode.file == 'function') {
        this._file = cmdNode.file(variableContext);
      }
      else {
        this._file = cmdNode.file;
      }
    }
  }
  /* 构造函数 */
  constructor(file: string, config: configStructure, basePath: string) {
    super();
    this.config = config;
    this.originfile = file;
    this.basePath = basePath;
    this.parseFileExt();
    this.parseFileName();
    this.parseFilePath();
    this.parseFileCommand();
  }
}
