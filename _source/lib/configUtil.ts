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
    console.log(options);
  }
  public static action(action, options): any {
    if (action == 'init') {
      this.initConfig(options);
    }
  }
}

module.exports = configUtil;
