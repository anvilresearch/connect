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
  // environment
  .alias('e', 'environment')
  .describe('e', 'Set environment')
  // client (apply the operation to a client instead of a user)
  .boolean('c')
  ;


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
 * Symbol table
 */

cli.symbols = {
  // commands and subcommands
  init:       { type: 'command' },
  migrate:    { type: 'command' },
  deployment: { type: 'subcommand' },
  db:         { type: 'subcommand' },
  assign:     { type: 'command' },
  revoke:     { type: 'command' },
  permit:     { type: 'command' },
  forbid:     { type: 'command' },
  config:     { type: 'command' },
  copy:       { type: 'command' },
  signup:     { type: 'command' },
  uri:        { type: 'command' },
  serve:      { type: 'command' },
  token:      { type: 'command' },

  // models
  role:   { type: 'model', value: 'Role'   },
  scope:  { type: 'model', value: 'Scope'  },
  client: { type: 'model', value: 'Client' },
  user:   { type: 'model', value: 'User'   },

  // methods
  ls:     { type: 'method', value: 'list'   },
  get:    { type: 'method', value: 'get'    },
  add:    { type: 'method', value: 'insert' },
  update: { type: 'method', value: 'patch'  },
  rm:     { type: 'method', value: 'delete' },
};


/**
 * Command Parser
 */

cli.parse = function parse (tokens, options) {
  var tokens  = [].concat(tokens) // copy this and leave argv intact
    , command = {}
    , token
    , symbol
    ;

  // consume the tokens
  while (tokens.length > 0) {
    token = tokens.shift();
    symbol = cli.symbols[token];

    // the token has a symbol
    if (symbol) {
      switch (symbol.type) {
        case 'command':
          command.name = token;
          break;

        case 'subcommand':
          if (!command.name) { throw new Error('Unknown command'); }
          command.name += '-' + token;
          break;

        case 'model':
          command.model = symbol.value;
          break;

        case 'method':
          command.method = symbol.value;
          break;

        default:
          throw new Error('Unrecognized symbol type');
      }
    }

    // the token is a parameter
    else if (!command.name) {
      // parse json into "data"
      if (token.indexOf('{') !== -1) {
        try {
          command.data = JSON.parse(token);
        } catch (e) {
          console.log(e);
          process.exit();
        }
      }

      // treat the value as an identifier
      else {
        command.identifier = token;
      }
    }
  }

  return command;
}


/**
 * Execute
 */

cli.exec = function exec (command, argv, done) {
  var cmd         = command.name
    , model       = command.model
    , method      = command.method
    , identifier  = command.identifier
    , data        = command.data
    ;

  if (!cmd && !model) { throw new Error('Cannot execute'); }

  // execute a simple command (and exit)
  if (cmd) {
    return require(path.join(__dirname, cmd))(argv);
  }

  // use email for identifier
  if (model === 'User' && identifier && identifier.indexOf('@') !== -1) {
    require(path.join(__dirname, '..', '..', 'models', model))
      .getByEmail(identifier, function (err, user) {
        command.identifier = user._id;
        exec(command, argv, done);
      });
  }

  // invoke a model method
  else if (!cmd) {
    if (!method) { throw new Error('Unknown method'); }

    var server = require(path.join(__dirname, '..', '..', 'server'));
    model = path.join(__dirname, '..', '..', 'models', model);

    if (model && method && identifier && data) {
      return require(model)[method](identifier, data, done);
    }

    if (model && method && identifier) {
      return require(model)[method](identifier, done);
    }

    if (model && method && data) {
      return require(model)[method](data, done);
    }

    if (model && method) {
      return require(model)[method](done);
    }

    else {
      done();
    }
  }
}


/**
 * Run
 */

cli.run = function () {
  var argv    = yargs.argv
    , env     = argv.e || argv.environment
    , tokens  = [].concat(argv._)
    , command = cli.parse(tokens)
    ;

  if (argv.v || argv.version || command.name === 'version') {
    cli.version();
  }

  if (!command || argv.h || argv.help || command.name === 'help') {
    cli.help();
  }

  if (env && ['development', 'production'].indexOf(env) !== -1) {
    process.env.NODE_ENV = env;
  }

  if (argv.production) {
    process.env.NODE_ENV = 'production';
  }

  try {
    cli.exec(command, argv, function (err, result) {
      if (err) { throw err; }
      console.log(result);
      process.exit();
    });
  } catch (e) {
    console.log(e.stack)
    cli.help();
  }
}
