var cwd    = process.cwd()
  , env    = process.env.NODE_ENV || 'development'
  , path   = require('path')
  , config = require(path.join(cwd, 'config.' + env + '.json'))
  ;

/**
 * Provider definitions
 */

module.exports = {

  /**
   * OAuth 1.0 Providers
   */

  'twitter':    require('./twitter')(config),


  /**
   * OAuth 2.0 Providers
   */

  '37signals':  require('./37signals')(config),
  'angellist':  require('./angellist')(config),
  'buffer':     require('./buffer')(config),
  'dropbox':    require('./dropbox')(config),
  'facebook':   require('./facebook')(config),
  'foursquare': require('./foursquare')(config),
  'github':     require('./github')(config),
  'google':     require('./google')(config),
  'instagram':  require('./instagram')(config),
  'linkedin':   require('./linkedin')(config),
  'mailchimp':  require('./mailchimp')(config),
  'reddit':     require('./reddit')(config),
  'soundcloud': require('./soundcloud')(config),
  'twitch':     require('./twitch')(config),
  'wordpress':  require('./wordpress')(config),


  /**
   * Test Providers
   */

  'oauthtest':  require('./oauthtest')(config),
  'oauth2test': require('./oauth2test')(config),

};
