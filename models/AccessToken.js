/**
 * Module dependencies
 */

var async    = require('async')
  , client   = require('../config/redis')
  , JWT      = require('../lib/JWT')
  , Modinha  = require('modinha')
  , Document = require('modinha-redis')
  , random   = Modinha.defaults.random
  , InvalidTokenError = require('../errors/InvalidTokenError')
  , UnauthorizedError = require('../errors/UnauthorizedError')
  , InsufficientScopeError = require('../errors/InsufficientScopeError')
  ;




/**
 * Model definition
 */

var AccessToken = Modinha.define('accesstokens', {

  // access token
  at: {
    type:     'string',
    required: true,
    default:  random(10),
    uniqueId: true
  },

  // token type
  tt: {
    type:     'string',
    enum:     ['Bearer', 'mac'],
    default:  'Bearer'
  },

  // expires in
  ei: {
    type:     'number',
    default:  3600
  },

  // refresh token
  rt: {
    type:     'string',
    unique:   true
  },

  // issuer
  iss: {
    type:     'string'
  },

  // client id
  cid: {
    type:     'string',
    required: true
  },

  // user id
  uid: {
    type:     'string',
    required: true
  },

  // scope
  scope: {
    type:     'string',
    required: true
  },

  // jwt?????
  jwt: {
    type:     'string'
  }

});


/**
 * Document persistence
 */

AccessToken.extend(Document);
AccessToken.__client = client;


/**
 * Indices
 */

AccessToken.defineIndex({
  type: 'sorted',
  key: ['users:$:clients', 'uid'],
  score: 'created',
  member: 'cid'
});

/**
 * Index a token by it's user/client pair.
 * This makes it possible to resuse an access token
 * instead of issuing a new one.
 */

//AccessToken.defineIndex({
//  type: 'hash',
//  key: 'user:client:token',
//  field: ['$:$', 'uid', 'cid'],
//  value: 'at'
//});


//AccessToken.existing = function (userId, clientId, callback) {
//  var key = 'user:client:token'
//    , field = userId + ':' + clientId
//    ;

//  this.__client.hget(key, field, function (err, id) {
//    if (err) { return callback(err); }
//    if (!id) { return callback(null, null); }

//    AccessToken.get(id, function (err, token) {
//      if (err) { return callback(err); }
//      if (!token) { return callback(null, null); }
//      callback(null, token.project('issue'));
//    });
//  });
//};


/**
 * Mappings
 */

AccessToken.mappings.issue = {
  'at': 'access_token',
  'tt': 'token_type',
  'ei': 'expires_in',
  'rt': 'refresh_token'
};

AccessToken.mappings.exchange = {
  'cid':   'client_id',
  'uid':   'user_id',
  'ei':    'max_age',
  'scope': 'scope'
};


/**
 * Exchange authorization code for access token
 */

// TODO: Need to modify modinha-redis
// insert method to merge options for
// initialization so we can use the
// mapping directly with insert.
AccessToken.exchange = function (request, server, callback) {
  var token = AccessToken.initialize(request.code, { mapping: 'exchange' });
  token.iss = server.settings.issuer;
  token.rt = random(10)();
  this.insert(token, function (err, token) {
    if (err) { return callback(err); }
    callback(null, token);
  });
};


/**
 * Issue access token
 */

AccessToken.issue = function (request, server, callback) {
  if (!request.user || !request.client) {
    return callback(new Error('invalid_request'));
  }

  this.insert({
    iss: server.settings.issuer,
    uid: request.user._id,
    cid: request.client._id,
    ei:  (request.connectParams && parseInt(request.connectParams.max_age))
          || request.client.default_max_age,
    scope: request.scope
  }, function (err, token) {
    if (err) { return callback(err); }
    callback(null, token.project('issue'));
  });
};


/**
 * Refresh access token
 */

AccessToken.refresh = function (refreshToken, clientId, server, callback) {
  AccessToken.getByRt(refreshToken, function (err, at) {
    if (err) {
      return callback(err);
    }

    if (!at) {
      return callback(new InvalidTokenError('Unknown refresh token'));
    }

    if (at.cid !== clientId) {
      return callback(new InvalidTokenError('Mismatching client id'));
    }

    AccessToken.insert({
      iss: server.settings.issuer,
      uid: at.uid,
      cid: at.cid,
      ei:  at.ei,
      scope: at.scope
    }, function (err, token) {
      if (err) { return callback(err); }

      // we should destroy the current token
      AccessToken.delete(at.at, function (err) {
        if (err) { return callback(err); }
        callback(null, token);
      });
    });
  });
};


