/// <reference path="../../typings/main.d.ts"/>

import path = require('path');
import child_process = require('child_process');
import browserSync = require('browser-sync');
import chokidar = require('chokidar');
import glob = require('glob');

import fileManage from './fileManage';
import configUtil from './configUtil';
import configStructure from '../declare/config';

import AutocommandBase from './AutocommandBase';

let exec = child_process.exec;

class Watch extends AutocommandBase {
    config: configStructure;
    configFile: string;
    basePath: string;
    browserSync: any;
    watcher: any;

    callModel(config: configStructure): any {
      this.config = config;
      this.basePath = process.cwd();
      return this;
    }

    compile(): void {
      this.run({compile: true});
    }
    /* 主入口函数 */
    run(options: any): void {
      let configFile: string = configUtil.defaultConfig;
      if (options.config && options.config != true) {
        configFile = options.config;
      }
      this.basePath = process.cwd();
      configFile = path.resolve(this.basePath, configFile);
      if (!this.config) {
        this.config = configUtil.getConfig(configFile);
      }
      this.configFile = configFile;
      if (!options.test) {
        if (options.compile) {
          this.runCommand();
        }
        else {
          this.startWatch();
        }
      } else {
        this.testCommand(options.test);
      }
    }
    /* 测试模式 */
    testCommand(testFile: any): void {
      if (testFile === true) {
        testFile = 'test.sass';
      }
      this.compileCallback(path.resolve(this.basePath +'/'+ testFile));
    }
    /* 编译模式 */
    runCommand(): void {
      let config = this.config;

      let files: Array<string> = [];
      if (config.file || config.file.length) {
        for(let file of config.file) {
          file = file.replace(/\\/g, '/');
          files.push(path.resolve(this.basePath, file));
        }
        let fileList: Array<string> = [];

        for (let item of files) {
          let file = glob.sync(item);
          fileList = fileList.concat(file);
        }
        console.log('find files:\n'+fileList.join('\n'));
        fileList.map(this.compileCallback.bind(this));
      }
    }
    /* 监听模式 */
    startWatch(): void {
      let config = this.config;

      let watchFile: Array<string> = [];
      if (config.file || config.file.length) {
        for(let file of config.file) {
          file = file.replace(/\\/g, '/');
          watchFile.push(path.resolve(this.basePath, file));
        }
        watchFile.push(this.configFile);
        if (config.browserSync) {
          if (!this.browserSync) {
            this.browserSync = browserSync.create();
          }
          if (config.browserSync.init) {
            this.browserSync.init(config.browserSync.init);
          }
          else {
            this.browserSync.init();
          }
          this.watcher = this.browserSync.watch(watchFile).on('change', this.compileCallback.bind(this));
        }
        else {
          console.log('watch model，files:\n'+watchFile.join('\n'));
          this.watcher = chokidar.watch(watchFile).on('change', this.compileCallback.bind(this));
        }
      }
    }
    /* 停止监听 */
    stopWatch(): void {
      if (this.watcher) {
        this.watcher.close();
        this.watcher = null;
      }
      if(this.browserSync) {
        this.browserSync.exit();
        this.browserSync = null;
      }
      fileManage.clear();
    }
    /* 重新载入监听及配置 */
    reloadWatch(): void {
      if (configUtil.testConfig(this.configFile)) {
        this.stopWatch();
        this.config = configUtil.getConfig(this.configFile, true);
        console.log("\n");
        console.log("====================reload config====================");
        this.startWatch();
      }
      else {
        console.log('config parse error');
      }
    }
    /* 检测忽略 */
    checkIgnore(file: string): boolean {
      let filename: string = path.basename(file);
      let allow: boolean = true;
      let ignore = this.config.ignore;
      for (let item of ignore) {
        let match: RegExp = new RegExp(item);
        if (match.exec(filename)) {
          allow = false;
          break;
        }
      }
      return allow;
    }
    /* 编译任务 */
    compileTask(file: string, reload: any): void {
      let fileObject = fileManage.getFile(file, this.config, this.basePath);
      let command: Array<string> = fileObject.command;
      let fileName: string = fileObject.file;
      let originFileName: string = fileObject.originFileName;
      let workPath: string = '';
      let basePath: string = this.basePath;
      let environment: any = null;
      var cmdIndex: number = -1;
      if (fileObject.cmdPath) {
        // 相对于当前配置文件的工作路径计算
        if (fileObject.cmdPath.match(/^~\//)) {
          workPath = path.resolve(basePath, fileObject.cmdPath.substr(2));
        }
        // 当对于当前文件的工作路径计算
        else if (fileObject.cmdPath !== '~') {
          workPath = path.resolve(fileObject.filePath, fileObject.cmdPath);
        }
      }
      /**
       * 计算环境变量
       */
      if (this.config.environment) {
        let variableContext = {
          file: fileObject.file,
          fileName: fileObject.fileName,
          basePath: basePath,
          relativePath: path.relative(basePath, fileObject.filePath),
          variable: this.config.variable
        }
        environment = Object.assign({}, process.env);
        for (let key in this.config.environment) {
          let value = [].concat(this.config.environment[key]);
          value = value.map((item) => {
            return this.replaceVariable(item, variableContext);
          });
          let envValue = value.join(path.delimiter);
          // 如果是以:开头的，则使用追加模式
          if (key.charAt(0) == ':') {
            let realKey = key.substr(1)
            environment[realKey] = envValue + path.delimiter + environment[realKey];
          }
          // 否则替换
          else {
            environment[key] = envValue;
          }
        }
      }
      /**
       * 执行命令的回调
       */
      let execCallback: any = function (err, stdo, stde) {
        if (err == null && !stde) {
          console.log("compiled "+(fileName || originFileName));
          if (reload && fileName) {
            reload(fileName);
          }
        } else {
          console.error(err || stde);
        }
      }
      /**
       * 执行命令
       */
      let execCmd: any = function () {
        let currCmd: string = command[++cmdIndex];
        if (command.length <= cmdIndex + 1) {
          cmdIndex = -1;
        }
        if (currCmd) {
          console.log("exec command:" + currCmd);
          let execOptions: any = {};
          if (workPath) {
            execOptions.cwd = workPath
          }
          if (environment) {
            execOptions.env = environment
          }
          if (workPath || environment) {
            exec(currCmd, execOptions, execCallback);
          }
          else {
            exec(currCmd, execCallback);
          }
        }
      }
      execCmd();
    }
    /* 编译回调 */
    compileCallback(file: string): void {
      if (file == this.configFile) {
        if (configUtil.testConfig(file)) {
          this.reloadWatch();
        }
      }
      else {
        if (this.checkIgnore(file) != true) {
          return;
        }
        this.compileTask(file, this.browserSync && this.config.browserSync.reload ? this.browserSync.reload : null);
      }
    }
}
export default new Watch();
