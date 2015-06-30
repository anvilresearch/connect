/**
 * Module dependencies
 */

var passport       = require('passport')
  , Strategy 	   = require('passport-openid').Strategy
  , util               = require('util')
  , User           = require('../../models/User')
  ;

/**
 * OpenIDStrategy
 *
 * Provider is an object defining the details of the authentication API.
 * Client is an object containing provider registration info and options.
 * Verify is the Passport callback to invoke after authenticating
 */

function OpenIDStrategy (provider, verify) {
  this.provider   = provider;
  this.name       = provider.id;
  if (! provider.returnURL) {
      provider.returnURL = provider.callbackURL;
  }
  Strategy.call(this, provider, verify);
  this.client     = provider;
  this.verify     = verify;
}

util.inherits(OpenIDStrategy, Strategy);

/**
 * Verifier
 */

function verifier (req, identifier, userInfo, done) {
  // Raw OpenID Provider response should be stored
  // for consistency with other protocols.
  var auth = {
    id: req.query['openid.identity'],
    req_query:  req.query
  };

  userInfo.id         = req.query['openid.identity'];
  userInfo.name       = req.query['openid.ext2.value.fullname'];
  userInfo.givenName  = req.query['openid.ext2.value.firstname'];
  userInfo.familyName = req.query['openid.ext2.value.lastname'];
  userInfo.email      = req.query['openid.ext2.value.email'];

  User.connect(req, auth, userInfo, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
};

OpenIDStrategy.verifier = verifier;


/**
 * Initialize - note provider === configuration
 */

function initialize (provider, configuration) {
  configuration.profile           = true;
  configuration.passReqToCallback = true;

  return new OpenIDStrategy(configuration, verifier);
}

OpenIDStrategy.initialize = initialize;


/**
 * Exports
 */

module.exports = OpenIDStrategy;
