var oidc = require('../lib/oidc')
  , User = require('../models/User')
  , AccessToken = require('../models/AccessToken')
  , UnauthorizedError = require('../errors/UnauthorizedError')
  ;


module.exports = function (server) {


  function verifyBearerToken (scope) {
    return function (req, res, next) {
      var header = req.headers.authorization;

      // missing header
      if (!header || header.indexOf('Bearer') === -1) {
        return next(new UnauthorizedError({
          realm:             'user',
          error:             'invalid_request',
          error_description: 'An access token is required',
          statusCode:        400
        }));
      }

      // header found
      else {
        var token = header.replace('Bearer ', '');

        // random access token
        if (token.indexOf('.') === -1) {
          AccessToken.get(token, function (err, at) {
            if (err) { return next(err); }

            // Unknown token
            if (!at) {
              return next(new UnauthorizedError({
                realm:              'user',
                error:              'invalid_token',
                error_description:  'Unknown access token',
                statusCode:         401
              }));
            }

            // Expired token
            if (Date.now() > (at.created + (at.ei * 1000))) {
              return next(new UnauthorizedError({
                realm:              'user',
                error:              'invalid_token',
                error_description:  'Expired access token',
                statusCode:         401
              }));
            }

            // Insufficient scope
            if (at.scope.indexOf(scope) === -1) {
              return next(new UnauthorizedError({
                realm:              'user',
                error:              'insufficient_scope',
                error_description:  'Insufficient access token scope',
                statusCode:         403
              }));
            }

            req.token = at;

            return next();
          });
        }

        // Signed JWT
        else {
          token = UserToken.decode(jwt, server.settings.publicKey);

          // failed to decode
          if (!token || token instanceof Error) {
            return next(new UnauthorizedError({
              realm:              'user',
              error:              'invalid_token',
              error_description:  'Invalid access token',
              statusCode:         401
            }));
          }

          // successfully decoded
          else {
            // TODO: validate payload
            // * expiration
            // * scope
            // * ...
            req.token = token;
            next();
          }
        }
      }
    };
  }


  /**
   * UserInfo Endpoint
   */

  server.get('/userinfo', verifyBearerToken('profile'), function (req, res, next) {
    User.get(req.token.uid || req.token.payload.sub, function (err, user) {
      if (err) { return next(err); }
      if (!user) { return next(new NotFoundError()); }
      res.json(200, user.project('userinfo'));
    });
  });

};

