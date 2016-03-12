/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>
let configUtil:any = require('./configUtil.js');
import path = require('path');
import child_process = require('child_process');
import bs = require('browser-sync');

let exec = child_process.exec;

class Watch {
    config: configStructure;
    constructor() {
      this.config = configUtil.read();
    }
    run(): void {
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
        bs.watch(watchFile).on('change', this.compileCallbac);
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
    compileTask(file: string, ext: string, reload: any): void {

    }
    compileCallbac(file: string): void {
      let ext: string = path.extname(file);

      if (this.checkIgnore(file) != true || this.checkExtention(ext) != true) {
        return;
      }
      this.compileTask(file, ext, bs.reload);
    }
}

module.exports = new Watch();
