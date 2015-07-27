/**
 * Module dependencies
 */

var AuthorizationError = require('../errors/AuthorizationError');


/**
 * Send verification email middleware
 */

function sendVerificationEmail(req, res, next) {
  if (!req.provider || !req.provider.emailVerification.enable) {
    next();
  } else {
    var params = {
      redirect_uri: req.connectParams.redirect_uri,
      client_id: req.connectParams.client_id,
      response_type: req.connectParams.response_type,
      scope: req.connectParams.scope
    };
    req.user.sendVerificationEmail(params, function (err, responseStatus) {
      next(err);
    });
  }
}

module.exports = sendVerificationEmail;
