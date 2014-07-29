/**
 * Exports
 */

module.exports = {
  authenticateClient:           require('./authenticateClient'),
  authorize:                    require('./authorize'),
  determineScope:               require('./determineScope'),
  error:                        require('./error'),
  getBearerToken:               require('./getBearerToken'),
  parseAuthorizationHeader:     require('./parseAuthorizationHeader'),
  promptToAuthorize:            require('./promptToAuthorize'),
  requireSignin:                require('./requireSignin'),
  selectConnectParams:          require('./selectConnectParams'),
  stashParams:                  require('./stashParams'),
  token:                        require('./token'),
  unstashParams:                require('./unstashParams'),
  validateAuthorizationParams:  require('./validateAuthorizationParams'),
  validateTokenParams:          require('./validateTokenParams'),
  verifyClient:                 require('./verifyClient'),
  verifyClientRegistration:     require('./verifyClientRegistration'),
  verifyClientToken:            require('./verifyClientToken'),
  verifyUserToken:              require('./verifyUserToken'),
  verifyClientIdentifiers:      require('./verifyClientIdentifiers'),
  verifyAuthorizationCode:      require('./verifyAuthorizationCode')
};

