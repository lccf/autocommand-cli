/// <reference path="../../typings/index.d.ts" />
/// <reference path="../declare/main.d.ts" />

import fs = require('fs');
import hjson = require('hjson');
import { configStructure } from '../declare/config';

export default class configUtil {
  public static defaultConfig = '_config';
  private static _instance: any = {};
  /**
   * 获取配置文件
   * @param configFile {string} 配置文件名
   * @param force {boolean} 是否强制更新，默认仅首次读取
   */
  public static getConfig(configFile: string, force: boolean = false): configStructure {
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
  public static read(configFile: string): configStructure {
    let result: any = null;
    if (!configFile.length) {
      configFile = '_config';
    }
    try {
      fs.statSync(configFile);
      let configContent: string = fs.readFileSync(configFile, 'utf-8');
      try {
        result = hjson.parse(configContent);
        return result;
      }
      catch(e) {
        console.error(e.stack);
        throw new Error("parse config error");
      }
    }
    catch(e) {
      throw new Error("config file not found");
    }
  }
  private static initConfig(options): any {
    let configContent: string = `{
  // 侦听的文件
  "file": ["**/*.jade", "*.sass", "*.ls"],
  // 过滤
  "ignore": ["_*.*", "node_modules/"],
  // 变量
  "variable": {
    "localBin": "~/node_modules/.bin"
  },
  // 环境变量
  "environment": {
    ":PATH": "#{localBin}"
  },
  // 定义
  "define": {
    ".jade": {
      "file": "#{relativePath}/#{fileName}.html",
      "command": "pug -Po . #{file}"
    },
    ".sass": {
      "file": "#{relativePath}/#{fileName}.html",
      "command": "node-sass --output-style compact #{fileName}.sass ./#{fileName}.css"
    },
    ".ls": {
      "file": "#{relativePath}/#{fileName}.js",
      "command": "lsc -cbp ./#{fileName}.ls>./#{fileName}.js"
    },
    // 嵌套目录
    "jade/": {
      // ~代表baseDir
      // .代表当前
      "path": ".",
      ".jade": {
        "file": "#{relativePath}/#{fileName}.html",
        "command": "pug -Po . #{file}"
      }
    }
  },
  // browserSync配置
  "browserSync": {
    // 初始化配置
    "init": {
      "server": {
        "baseDir": "./"
      },
      "open": false,
      "ui": false
    },
    // 启动livereload
    "reload": true
  }
}
// vim: se sw=2 ts=2 sts=2 ft=javascript et:`
    let fileName = configUtil.defaultConfig
    if (options.init !== true) {
      fileName = options.init;
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
      let result: boolean = this.testConfig(configPath);
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
      if (options.test !== true) {
        this.testAction(options.test);
      }
      else {
        this.testAction(configUtil.defaultConfig);
      }
    }
  }
}
