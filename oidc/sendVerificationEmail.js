/**
 * Module dependencies
 */
var url = require('url')
  , mailer = require('../boot/mailer')
  , settings = require('../boot/settings')
  , OneTimeToken = require('../models/OneTimeToken')
  ;


/**
 * Requested
 */

function requested (req) {
  return req.provider
      && req.provider.emailVerification.enable
      && req.sendVerificationEmail
      ;
}


/**
 * Send verification email middleware
 */

function sendVerificationEmail(req, res, next) {

  // skip if we don't need to send the email
  if (!requested(req)) {
    next();
  }

  // send the email
  else {
    var user = req.user;

    var params = {
      redirect_uri:  req.connectParams.redirect_uri,
      client_id:     req.connectParams.client_id,
      response_type: req.connectParams.response_type,
      scope:         req.connectParams.scope
    };

    OneTimeToken.issue({
      ttl: 3600 * 24 * 7,
      sub: user._id,
      use: 'emailVerification'
    }, function (err, token) {
      if (err) { return next(err); }

      // build email link
      var verifyURL = url.parse(settings.issuer);
      verifyURL.pathname = 'email/verify';
      verifyURL.query = { token: token._id };

      // email template data
      var locals = {
        email: user.email,
        name: {
          first: user.givenName,
          last: user.familyName
        },
        verifyURL: url.format(verifyURL)
      };

      // Send verification email
      mailer.sendMail('verifyEmail', locals, {
        to: user.email,
        subject: 'Verify your e-mail address'
      }, function(err, responseStatus) {
        // TODO: REQUIRES REFACTOR TO MAIL QUEUE
        next();
      });
    });
  }
}


/**
 * Export
 */

module.exports = sendVerificationEmail;
