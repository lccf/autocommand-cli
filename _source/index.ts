/// <reference path="../typings/main"/>

import configStructure from './declare/config'
import watchAction from './lib/watch'

class Autocommand {
  public static create(): any {
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
