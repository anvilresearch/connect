var fs = require('fs')
  , cp = require('child_process')
  ;

module.exports = function (argv) {
  var file = argv._.shift()
    , text = fs.readFileSync(file, { encoding: 'ascii' })
    , str = JSON.stringify(text).replace(/\"/g, '')
    , proc = cp.spawn('pbcopy')
    ;

  proc.stdin.write(str);
  proc.stdin.end();
};
