/* global process */

/**
 * Module dependencies
 */

var User = require('../models/User')
var AnvilConnectKeys = require('anvil-connect-keys')
var keygen = new AnvilConnectKeys()

/**
 * Check if server is in out-of-box mode
 */

function isOOB (cb) {
  User.listByRoles('authority', function (err, users) {
    if (err) { return cb(err) }
    // return true if there are no authority users
    return cb(null, !users || !users.length)
  })
}

exports.isOOB = isOOB

/**
 * Read setup token from filesystem or create if missing
 */

function readSetupToken (cb) {
  var token
  var write = false

  try {
    // try to read setup token from filesystem
    token = keygen.loadSetupToken()
    // if token is blank, try to generate a new token and save it
    if (!token.trim()) {
      write = true
    }
  } catch (err) {
    // if unable to read, try to generate a new token and save it
    write = true
  }

  if (write) {
    try {
      token = keygen.generateSetupToken()
    } catch (err) {
      // if we can't write the token to disk, something is very wrong
      return cb(err)
    }
  }

  // return the token
  cb(null, token)
}
exports.readSetupToken = readSetupToken
