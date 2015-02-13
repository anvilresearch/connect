/**
 * Facebook Provider
 */

module.exports = function (config) {
  return {
    id:               'facebook',
    name:             'Facebook',
    protocol:         'OAuth2',
    url:              'https://www.facebook.com',
    redirect_uri:      config.issuer + '/connect/facebook/callback',
    endpoints: {
      authorize: {
        url:          'https://www.facebook.com/dialog/oauth',
        method:       'POST',
      },
      token: {
        url:          'https://graph.facebook.com/oauth/access_token',
        method:       'POST',
        auth:         'client_secret_post',
        parser:       'x-www-form-urlencoded'
      },
      user: {
        url:          'https://graph.facebook.com/me',
        method:       'GET',
        auth: {
          header:     'Authorization',
          scheme:     'Bearer'
        }
      }
    },
    separator:        ',',
    mapping: {
      id:             'id',
      emailVerified:  'verified',
      name:           'name',
      givenName:      'first_name',
      familyName:     'last_name',
      profile:        'link',
      gender:         'gender',
      //zoneinfo:       'timezone',
      locale:         'locale',
    }
  };
};

