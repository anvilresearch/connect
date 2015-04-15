/**
 * Module dependencies
 */

var oidc = require('../oidc');


/**
 * Session endpoint
 */

module.exports = function (server) {

  /**
   * Check session iframe
   */

  server.get('/session', oidc.session);


  /**
   * SSE endpoint
   * (push updates to client)
   */

  server.get('/session/events', function (req, res) {
    req.socket.setTimeout(Infinity);

    // Headers
    res.writeHead(200, {
      "Content-Type":"text/event-stream",
      "Cache-Control":"no-cache",
      "Connection":"keep-alive"
    });

    // Set retry interval
    res.write("retry: 2000\n");

    // Periodically update the client
    oidc.checkSession(req, res);
  });


};
