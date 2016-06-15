import { configStructure } from './declare/config';
import Watch from './lib/watch';

class Autocommand {
  constructor(private _watch: Watch = new Watch()) {}
  
  public static create(): any {
    return new Autocommand();
  }

  public watch(config:configStructure): any {
    this._watch.callModel(config).startWatch();
    return this;
  }

  public run(config:configStructure): any {
    this._watch.callModel(config).runCommand();
    return this;
  }
}

module.exports = Autocommand;