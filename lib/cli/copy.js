var fs = require('fs')
  , cp = require('child_process')
  ;

module.exports = function (argv) {
  var tokens = argv._
    , file = tokens[1]
    , text = fs.readFileSync(file, { encoding: 'base64' })
    , proc = cp.spawn('pbcopy')
    ;

  proc.stdin.write(text)
  proc.stdin.end();

  console.log('Copied %s to the clipboard', file);
  process.exit();
};
