/**
 * Module dependencies
 */

var cwd = process.cwd()
  , path = require('path')
  ;


/**
 * OIDC Middlewares
 */

var oidc = {
  authenticateClient:           require('./authenticateClient'),
  authenticateUser:           require('./authenticateUser'),
  authorize:                    require('./authorize'),
  checkSession:                 require('./checkSession'),
  determineUserScope:           require('./determineUserScope'),
  determineClientScope:         require('./determineClientScope'),
  error:                        require('./error'),
  getBearerToken:               require('./getBearerToken'),
  parseAuthorizationHeader:     require('./parseAuthorizationHeader'),
  promptToAuthorize:            require('./promptToAuthorize'),
  requireSignin:                require('./requireSignin'),
  selectConnectParams:          require('./selectConnectParams'),
  session:                      require('./session'),
  sessionEvents:                require('./sessionEvents'),
  sessionState:                 require('./sessionState'),
  signout:                      require('./signout'),
  stashParams:                  require('./stashParams'),
  token:                        require('./token'),
  unstashParams:                require('./unstashParams'),
  validateAuthorizationParams:  require('./validateAuthorizationParams'),
  validateTokenParams:          require('./validateTokenParams'),
  verifyAccessToken:            require('./verifyAccessToken'),
  verifyClient:                 require('./verifyClient'),
  verifyClientRegistration:     require('./verifyClientRegistration'),
  verifyClientToken:            require('./verifyClientToken'),
  verifyClientIdentifiers:      require('./verifyClientIdentifiers'),
  verifyAuthorizationCode:      require('./verifyAuthorizationCode')
};


/**
 * Load Hooks
 */

try {
  oidc.beforeAuthorize = require(path.join(cwd, 'hooks', 'beforeAuthorize'))
} catch (e) {}


/**
 * Exports
 */

module.exports = oidc;
