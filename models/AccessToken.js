/**
 * Module dependencies
 */

var client   = require('../config/redis')
  , Modinha  = require('modinha')
  , Document = require('modinha-redis')
  , random   = Modinha.defaults.random
  , InvalidTokenError = require('../errors/InvalidTokenError')
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
 * Issue mapping
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
AccessToken.exchange = function (request, callback) {
  var token = AccessToken.initialize(request.code, { mapping: 'exchange' });
  token.rt = random(10)();
  this.insert(token, function (err, token) {
    if (err) { return callback(err); }
    callback(null, token);
  });
};


/**
 * Issue access token
 */

AccessToken.issue = function (request, callback) {
  if (!request.user || !request.client) {
    return callback(new Error('invalid_request'));
  }

  this.insert({
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

AccessToken.refresh = function (refreshToken, clientId, callback) {
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

//AccessToken.verify = function (access, scope, callback) {
//  this.get(access, function (err, token) {
//    if (!token) {
//      return callback(new InvalidTokenError('Unknown access token'));
//    }

//    if (new Date() > token.expires_at) {
//      return callback(new InvalidTokenError('Expired access token'));
//    }

//    if (token.scope.indexOf(scope) === -1) {
//      return callback(new InsufficientScopeError());
//    }

//    callback(null, token);
//  });
//};



/**
 * JWT AccessToken
 */

//var cwd = process.cwd()
//  , path = require('path')
//  , env = process.env.NODE_ENV || 'development'
//  , config = require(path.join(cwd, 'config.' + env + '.json'))
//  , JWT = require('../lib/JWT')
//  ;

//var AccessJWT = JWT.define({

//  // default header
//  header: {
//    alg: 'RS256'
//  },

//  headers: [
//    'alg'
//  ],

//  // modify header schema
//  registeredHeaders: {
//    alg: { format: 'StringOrURI', required: true, enum: ['RS256'] }
//  },

//  // modify payload schema
//  registeredClaims: {
//    iss: { format: 'URI', required: true },
//    iat: { format: 'IntDate', required: true, default: Date.now },
//    exp: { format: 'IntDate', required: true, default: expires },
//    sub: { format: 'String', required: true, from: 'uid' },
//    aud: { format: 'String', required: true, from: 'cid' },
//    scp: { format: 'String', required: true, from: 'scope' },
//  }

//});

//function expires () {
//  return Date.now() + (3600 * 1000);
//}

//AccessToken.AccessJWT = AccessJWT;





/**
 * Errors
 */

AccessToken.InvalidTokenError = InvalidTokenError;
AccessToken.InsufficientScopeError = InsufficientScopeError;


/**
 * Exports
 */

module.exports = AccessToken;
