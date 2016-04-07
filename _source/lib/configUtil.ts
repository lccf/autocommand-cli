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
    let configContent: string = "{ \n"+
      "   // 侦听的文件 \n"+
      "   \"watchFile\": [\"*.sass\", \"*.scss\", \"*.ts\", \"*.sass\"], \n"+
      "   // 过滤 \n"+
      "   \"ignore\": [\"^_\", \".d.ts$\"], \n"+
      "   // 变量 \n"+
      "   \"variable\": { }, \n"+
      "   // 定义 \n"+
      "   \"define\": { \n"+
      "     \"jade/\": { \n"+
      "       // ~代表baseDir \n"+
      "       // .代表当前 \n"+
      "       \"path\": \"~\", \n"+
      "       \".jade\": { \n"+
      "         \"command\": [ \n"+
      "           \"jade -Po ../ jade/#{$fileName}.jade\" \n"+
      "         ] \n"+
      "       } \n"+
      "     }, \n"+
      "     \".sass\": { \n"+
      "       \"file\": \"#{$fileName}.css\", \n"+
      "       \"command\": \"sass #{$file} #{$fileName}.css\" \n"+
      "     }, \n"+
      "     \".ls\": { \n"+
      "       \"command\": [ \n"+
      "         \"lsc -cbp live/#{$fileName}.ls>../js/#{$fileName}.js\" \n"+
      "          /* , \"cp -fp ../js/#{$fileName}.js ../../../statics/web/africa/js\" */ \n"+
      "       ] \n"+
      "     } \n"+
      "   } \n"+
      " } \n";

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
