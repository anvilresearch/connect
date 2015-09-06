/* global process */

/**
 * Module dependencies
 */

var User = require('../models/User')
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var cwd = process.cwd()
var setupTokenPath = path.join(cwd, 'keys', 'setup.token')

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
    token = fs.readFileSync(setupTokenPath).toString()
    // if token is blank, try to generate a new token and save it
    if (!token.trim()) {
      write = true
    }
  } catch (err) {
    // if unable to read, try to generate a new token and save it
    write = true
  }

  if (write) {
    token = crypto.randomBytes(256).toString('hex')
    try {
      fs.writeFileSync(setupTokenPath, token)
    } catch (err) {
      // if we can't write the token to disk, something is very wrong
      return cb(err)
    }
  }

  // return the token
  cb(null, token)
}
exports.readSetupToken = readSetupToken
