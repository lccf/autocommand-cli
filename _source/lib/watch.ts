/// <reference path="../declare/index.d.ts" />

import * as path from 'path';
import { exec } from 'child_process';
import * as chokidar from 'chokidar';
import * as glob from 'glob';
import * as ignore from 'ignore';

import { configStructure } from '../declare/config'
import fileManage from './fileManage';
import configUtil from './configUtil';
import AutocommandBase from './AutocommandBase';

export default class Watch extends AutocommandBase {
    config: configStructure;
    configFile: string;
    basePath: string;
    browserSync: any;
    watcher: any;

    debugInfo(info: any): void {
      if (this.config.debug) {
        console.log(info);
      }
    }

    callModel(config: configStructure): any {
      this.config = config;
      this.basePath = process.cwd();
      return this;
    }

    compile(match: any, options: any): void {
      let fileParam = [];
      // options 传参
      if (!options) {
        options = match;
      }
      // 取多个参
      if (options.file) {
        let rawArgs = options.parent.rawArgs;
        for(let i: number = rawArgs.length; i> 0; i--) {
          let arg = rawArgs[i-1];
          if (arg.indexOf('-') < 0) {
            fileParam.unshift(arg);
          }
          else {
            break;
          }
        }
        this.run({compileWithFile: fileParam});
      }
      // compile by stdout
      else if (options.stdout) {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');  
        process.stdin.on('data', function(data) {
          let files = data.toString().replace(/^\s|\s$/g, '').split("\n");
          fileParam = fileParam.concat(files);
        }).on('end', function() {
          if (fileParam.length) {
            this.run({compileWithFile: fileParam});
          }
          else {
            console.error('not file in stdin');
          }
        }.bind(this));
      }
      else {
        this.run({compile: true});
      }
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
        else if (options.compileWithFile) {
          this.runCommand(options.compileWithFile);
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
    runCommand(files: Array<string> = []): void {
      // 如果未指定文件类型则从配置文件中取
      if (!files.length) {
        let config = this.config;
        if (config.file || config.file.length) {
          for(let file of config.file) {
            file = file.replace(/\\/g, '/');
            files.push(path.resolve(this.basePath, file));
          }
        }
      }
      
      let fileList: Array<string> = [];

      for (let item of files) {
        let file = glob.sync(item);
        fileList = fileList.concat(file);
      }
      if (!fileList.length) {
        console.error('file not find');
        return;
      }
      fileList = this.checkIgnore(fileList);
      if (!fileList) {
        console.error('file ignore');
        return;
      }
      console.log('find files:\n'+fileList.join('\n'));
      fileList.map(this.compileCallback.bind(this));
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
        if (this.configFile) {
          // 命令行模式没有配置文件
          watchFile.push(this.configFile);
        }
        if (config.browserSync) {
          if (!this.browserSync) {
            this.browserSync = config.browserSync.plugin.create();
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
        console.error('config parse error');
      }
    }
    /* 检测忽略 */
    checkIgnore(file: string|Array<string>): any {
      let result: any = [].concat(file);
      let ignoreRules: Array<any> = [].concat(this.config.ignore);
      // 筛选字符串过滤规则
      let stringIgnoreRules = ignoreRules.filter((item) => typeof item == 'string' ? true : false);
      if (stringIgnoreRules && stringIgnoreRules.length) {
        let ig = ignore().add(stringIgnoreRules);
        result = ig.filter(file);
      }
      // 筛选函数过滤规则
      let functionIgnoreRules = ignoreRules.filter((item) => typeof item == 'function' ? true: false);
      if (functionIgnoreRules && functionIgnoreRules.length) {
        for (let rule of functionIgnoreRules) {
          result = result.filter(rule);
        }
      }
      // 筛选正则表达式过滤规则
      let regexpIgnoreRules = ignoreRules.filter((item) => typeof item == 'object' && item.constructor == RegExp ? true : false);
      if (regexpIgnoreRules && regexpIgnoreRules.length) {
        for (let rule of regexpIgnoreRules) {
          result = result.filter((item) => item.match(rule) == null);
        }
      }
      if (result && result.length) {
        return result;
      }
    }
    /* 编译任务 */
    compileTask(file: string, reload: any): void {
      let fileObject = fileManage.getFile(file, this.config, this.basePath);
      let {command, relativeFile, stdout, stderr} = fileObject;
      let compileFile: string = fileObject.file;
      let workPath: string = '';
      let basePath: string = this.basePath;
      let environment: any = null;
      var cmdIndex: number = -1;
      if (!(command && command.length)) {
        console.log('command not define! file:'+file);
        return;
      }
      if (fileObject.cmdPath) {
        workPath = fileObject.cmdPath;
        console.log('workPath:'+workPath);
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
          definePath: fileObject.definePath,
          defineRelativePath: fileObject.defineRelativePath,
          variable: this.config.variable
        }
        environment = Object.assign({}, process.env);
        for (let key in this.config.environment) {
          let value: any = [].concat(this.config.environment[key]);
          value = value.map((item) => {
            return this.replaceVariable(item, variableContext);
          });
          value = value.join(path.delimiter);
          // 如果是以:开头的，则使用追加模式
          if (key.charAt(0) == ':') {
            let realKey = key.substr(1)
            environment[realKey] = value + path.delimiter + environment[realKey];
          }
          // 否则替换
          else {
            environment[key] = value;
          }
        }
      }
      let checkBehavior: any = function(rules, content) {
        let ret = false;
        for (let rule of rules) {
          if (rule.match.match(/^\/.*\/$/) != null) {
            if (content.match(rule.match.replace(/^\/|\/$/g, '')) != null) {
              ret = true;
              console.log(rule.message);
              break;
            }
          }
          else if (rule.match == content){
            ret = true;
            console.log(rule.message);
            break;
          }
        }
        return ret;
      }
      /**
       * 执行命令的回调
       */
      let execCallback: any = function (err, stdo, stde) {
        // 是否继续执行
        let next = true;

        if (err == null && !stde) {
          if (stdout && checkBehavior(stdout, stdo)) {
            next = false;
          }
        } else {
          next = false;
          if (stderr && checkBehavior(stderr, stde)) {
            next = true;
          }
          else {
            console.error(err || stde);
          }
        }
        if (next) {
          if (cmdIndex != -1) {
            execCmd();
          } else {
            console.log("compiled "+(compileFile || relativeFile));
            if (reload && compileFile) {
              reload(compileFile);
            }
          }
        }
      }

      let debugInfo = this.debugInfo.bind(this);
      /**
       * 执行命令
       */
      let execCmd: any = function () {
        let currCmd: string = command[++cmdIndex];
        if (command.length <= cmdIndex + 1) {
          cmdIndex = -1;
        }
        if (currCmd) {
          debugInfo("exec command:" + currCmd);
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
        if (!this.checkIgnore(file)) {
          return;
        }
        this.compileTask(file, this.browserSync && this.config.browserSync.reload ? this.browserSync.reload : null);
      }
    }
}