var configUtil = require('./configUtil.js');
var main = {
  run: function () {
    var config = configUtil.read();
  }
}
module.exports = main;
