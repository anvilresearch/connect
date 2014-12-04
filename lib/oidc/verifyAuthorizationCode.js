/**
 * Module dependencies
 */

var AuthorizationCode  = require('../../models/AuthorizationCode')
  , AuthorizationError = require('../../errors/AuthorizationError')
  , nowSeconds         = require('../time-utils').nowSeconds
  ;


/**
 * Verify authorization code
 */

function verifyAuthorizationCode (req, res, next) {
  var params = req.connectParams;

  if (params.grant_type === 'authorization_code') {

    AuthorizationCode.getByCode(params.code, function (err, ac) {
      if (err) { return callback(err); }

      // Can't find authorization code
      if (!ac) {
        return next(new AuthorizationError({
          error: 'invalid_grant',
          error_description: 'Authorization not found',
          statusCode: 400
        }));
      }

      // Authorization code has been previously used
      if (ac.used === true) {
        return next(new AuthorizationError({
          error: 'invalid_grant',
          error_description: 'Authorization code invalid',
          statusCode: 400
        }));
      }

      // Authorization code is expired
      if (nowSeconds() > ac.expires_at) {
        return next(new AuthorizationError({
          error: 'invalid_grant',
          error_description: 'Authorization code expired',
          statusCode: 400
        }));
      }

      // Mismatching redirect uri
      if (ac.redirect_uri !== params.redirect_uri) {
        return next(new AuthorizationError({
          error: 'invalid_grant',
          error_description: 'Mismatching redirect uri',
          statusCode: 400
        }));
      }

      // Mismatching client id
      if (ac.client_id !== req.client._id) {
        return next(new AuthorizationError({
          error: 'invalid_grant',
          error_description: 'Mismatching client id',
          statusCode: 400
        }));
      }

      // Mismatching user id
      //if (ac.user_id !== req.user._id) {
      //  return next(new AuthorizationError({
      //    error: 'invalid_grant',
      //    error_description: 'Mismatching client id',
      //    statusCode: 400
      //  }));
      //}

      req.code = ac;

      // Update the code to show that it's been used.
      AuthorizationCode.patch(ac._id, { used: true }, function (err) {
        next(err);
      });
    });

  } else {
    next();
  }
}


/**
 * Exports
 */

module.exports = verifyAuthorizationCode;
