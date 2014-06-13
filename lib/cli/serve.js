var cp   = require('child_process')
  , path = require('path')
  , cwd  = process.cwd()
  ;

module.exports = function (argv) {
  require(path.join(cwd, 'server'));
};
