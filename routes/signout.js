
module.exports = function (server) {

  /**
   * Logout
   *
   * What else do we need to do here besides kill the
   * local session? Redirect to a page that will wipe
   * localStorage?
   */

  function signout (req, res) {
    req.logout();
    res.send(204);
  }

  server.get('/signout', signout);
  server.post('/signout', signout);

};

