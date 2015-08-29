/**
 * Module dependencies
 */

var oidc = require('../oidc')
var settings = require('../boot/settings')
var mailer = require('../boot/mailer').getMailer()
var passport = require('../boot/passport')
var qs = require('qs')
var InvalidRequestError = require('../errors/InvalidRequestError')
var providers = require('../providers')

var providerInfo = {}
var providerNames = Object.keys(providers)
for (var i = 0; i < providerNames.length; i++) {
  providerInfo[providerNames[i]] = providers[providerNames[i]]
}

/**
 * Signin Endpoint
 */

module.exports = function (server) {
  /**
   * Signin page
   */

  server.get('/signin',
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    function (req, res, next) {
      res.render('signin', {
        params: qs.stringify(req.query),
        request: req.query,
        providers: settings.providers,
        providerInfo: providerInfo,
        mailSupport: !!(mailer.transport)
      })
    })

  /**
   * Password signin handler
   */

  var handler = [
    oidc.selectConnectParams,
    oidc.validateAuthorizationParams,
    oidc.verifyClient,
    oidc.determineProvider,
    oidc.enforceReferrer('/signin'),
    function (req, res, next) {
      if (!req.provider) {
        next(new InvalidRequestError('Invalid provider'))
      } else {
        passport.authenticate(req.body.provider, req, res, next, function (err, user, info) {
          if (err) {
            res.render('signin', {
              params: qs.stringify(req.body),
              request: req.body,
              providers: settings.providers,
              providerInfo: providerInfo,
              mailSupport: !!(mailer.transport),
              error: err.message
            })
          } else if (!user) {
            res.render('signin', {
              params: qs.stringify(req.body),
              request: req.body,
              providers: settings.providers,
              providerInfo: providerInfo,
              mailSupport: !!(mailer.transport),
              formError: info.message
            })
          } else {
            passport.login(req, user)
            next()
          }
        })
      }
    },
    oidc.requireVerifiedEmail(),
    oidc.determineUserScope,
    oidc.promptToAuthorize,
    oidc.authorize
  ]

  if (oidc.beforeAuthorize) {
    handler.splice(handler.length - 1, 0, oidc.beforeAuthorize)
  }

  server.post('/signin', handler)

}