/**
 * Revoke access token
 */

AccessToken.revoke = function (accountId, appId, callback) {
  var key = 'account:app:token'
    , field = accountId + ':' + appId
    ;

  this.__client.hget(key, field, function (err, id) {
    if (err) { return callback(err); }
    if (!id) { return callback(null, null); }

    AccessToken.delete(id, function (err, result) {
      if (err) { return callback(err); }
      callback(null, result);
    });
  });
};


/**
 * Verify access token
 */

AccessToken.verify = function (token, options, callback) {

  async.parallel({

    // Handle JWT
    jwt: function (done) {
      // the token is a JWT
      if (token.indexOf('.') !== -1) {
        var decoded = AccessJWT.decode(token, options.key);
        if (!decoded || decoded instanceof Error) {
          done(new UnauthorizedError({
            realm: 'user',
            error: 'invalid_token',
            error_description: 'Invalid access token',
            statusCode: 401
          }));
        } else {
          done(null, decoded);
        }
      }

      // the token is not a JWT
      else {
        done();
      }
    },

    // Fetch from database
    random: function (done) {
      // the token is random
      if (token.indexOf('.') === -1) {
        AccessToken.get(token, function (err, instance) {
          if (err) {
            return done(err);
          }

          if (!instance) {
            return done(new UnauthorizedError({
              realm:              'user',
              error:              'invalid_request',
              error_description:  'Unknown access token',
              statusCode:          401
            }));
          }

          done(null, {
            jti:    instance.at,
            iss:    instance.iss,
            sub:    instance.uid,
            aud:    instance.cid,
            iat:    instance.created,
            exp:    instance.created + (instance.ei * 1000),
            scope:  instance.scope
          });
        });
      }

      // the token is not random
      else {
        done();
      }
    }

  }, function (err, result) {
    if (err) { return callback(err); }

    var claims = result.random || result.jwt.payload
      , issuer = options.iss
      , scope  = options.scope
      ;


    // mismatching issuer
    if (claims.iss !== issuer) {
      return callback(new UnauthorizedError({
        error:              'invalid_token',
        error_description:  'Mismatching issuer',
        statusCode:          403
      }));
    }

    // expired token
    if (Date.now() > claims.exp) {
      return callback(new UnauthorizedError({
        realm:              'user',
        error:              'invalid_token',
        error_description:  'Expired access token',
        statusCode:          403
      }));
    }

    // insufficient scope
    if (scope && claims.scope.indexOf(scope) === -1) {
      return callback(new UnauthorizedError({
        realm:              'user',
        error:              'insufficient_scope',
        error_description:  'Insufficient scope',
        statusCode:          403
      }));
    }

    callback(null, claims);
  });
};



/**
 * JWT AccessToken
 */

var AccessJWT = JWT.define({

  // default header
  header: {
    alg: 'RS256'
  },

  headers: [
    'alg'
  ],

  // modify header schema
  registeredHeaders: {
    alg: { format: 'StringOrURI', required: true, enum: ['RS256'] }
  },

  // permitted claims
  claims: ['jti', 'iss', 'sub', 'aud', 'exp', 'iat', 'scope'],

  // modify payload schema
  registeredClaims: {
    jti:    { format: 'String',  required: true, from: 'at' },
    iss:    { format: 'URI',     required: true },
    iat:    { format: 'IntDate', required: true, default: Date.now },
    exp:    { format: 'IntDate', required: true, default: expires },
    sub:    { format: 'String',  required: true, from: 'uid' },
    aud:    { format: 'String',  required: true, from: 'cid' },
    scope:  { format: 'String',  required: true },
  }

});

function expires () {
  return Date.now() + (3600 * 1000);
}

AccessToken.AccessJWT = AccessJWT;

AccessToken.prototype.toJWT = function (secret) {
  var jwt = new AccessJWT(this);
  jwt.payload.exp = Date.now() + (this.ei * 1000);
  return jwt.encode(secret);
}



/**
 * Errors
 */

AccessToken.InvalidTokenError = InvalidTokenError;
AccessToken.InsufficientScopeError = InsufficientScopeError;


/**
 * Exports
 */

module.exports = AccessToken;
