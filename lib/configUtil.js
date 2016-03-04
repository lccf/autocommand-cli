var fs = require('fs');
var main = {
  read: function(config) {
    if (!config) {
      config = '_config';
    }
    if (fs.existsSync(config)) {
      configContent = fs.readFileSync(config);
      console.log(configContent);
    }
    else {
      console.log('config file not found');
    }
  }
}

module.exports = main;
