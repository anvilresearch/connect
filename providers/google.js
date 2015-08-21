/**
 * Google
 */

module.exports = function (config) {
  return {
    id: 'google',
    name: 'Google',
    protocol: 'OAuth2',
    url: 'https://google.com',
    redirect_uri: config.issuer + '/connect/google/callback',
    endpoints: {
      authorize: {
        url: 'https://accounts.google.com/o/oauth2/auth',
        method: 'POST'
      },
      token: {
        url: 'https://accounts.google.com/o/oauth2/token',
        method: 'POST',
        auth: 'client_secret_post'
      },
      user: {
        url: 'https://www.googleapis.com/oauth2/v1/userinfo',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      },
      revoke: {
        url: 'https://accounts.google.com/o/oauth2/revoke',
        method: 'GET',
        auth: {
          param: 'token'
        }
      }
    },
    mapping: {
      id: 'id',
      email: 'email',
      emailVerified: 'verified_email',
      name: 'name',
      givenName: 'given_name',
      familyName: 'family_name',
      profile: 'link',
      picture: 'picture',
      gender: 'gender',
      locale: 'locale'
    }
  }
}
