var fs = require('fs')

/**
 * Makes sure the requested directory exists and is writable
 * @param {string} path string specifying the path to the directory that should exist and be writable
 * @return {void}
 * @api private
 */
exports.ensureWritableDirectory = function (path) {
  fs.stat(path, function (err, path_stats) {
    if (err && err.code === 'ENOENT') {
      fs.mkdir(path, function (err) {
        if (err) {
          console.error('Could not create the logs path [%s]', path)
          process.exit(1)
        }
      })
    } else if (!path_stats.isDirectory()) {
      console.error('The logs path [%s] is not a directory', path)
      process.exit(1)
    }

    fs.access(path, fs.W_OK, function (err) {
      if (err && err.code === 'EACCES') {
        console.error('The logs path [%s] is not writable', path)
        process.exit(1)
      }
    })
  })
}
