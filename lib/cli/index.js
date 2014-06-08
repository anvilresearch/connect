/**
 * Module dependencies
 */

var cli       = module.exports
  , fs        = require('fs')
  , path      = require('path')
  , yargs     = require('yargs')
  , pkg       = require(path.join(__dirname, '../../package.json'))
  , usage     = fs.readFileSync(path.join(__dirname, 'docs/usage.txt'), 'utf8')
  ;


yargs
  .usage(usage)
  // version
  .alias('v', 'version')
  .describe('v', 'Show version')
  // help
  .alias('h', 'help')
  .describe('h', 'Show usage')
  ;


/**
 * Exec
 */

cli.exec = function (cmd, argv) {
  require(path.join(__dirname, './' + cmd))(argv);
  process.exit();
};


/**
 * Help
 */

cli.help = function () {
  yargs.showHelp(console.error);
  process.exit();
};


/**
 * Version
 */

cli.version = function () {
  console.log('Anvil Connect v%s', pkg.version);
  process.exit();
};


/**
 * Run
 */

cli.run = function () {
  var argv = yargs.argv
    , cmd  = argv._.shift()
    ;

  if (argv.v || argv.version || cmd === 'version') {
    cli.version();
  }

  if (!cmd || argv.h || argv.help || cmd === 'help') {
    cli.help();
  }

  if (['init'].indexOf(cmd) !== -1 && argv._.length > 0) {
    cmd += '-' + argv._.shift();
  }

  if (cmd) {
    try {
      cli.exec(cmd, argv);
    } catch (e) {
      cli.help();
    }
  }
}

