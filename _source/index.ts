/// <reference path="../typings/index.d.ts"/>

import { configStructure } from './declare/config'
import watchAction from './lib/watch'

class Autocommand {
  public static create(): any {
    return new Autocommand();
  }

  public watch(config:configStructure): any {
    watchAction.callModel(config).startWatch();
    return this;
  }

  public run(config:configStructure): any {
    watchAction.callModel(config).runCommand();
    return this;
  }
}

module.exports = Autocommand;