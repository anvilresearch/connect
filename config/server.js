/**
 * Configuration dependencies
 */

var cwd          = process.cwd()
  , env          = process.env.NODE_ENV || 'development'
  , fs           = require('fs')
  , path         = require('path')
  , config       = require(path.join(cwd, 'config.' + env + '.json'))
  , client       = require('./redis')(config.redis)
  , express      = require('express')
  , passport     = require('passport')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')
  , RedisStore   = require('connect-redis')(session)
  , sessionStore = new RedisStore({ client: client })
  , cors         = require('cors')
  ;


/**
 * Exports
 */

module.exports = function (server) {

  // Disable default header
  server.disable('x-powered-by');

  // default settings
  server.set('port', process.env.PORT || config.port || 3000);
  server.engine('.jade', require('jade').__express);
  server.set('views', path.join(cwd, 'views'));
  server.set('view engine', 'jade');
  server.set('client_registration', 'scoped');
  server.set('trusted_registration_scope', 'realm');

  // config file settings
  Object.keys(config).forEach(function (key) {
    server.set(key, config[key]);
  });

  // config key pair
  try {
    var privateKey, publicKey;
    privateKey = fs.readFileSync(config.keypair.private).toString('ascii');
    publicKey  = fs.readFileSync(config.keypair.public).toString('ascii');
    server.set('privateKey', privateKey);
    server.set('publicKey', publicKey);
  } catch (err) {
    console.log('Cannot load keypair');
    process.exit(1);
  }

  // request parsing
  server.use(cookieParser('secret'));
  server.use(bodyParser());

  // express session
  server.use(session({
    store: sessionStore,
    secret: 'asdf'
  }));

  // passport authentication middleware
  server.use(passport.initialize());
  server.use(passport.session());

  // cross-origin support
  server.use(cors());
};
