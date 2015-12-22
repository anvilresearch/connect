/**
 * Module dependencies
 */

var cwd = process.cwd()
var env = process.env.NODE_ENV || 'development'
var fs = require('fs')
var path = require('path')
var bunyan = require('express-bunyan-logger')

/**
 * Logstreams
 */

var streams = []

if (!env.match(/test/i)) {
  var logs_path = path.join(cwd, 'logs')

  fs.stat(logs_path, function (err, logs_path_stats) {
    if (err && err.code === 'ENOENT') {
      fs.mkdir(logs_path, function (err) {
        if (err) {
          console.error('Could not create the logs path [%s]', logs_path)
          process.exit(1)
        }
      })
    } else if (!logs_path_stats.isDirectory()) {
      console.error('The logs path [%s] is not a directory', logs_path)
      process.exit(1)
    }

    fs.access(logs_path, fs.W_OK, function (err) {
      if (err && err.code === 'EACCES') {
        console.error('The logs path [%s] is not writable', logs_path)
        process.exit(1)
      }
    })
  })

  streams.push({ stream: process.stdout })
  streams.push({ path: path.join(logs_path, env + '.log') })
}

/**
 * Export
 */

module.exports = function (config) {
  var logger = bunyan(config || {
    name: 'request',
    streams: streams
  })

  module.exports = logger

  return logger
}
