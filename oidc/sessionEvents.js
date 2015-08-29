/**
 * Module dependencies
 */

var checkSession = require('./checkSession')

/**
 * Session Events endpoint (SSE)
 */

function sessionEvents (req, res) {
  req.socket.setTimeout(0)

  // Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  // Set retry interval
  res.write('retry: 2000\n')

  // Periodically update the client
  checkSession(req, res)
}

/**
 * Exports
 */

module.exports = sessionEvents
