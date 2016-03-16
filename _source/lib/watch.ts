/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>
let configUtil:any = require('./configUtil.js');
import path = require('path');
import child_process = require('child_process');
import bs = require('browser-sync');

let exec = child_process.exec;

class Watch {
    config: configStructure;
    run(dir: string = '.', options: any): void {
      let configFile = '_config';
      if (options.config && options.config != true) {
        configFile = options.config;
      }
      if (!this.config) {
        this.config = configUtil.getConfig(configFile);
      }
      let config = this.config;
      let watchFile: Array<string> = [];
      if (config.watchFile || config.watchFile.length) {
        config.baseDir = (config.baseDir || '.')
          .replace(/\\/g, '/').replace(/\/$/, '');

        for(let i=0, j=config.watchFile.length; i<j; i++) {
          let file: string = config.watchFile[i];
          file = file.replace(/\\/g, '/');
          watchFile.push(config.baseDir+'/'+ file);
        }
        bs.watch(watchFile).on('change', this.compileCallback);
      }
    }
    /* 检测忽略 */
    checkIgnore(file: string): boolean {
      let filename: string = path.basename(file);
      let allow: boolean = true;
      let ignore = this.config.ignore;
      for(let i=0, j=ignore.length; i<j; i++) {
        let match = new RegExp(ignore[i]);
        if (match.exec(filename)) {
          allow = false;
          break;
        }
      }

      return allow;
    }
    getCompileCmdAndFileName(file: string, ext: string): Array<string> {
      let config = this.config;
      let result: Array<any> = [];
      let fileName: string = path.basename(file, ext);
      let filePath: string = path.dirname(file);
      let relativePath: string = path.resolve(config.baseDir, filePath);

      result.push(fileName);

      if (path.sep != '/') {
        relativePath = relativePath.replace('\\', '/');
        file = file.replace('\\', '/');
      }
      let cmdDefine: any = this.config.define;
      let pathNode: any = false;
      let cmdArray: Array<string> = [];

      if (cmdDefine[relativePath]) {
        pathNode = cmdDefine[relativePath];
      }

      let cmdNode: any = pathNode["."+ext];
      if (cmdNode) {
        cmdArray = [].concat(cmdNode.command);
        result.push(cmdArray);
      }
      else {
        result = [];
      }
      return result;
    }
    compileTask(file: string, ext: string, reload: any): void {
      let cmdAndFileName: Array<string> = this.getCompileCmdAndFileName(file, ext)
    }
    compileCallback(file: string): void {
      let ext: string = path.extname(file);

      if (this.checkIgnore(file) != true) {
        return;
      }
      this.compileTask(file, ext, bs.reload);
    }
}

module.exports = new Watch();
