/// <reference path="../../typings/main" />
import fs = require('fs');

class configUtil {
    read(config:string) {
        let result: JSON = null;
        if (!config.length) {
            config = '_config';
        }
        if (fs.existsSync(config)) {
            let configContent:any = fs.readFileSync(config);
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
}

module.exports = new configUtil();