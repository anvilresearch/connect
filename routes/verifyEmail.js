/**
 * Module dependencies
 */

var settings = require('../boot/settings')
  , User     = require('../models/User')
  , oidc     = require('../oidc')
  , url      = require('url')
  ;


/**
 * E-mail Verification Endpoint
 */

module.exports = function (server) {
  server.get('/email/verify', [
    oidc.selectConnectParams,
    oidc.verifyRedirectURI,
    function(req, res, next) {

      User.getByEmailVerifyToken(req.query.token, function(err, user) {
        if (err) {
          return next(err);
        }

        if (!user) {

          res.render('verifyEmail', {
            error: 'Invalid or expired verification code.'
          });

        } else {

          User.patch(user._id, {

            dateEmailVerified: Date.now(),
            emailVerified: true

          }, {

            $unset: [ 'emailVerifyToken' ]

          }, function (err, patchedUser) {

            if (err) { return next(err); }
            if (!patchedUser) { return next(new Error('Unable to patch user')); }

            var params = { signin: null };

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

        }
      });
    }
  ]);
};

