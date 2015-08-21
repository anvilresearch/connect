/**
 * Twitter
 */

module.exports = function (config) {
  return {
    id: 'twitter',
    name: 'Twitter',
    protocol: 'OAuth',
    url: 'https://twitter.com',
    oauth_callback: config.issuer + '/connect/twitter/callback',
    oauth_signature_method: 'HMAC-SHA1',
    endpoints: {
      credentials: {
        url: 'https://api.twitter.com/oauth/request_token',
        method: 'POST',
        header: 'Authorization',
        scheme: 'OAuth',
        accept: '*/*'
      },
      authorization: {
        url: 'https://api.twitter.com/oauth/authenticate'
      },
      token: {
        url: 'https://api.twitter.com/oauth/access_token',
        method: 'POST'
      },
      user: {
        url: 'https://api.twitter.com/1.1/users/show.json',
        method: 'GET',
        header: 'Authorization',
        scheme: 'OAuth'
      }
    },
    mapping: {
      id: 'id',
      name: 'name',
      preferredUsername: 'screen_name',
      profile: 'url',
      picture: 'profile_image_url',
      twitterId: 'id'
    }
  }
}
