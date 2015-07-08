/**
 * Configuration dependencies
 */

var cwd          = process.cwd()
  , path         = require('path')
  , settings     = require('./settings')
  , client       = require('./redis')(settings.redis)
  , logger       = require('./logger')(settings.logger)
  , express      = require('express')
  , passport     = require('passport')
  , cons         = require('consolidate')
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

  /**
   * Disable default header
   */

  server.disable('x-powered-by');


  /**
   * Views configuration
   */

  var engine = settings.view_engine || 'jade';
  server.engine(engine,       cons[engine]);
  server.set('views',         path.join(cwd, 'views'));
  server.set('view engine',  engine);


  /**
   * Settings
   */

  Object.keys(settings).forEach(function (key) {
    server.set(key, settings[key]);
  });


  /**
   * Request Parsing
   */

  server.use(cookieParser(settings.cookie_secret));
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());


  /**
   * Express Session
   */

  if (process.env.NODE_ENV === 'production') {
    server.use(session({
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      secret: settings.session_secret,
      proxy: true,
      cookie: {
        secure: true
      }
    }));
  } else {
    server.use(session({
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      secret: settings.session_secret
    }));
  }


  /**
   * Passport Authentication Middleware
   */

  server.use(passport.initialize());
  server.use(passport.session());


  /**
   * Cross-Origin Support
   */

  server.use(cors());


  /**
   * Logging
   */

  server.use(logger.middleware());


  /**
   * Serve Static Files
   */

  server.use(express.static(path.join(cwd, 'public')));


  /**
   * OpenID Provider Metadata Properties
   */

  var parameters = [
    'issuer',
    'authorization_endpoint',
    'token_endpoint',
    'userinfo_endpoint',
    'jwks_uri',
    'registration_endpoint',
    'scopes_supported',
    'response_types_supported',
    'response_modes_supported',
    'grant_types_supported',
    'acr_values_supported',
    'subject_types_supported',
    'id_token_signing_alg_values_supported',
    'id_token_encryption_alg_values_supported',
    'id_token_encryption_enc_values_supported',
    'userinfo_signing_alg_values_supported',
    'userinfo_encryption_alg_values_supported',
    'userinfo_encryption_enc_values_supported',
    'request_object_signing_alg_values_supported',
    'request_object_encryption_alg_values_supported',
    'request_object_encryption_enc_values_supported',
    'token_endpoint_auth_methods_supported',
    'token_endpoint_auth_signing_alg_values_supported',
    'display_values_supported',
    'claim_types_supported',
    'claims_supported',
    'service_documentation',
    'claims_locales_supported',
    'ui_locales_supported',
    'claims_parameter_supported',
    'request_parameter_supported',
    'request_uri_parameter_supported',
    'require_request_uri_registration',
    'op_policy_uri',
    'op_tos_uri',
    'check_session_iframe',
    'end_session_endpoint'
  ];


  /**
   * Build Provider Configuration Info from Metadata
   */

  server.OpenIDConfiguration = parameters.reduce(function (config, param) {
    var value = settings[param];
    if (value) { config[param] = value; }
    return config;
  }, {});

};
