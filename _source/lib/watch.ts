/// <reference path="../../typings/main" />
let configUtil:any = require('./configUtil.js');

class Watch {
    run(): void {
        let config = configUtil.read();
    }
}

module.exports = new Watch();