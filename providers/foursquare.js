/**
 * Foursquare
 */

module.exports = function (config) {
  return {
    id: 'foursquare',
    name: 'foursquare',
    protocol: 'OAuth2',
    url: '',
    redirect_uri: config.issuer + '/connect/foursquare/callback',
    endpoints: {
      authorize: {
        url: 'https://foursquare.com/oauth2/authenticate',
        method: 'POST'
      },
      token: {
        url: 'https://foursquare.com/oauth2/access_token',
        method: 'POST',
        auth: 'client_secret_basic'
      },
      user: {
        url: 'https://api.foursquare.com/v2/users/self',
        method: 'GET',
        auth: {
          query: 'oauth_token'
        },
        params: {
          v: '20140308'
        }
      }
    },
    mapping: {
      id: 'response.user.id',
      givenName: 'response.user.firstName',
      familyName: 'response.user.lastName',
      gender: 'response.user.gender',
      email: 'response.user.contact.email'
    }
  }
}
