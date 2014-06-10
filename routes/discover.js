/**
 * Well-Known Endpoint
 */

module.exports = function (server) {

  /**
   * OpenID Provider Configuration Information
   */

  server.get('/.well-known/openid-configuration', function (req, res, next) {
    res.json(server.OpenIDConfiguration);
  });

};
