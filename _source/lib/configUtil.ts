/// <reference path="../../typings/main" />
import fs = require('fs');
import {configStructure} from "../declare/config";

class configUtil {
  public static defaultConfig = '_config';
  private static _instance: any = {};
  /**
   * 获取配置文件
   * @param configFile {string} 配置文件名
   * @param force {boolean} 是否强制更新，默认仅首次读取
   */
  public static getConfig(configFile: string, force: boolean = false): JSON {
    let config: any = null;
    if (!configUtil._instance[configFile] || force) {
      config = configUtil._instance[configFile] = configUtil.read(configFile);
    }
    else {
      config = configUtil._instance[configFile];
    }
    return config;
  }

  /**
   * 读取配置文件
   * @param configFile {string} 配置文件名
   */
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
        console.error(e.stack);
        throw new Error("parse config error");
      }
    }
    else {
      throw new Error("config file not found");
    }
  }
  private static initConfig(options): any {
    let configContent: string = '{\n  // 侦听的文件\n  "watchFile": ["*.jade", "*.sass", "*.ts"],\n  // 过滤\n  "ignore": ["^_", ".d.ts$"],\n  // 变量\n  "variable": { },\n  // 定义\n  "define": {\n    "jade/": {\n      // ~代表baseDir\n      // .代表当前\n      "path": "~",\n      ".jade": {\n        "command": [\n          "jade -Po ../ jade/#{fileName}.jade"\n        ]\n      }\n    },\n    ".sass": {\n      "file": "#{fileName}.css",\n      "command": "sass #{file} #{fileName}.css"\n    },\n    ".ls": {\n      "command": [\n        "lsc -cbp live/#{fileName}.ls>../js/#{fileName}.js"\n      ]\n    }\n  }\n}';
    let fileName = configUtil.defaultConfig
    if (options.config) {
      fileName = options.config;
    }
    try {
      fs.writeFileSync(fileName, configContent);
    }
    catch (e) {
      console.error('failure error:');
      console.error(e.stack);
    }
  }
  public static testConfig(configPath: string): boolean {
    let fileName = '_config';
    if (configPath) {
      fileName = configPath;
    }
    try {
      let config: configStructure = this.read(fileName);
      return config ? true : false;
    }
    catch (e) {
      return false;
    }
  }
  public static testAction(configPath: string): void {
    try {
      let result: boolean = this.read(configPath);
      if (result) {
        console.log('success');
      }
      else {
        console.log('error');
      }
    }
    catch(e) {
      console.error(e.message);
    }
  }
  public static action(options): any {
    if (options.init) {
      this.initConfig(options);
    }
    else if (options.test) {
      this.testAction(options.config || configUtil.defaultConfig);
    }
  }
}

module.exports = configUtil;
