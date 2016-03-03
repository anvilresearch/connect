/**
 * Module dependencies
 */

var cwd = process.cwd()
var env = process.env.NODE_ENV || 'development'
var path = require('path')
var bunyan = require('express-bunyan-logger')
var ensureWritableDirectory = require('../lib/fs-utils').ensureWritableDirectory
var oidc = require('../oidc')

var FN_ARGS_SPLIT = /^[^\(]*\(\s*([^\)]*)\)/m

function getSignature (fn) {
  return fn.toString().match(FN_ARGS_SPLIT)[1]
}

function oidcLogging (addLogging) {
  for (var idx in oidc) {
    var fn = oidc[idx]
    if (getSignature(fn) === addLogging.signature) {
      // wrap function with logging
      oidc[fn.name] = addLogging(fn)
    }
  }
}

function debugLogging () {
  var addLogging = function (fn) {
    return function (req, res, next) {
      req.log.debug(fn.name)
      fn(req, res, next)
    }
  }
  addLogging.signature = 'req, res, next'
  oidcLogging(addLogging)
}

function errorLogging () {
  var addLogging = function (fn) {
    return function (err, req, res, next) {
      req.log.error(err, fn.name)
      fn(err, req, res, next)
    }
  }
  addLogging.signature = 'err, req, res, next'
  oidcLogging(addLogging)
}

/**
 * Export
 */

module.exports = function (options) {
  var logger
  var config = { name: 'request', streams: [], level: 'info' }

  if (!env.match(/test/i)) {
    var logsPath = path.join(cwd, 'logs')
    ensureWritableDirectory(logsPath)

    if (options && options.stdout) { config.streams.push({ stream: process.stdout }) }
    if (options && options.file) { config.streams.push({ path: path.join(logsPath, env + '.log') }) }
    if (options && options.level) { config.level = options.level }

    switch (config.level) {
      case 'fatal':
        break
      case 'error':
        errorLogging()
        break
      case 'warn':
        errorLogging()
        break
      case 'info':
        errorLogging()
        break
      case 'debug':
        debugLogging()
        errorLogging()
        break
      case 'trace':
        debugLogging()
        errorLogging()
        break
    }

    try {
      config = require('../logger')
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') { throw e }
    }
  }

  logger = bunyan(config)

  module.exports = logger
  return logger
}
