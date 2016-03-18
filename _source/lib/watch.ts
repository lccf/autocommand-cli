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
    watchPath: string;
    browserSync: any;
    run(dir: string = './', options: any): void {
      let configFile = '_config';
      if (options.config && options.config != true) {
        configFile = options.config;
      }
      if (dir.charAt(0) != '/') {
        this.watchPath = path.normalize(process.cwd() + '/' + dir);
      }
      else {
        this.watchPath = dir;
      }
      configFile = path.normalize(this.watchPath + '/' + configFile);
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
          watchFile.push(this.watchPath + file);
        }
        if (config.browserSync) {
          this.browserSync.init(browserSync);
        }
        else {
          this.browserSync.init();
        }
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
