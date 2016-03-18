/// <reference path="../../typings/main.d.ts"/>
/// <reference path="../declare/main.d.ts"/>

let configUtil: any = require('./configUtil.js');
let fileManage: any = require('./fileManage.js');
import path = require('path');
import child_process = require('child_process');
import browserSync = require('browser-sync');

let exec = child_process.exec;

class Watch {
    config: configStructure;
    workPath: string;
    browserSync: any;
    run(options: any): void {
      let configFile = '_config';
      if (options.config && options.config != true) {
        configFile = options.config;
      }
      this.workPath = process.cwd();
      configFile = path.normalize(this.workPath + '/' + configFile);
      console.log(configFile);
      if (!this.config) {
        this.config = configUtil.getConfig(configFile);
      }
      if (!this.browserSync) {
        this.browserSync = browserSync.create();
      }
      let config = this.config;
      let watchFile: Array<string> = [];
      if (config.watchFile || config.watchFile.length) {
        for(let i=0, j=config.watchFile.length; i<j; i++) {
          let file: string = config.watchFile[i];
          file = file.replace(/\\/g, '/');
          watchFile.push(path.normalize(this.workPath + '/' + file);
        }
        if (config.browserSync) {
          this.browserSync.init(browserSync);
        }
        else {
          this.browserSync.init();
        }
        console.log(watchFile);
        this.browserSync.watch(watchFile).on('change', this.compileCallback);
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
    compileTask(file: string, reload: any): void {
      let fileObject = fileManage.getFile(file);
      let command: Array<string> = fileObject.command;
      console.log(command);
    }
    compileCallback(file: string): void {
      if (this.checkIgnore(file) != true) {
        return;
      }
      this.compileTask(file, this.browserSync.reload);
    }
}

module.exports = new Watch();
