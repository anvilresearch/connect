/**
 * Module dependencies
 */

var oidc = require('../oidc');
var client = require('../boot/redis');


/**
 * Session endpoint
 */

module.exports = function (server) {

  /**
   * Check session iframe
   */

  server.get('/session', oidc.session);


  /**
   * Check session
   */

  function checkSession(req, res) {
    var initialOpbs = req.session.opbs;
    client.get('sess:' + req.sessionID, function (err, data) {
      try {
        var opbs = JSON.parse(data).opbs;
        if (opbs !== initialOpbs) {
          res.write("event: update\n");
          res.write("data: " + opbs + "\n\n");
        }
      } catch (e) {}

      setTimeout(function () {
        checkSession(req, res);
      }, 3000);
    })
  }


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
    checkSession(req, res);
  });


};
