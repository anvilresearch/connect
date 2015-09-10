/* global process */

var fs = require('fs')
var cp = require('child_process')

module.exports = function (argv) {
  var tokens = argv._
  var file = tokens[1]
  var text = fs.readFileSync(file, { encoding: 'base64' })
  var proc = cp.spawn('pbcopy')

  proc.stdin.write(text)
  proc.stdin.end()

  console.log('Copied %s to the clipboard', file)
  process.exit()
}
