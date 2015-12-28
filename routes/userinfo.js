/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')

/**
 * Exports
 */

module.exports = function (server) {
  /**
   * UserInfo Endpoint
   */

  server.get('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'profile'
    }),
    oidc.getAuthorizedScopes,
    oidc.getUserInfo
  )

  /**
   * UserInfo Update Endpoint
   */

  server.patch('/userinfo',
    oidc.parseAuthorizationHeader,
    oidc.getBearerToken,
    oidc.verifyAccessToken({
      iss: settings.issuer,
      key: settings.keys.sig.pub,
      scope: 'profile'
    }),
    oidc.getAuthorizedScopes,
    oidc.patchUserInfo
  )
}
