/**
 * Module dependencies
 */

var client             = require('../config/redis')
  , Modinha            = require('modinha')
  , Document           = require('modinha-redis')
  , AuthorizationError = require('../errors/AuthorizationError')
  ;


/**
 * Model definition
 */

var AuthorizationCode = Modinha.define('authorizationcodes', {

  code: {
    type:     'string',
    required: true,
    default:  Modinha.defaults.random(10),
    unique:   true
    //uniqueId: true
  },

  expires_at: {
    type:     'number',
    default:  expires
  },

  client_id: {
    type:     'string',
    required: true
  },

  redirect_uri: {
    type:     'string',
    required: true,
    format:   'url'
  },

  max_age: {
    type: 'number'
  },

  user_id: {
    type:     'string',
    required: true
  },

  scope: {
    type:     'string',
    required: true
  },

  used: {
    type:     'boolean',
    default:  false
  }

});


/**
 * Expires
 */

function expires () {
  return Date.now() + (600 * 1000);
}


/**
 * Document persistence
 */

AuthorizationCode.extend(Document);
AuthorizationCode.__client = client;


/**
 * Exports
 */

module.exports = AuthorizationCode;
