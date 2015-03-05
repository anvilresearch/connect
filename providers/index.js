/**
 * Module dependencies
 */

var settings = require('../boot/settings');


/**
 * Provider definitions
 */

module.exports = {

  /**
   * Password
   */

  'password':   require('./password')(settings),


  /**
   * OAuth 1.0 Providers
   */

  'twitter':    require('./twitter')(settings),


  /**
   * OAuth 2.0 Providers
   */

  '37signals':  require('./37signals')(settings),
  'angellist':  require('./angellist')(settings),
  'buffer':     require('./buffer')(settings),
  'dropbox':    require('./dropbox')(settings),
  'facebook':   require('./facebook')(settings),
  'foursquare': require('./foursquare')(settings),
  'github':     require('./github')(settings),
  'google':     require('./google')(settings),
  'instagram':  require('./instagram')(settings),
  'linkedin':   require('./linkedin')(settings),
  'mailchimp':  require('./mailchimp')(settings),
  'reddit':     require('./reddit')(settings),
  'soundcloud': require('./soundcloud')(settings),
  'twitch':     require('./twitch')(settings),
  'wordpress':  require('./wordpress')(settings),


  /**
   * Test Providers
   */

  'oauthtest':  require('./oauthtest')(settings),
  'oauth2test': require('./oauth2test')(settings),

};
