/**
 * SoundCloud
 */

module.exports = function (config) {
  return {
    id:                   'soundcloud',
    name:                 'soundcloud',
    protocol:             'OAuth2',
    url:                  '',
    redirect_uri:          config.issuer + '/connect/soundcloud/callback',
    endpoints: {
      authorize: {
        url:              'https://soundcloud.com/connect',
        method:           'POST',
      },
      token: {
        url:              'https://api.soundcloud.com/oauth2/token',
        method:           'POST',
        auth:             'client_secret_post'
      },
      user: {
        url:              'https://api.soundcloud.com/me.json',
        method:           'GET',
        auth: {
          query:          'oauth_token'
        }
      }
    },
    mapping: {
      id:                 'id',
      emailVerified:      'primary_email_confirmed',
      name:               'full_name',
      givenName:          'first_name',
      familyName:         'last_name',
      preferredUsername:  'username',
      profile:            'permalink_url',
      picture:            'avatar_url',
      //website:            'website'
    }
  };
};
