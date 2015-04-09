
module.exports = function (server) {

  /**
   * Logout
   */

  function signout (req, res) {
    var redirectUri = req.query.redirect_uri;

    delete req.session.opbs;
    req.logout();

    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    });

    if (redirectUri) {
      res.redirect(redirectUri);
    } else {
      res.send(204);
    }

  }

  server.get('/signout', signout);
  server.post('/signout', signout);

};

