/// <reference path="../typings/main"/>

import {configStructure} from './declare/config'

class Autocommand {
  public static create(): any {
  }

  public watch(config:configStructure): any {
    this.config = config;
    this.startWatch();
    return this;
  }

  public run(config:configStructure): any {
    return this;
  }
}

module.exports = Autocommand;
