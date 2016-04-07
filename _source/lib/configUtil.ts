/// <reference path="../../typings/main" />
import fs = require('fs');

class configUtil {
  private static _instance: Array<any> = [];
  public static getConfig(configFile: string): JSON {
    let config: any = null;
    if (!configUtil._instance[configFile]) {
      config = configUtil.read(configFile);
    }
    else {
      config = configUtil._instance[configFile];
    }
    return config;
  }
  public static read(configFile: string): any {
    let result: any = null;
    if (!configFile.length) {
      configFile = '_config';
    }
    if (fs.existsSync(configFile)) {
      let configContent: string = fs.readFileSync(configFile, 'utf-8');
      configContent = configContent.replace(/\s*\/\/.*/g, '').replace(/\s*\/\*.*\*\//g, '');
      try {
        result = JSON.parse(configContent);
        return result;
      }
      catch(e) {
        console.log('parse config error');
      }
      finally {}
    }
    else {
      console.log('config file not found');
    }
  }
  private static initConfig(options): any {
    let configContent: string = ' { '+
      '   // 侦听的文件 '+
      '   "watchFile": ["*.sass", "*.scss", "*.ts", "*.sass"], '+
      '   // 过滤 '+
      '   "ignore": ["^_", ".d.ts$"], '+
      '   // 变量 '+
      '   "variable": { }, '+
      '   // 定义 '+
      '   "define": { '+
      '     "jade/": { '+
      '       // ~代表baseDir '+
      '       // .代表当前 '+
      '       "path": "~", '+
      '       ".jade": { '+
      '         "command": [ '+
      '           "jade -Po ../ jade/#{$fileName}.jade" '+
      '         ] '+
      '       } '+
      '     }, '+
      '     ".sass": { '+
      '       "file": "#{$fileName}.css", '+
      '       "command": "sass #{$file} #{$fileName}.css" '+
      '     }, '+
      '     ".ls": { '+
      '       "command": [ '+
      '         "lsc -cbp live/#{$fileName}.ls>../js/#{$fileName}.js" '+
      '          /* , "cp -fp ../js/#{$fileName}.js ../../../statics/web/africa/js" */ '+
      '       ] '+
      '     } '+
      '   } '+
      ' } ';
    let fileName = '_config';
    if (options.file) {
      fileName = options.file;
    }
    try {
      fs.writeFileSync(fileName, configContent);
    }
    catch (e) {
      console.log('failure error:');
      console.log(e);
    }
  }
  public static action(action, options): any {
    if (action == 'init') {
      this.initConfig(options);
    }
  }
}

module.exports = configUtil;
