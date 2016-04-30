var program = require('commander');
var pkg = require('../package.json');
var watchAction = require('./watch.js');
var configUtil = require('./configUtil');
module.exports = function (args) {
    program.version(pkg.version);
    program.command('watch', '')
        .description('watch file change run command')
        .option('-c, --config [config]', 'config file')
        .option('-t, --test [testFile]', 'test mode')
        .action(watchAction.run.bind(watchAction));
    program.command('config', '')
        .description('create and test config file')
        .option('-i, --init', 'create config file')
        .option('-t, --test', 'test config file')
        .action(configUtil.action.bind(configUtil));
    program.command('run', '')
        .description('run command by config')
        .action(watchAction.compile.bind(watchAction));
    program.parse(args);
    if (!process.argv.slice(2).length) {
        program.help();
    }
};
