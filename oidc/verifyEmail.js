/**
 * Module dependencies
 */

var settings     = require('../boot/settings')
  , User         = require('../models/User')
  , OneTimeToken = require('../models/OneTimeToken')
  , url          = require('url')
  ;


/**
 * Verify Email
 *
 * verifyEmail is a route handler that takes an email
 * verification request and matches a token parameter
 * to a OneTimeToken. Assuming there is a valid OneTimeToken
 * instance matching the token, it updates the user's
 * emailVerified claim to true along with a timestamp.
 *
 * This handler requires oidc.selectConnectParams and
 * oidc.verifyRedirectURI middleware upstream.
 */

function verifyEmail (req, res, next) {
  // ensure there's a token in the request params
  if (!req.query.token) {
    return res.render('verifyEmail', {
      error: 'Missing verification code.'
    });
  }

  // consume the token
  OneTimeToken.consume(req.query.token, function (err, token) {
    if (err) { return next(err); }

    // Invalid or expired token
    if (!token || token.use !== 'emailVerification') {
      return res.render('verifyEmail', {
        error: 'Invalid or expired verification code.'
      });
    }

    // Update the user
    User.patch(token.sub, {
      dateEmailVerified: Date.now(),
      emailVerified: true
    }, function (err, user) {
      if (err) { return next(err); }

      // unknown user
      if (!user) {
        return res.render('verifyEmail', {
          error: 'Unable to verify email for this user.'
        });
      }

      // default params
      var params = {
        signin: null
      };

      // check that the redirect uri is valid and safe to use
      if (req.client) {
        var continueURL = url.parse(settings.issuer);

        continueURL.pathname = 'signin';
        continueURL.query = {
          redirect_uri: req.connectParams.redirect_uri,
          client_id: req.connectParams.client_id,
          response_type: req.connectParams.response_type,
          scope: req.connectParams.scope
        };

        params.signin = {
          url: url.format(continueURL),
          client: req.client
        };
      }

      res.render('verifyEmail', params);
    });
  });
}


/**
 * Exports
 */

module.exports = verifyEmail;
