var path = require('path')
var cwd = process.cwd()

module.exports = function (argv) {
  require(path.join(cwd, 'server'))
}
