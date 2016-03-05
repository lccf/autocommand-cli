var fs = require('fs');
var main = {
  read: function(config) {
    var result = '';
    if (!config) {
      config = '_config';
    }
    if (fs.existsSync(config)) {
      configContent = fs.readFileSync(config);
      try {
        result = JSON.parse(configContent);
        return result;
      }
      catch(e) {
        console.log('config format error');
      }
    }
    else {
      console.log('config file not found');
    }
  }
}

module.exports = main;
