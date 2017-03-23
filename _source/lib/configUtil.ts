/// <reference path="../declare/index.d.ts" />
import * as fs from 'fs';

import { configStructure } from '../declare/config';

export default class configUtil {
  public static defaultConfig = 'acmd.config.js';
  private static _instance: any = {};
  /**
   * 获取配置文件
   * @param configFile {string} 配置文件名
   * @param force {boolean} 是否强制更新，默认仅首次读取
   */
  public static getConfig(configFile: string, force: boolean = false): configStructure {
    let config: any = null;
    if (!configUtil._instance[configFile] || force) {
      config = configUtil._instance[configFile] = require(configFile);
    }
    else {
      config = configUtil._instance[configFile];
    }
    return config;
  }

  private static initConfig(options): any {
    let configContent: string = `{
  // 侦听的文件
  "file": ["**/*.{jade,sass,ls}"],
  // 过滤
  "ignore": ["_*.*", "node_modules/"],
  // 变量
  "variable": {
    "localBin": "~/node_modules/.bin"
  },
  // 环境变量
  // 以:打头表示追加
  "environment": {
    ":PATH": "#{localBin}"
  },
  // 定义
  // #{file} 表示当前文件
  // #{fileName} 表示当前文件名(不包含扩展名)
  // #{basePath} 当前命令的工作路径
  // #{relativePath 当前文件相对于项目根目录的路径
  // #{defilePath 针对当前文件的定义路径
  // #{relativeFile 相对于当前工作路径的文件名，含路径
  // #{defineRelativePath 文件相路径相对于定义命令目录的路径
  // #{[variableKey]} variable中定自定义的变量
  "define": {
    ".jade": {
      "file": "#{relativePath}/#{fileName}.html",
      "command": "pug -Po . #{file}"
    },
    ".sass": {
      "file": "#{relativePath}/#{fileName}.css",
      "command": "node-sass --output-style compact #{file} ./#{fileName}.css",
      "behavior": {
        "stderr": [
          {
            "match": "/Rendering Complete/",
            "message": "reject sass error"
          }
        ]
      }
    },
    ".ls": {
      "file": "#{relativePath}/#{fileName}.js",
      "command": "lsc -cbp #{file}>./#{fileName}.js"
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
    let fileName = configUtil.defaultConfig;
    if (configPath) {
      fileName = configPath;
    }
    try {
      let config: configStructure = require(fileName);
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
    // else if (options.test) {
    //   if (options.test !== true) {
    //     this.testAction(options.test);
    //   }
    //   else {
    //     this.testAction(configUtil.defaultConfig);
    //   }
    // }
  }
}
