/**
 * Module dependencies
 */

var passport       = require('passport')
  , OpenIDStrategy = require('passport-openid')
  , User           = require('../../models/User')
  ;


/**
 * Verifier
 */

function verifier (req, identifier, userInfo, done) {
  // Raw OpenID Provider response should be stored
  // for consistency with other protocols.
  var auth = {
    // identifier?
    // req.query?
  };

  userInfo.id         = request.query['openid.identity'];
  userInfo.name       = request.query['openid.ext2.value.fullname'];
  userInfo.givenName  = request.query['openid.ext2.value.firstname'];
  userInfo.familyName = request.query['openid.ext2.value.lastname'];
  userInfo.email      = request.query['openid.ext2.value.email'];

  User.connect(req, auth, userInfo, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
};

OpenIDStrategy.verifier = verifier;


/**
 * Initialize
 */

function initialize (provider, configuration) {
  // provider may be null with this strategy?
  // possibly merge with configuration if it's
  // an object?

  configuration.profile           = true;
  configuration.passReqToCallback = true;

  return new OpenIDStrategy(configuration, verifier);
}

OpenIDStrategy.initialize = initialize;


/**
 * Exports
 */

module.exports = OpenIDStrategy;
