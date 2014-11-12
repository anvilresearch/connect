var cwd              = process.cwd()
  , env              = process.env.NODE_ENV || 'development'
  , path             = require('path')
  , config           = require(path.join(cwd, 'config.' + env + '.json'))
  ;

/**
 * Provider definitions
 */

module.exports = {


  oauth2test: {
    id: 'oauth2test',
    name: 'OAuth2Test',
    protocol: 'OAuth 2.0',
    url: 'https://anvil.io',
    redirect_uri: config.issuer + 'connect/oauth2test/callback',
    endpoints: {
      authorize: {
        url: 'https://anvil.io/authorize',
        method: 'POST'
      },
      token: {
        url: 'https://anvil.io/token',
        method: 'POST',
        auth: 'client_secret_basic'
      },
      user: {
        url: 'https://anvil.io/user',
        method: 'GET',
        auth: 'bearer_token'
      }
    },
    mapping: {
      name: 'fullname'
    }
  },


  angellist: {
    id:               'angellist',
    name:             'angellist',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:      config.issuer + '/connect/angellist/callback',
    endpoints: {
      authorize: {
        url:          'https://angel.co/api/oauth/authorize',
        method:       'POST',
      },
      token: {
        url:          'https://angel.co/api/oauth/token',
        method:       'POST',
        auth:         'client_secret_basic'
      },
      user: {
        url:          'https://api.angel.co/1/me',
        method:       'GET',
        auth: {
          query:      'access_token'
        }
      }
    },
    mapping: {
      id:             'id',
      name:           'name',
      picture:        'image',
      profile:        'angellist_url',
      email:          'email',
      website:        'online_bio_url',
    }
  },


  buffer: {
    id:               'buffer',
    name:             'buffer',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/buffer/callback',
    endpoints: {
      authorize: {
        url:    'https://bufferapp.com/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://api.bufferapp.com/1/oauth2/token.json',
        method: 'POST',
        auth:   'client_secret_basic'
      },
      user: {
        url:    'https://api.bufferapp.com/1/user.json',
        method: 'GET',
        auth: {
          query: 'access_token'
        }
      }
    },
    mapping: {
      id: 'id',
      name: 'name',
    }
  },


  dropbox: {
    id: 'dropbox',
    name: 'Dropbox',
    protocol: 'OAuth 2.0',
    url: 'https://www.dropbox.com',
    redirect_uri: config.issuer + '/connect/dropbox/callback',
    endpoints: {
      authorize: {
        url: 'https://www.dropbox.com/1/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url: 'https://api.dropbox.com/1/oauth2/token',
        method: 'POST',
        auth: 'client_secret_basic'
      },
      user: {
        url: 'https://api.dropbox.com/1/account/info',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    mapping: {
      id:             'uid',
      name:           'display_name',
      email:          'email',
      emailVerified:  'email_verified',
      locale:         'country'
    }
  },


  facebook: {
    id:               'facebook',
    name:             'Facebook',
    protocol:         'OAuth 2.0',
    url:              'https://www.facebook.com',
    redirect_uri:     config.issuer + '/connect/facebook/callback',
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
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    separator:   ',',
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
  },


  foursquare: {
    id:               'foursquare',
    name:             'foursquare',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/foursquare/callback',
    endpoints: {
      authorize: {
        url:    'https://foursquare.com/oauth2/authenticate',
        method: 'POST',
      },
      token: {
        url:    'https://foursquare.com/oauth2/access_token',
        method: 'POST',
        auth:   'client_secret_basic'
      },
      user: {
        url:    'https://api.foursquare.com/v2/users/self',
        method: 'GET',
        auth: {
          query: 'oauth_token'
        },
        params: {
          v:    '20140308'
        }
      }
    },
    mapping: {
      id:             'response.user.id',
      givenName:      'response.user.firstName',
      familyName:     'response.user.lastName',
      gender:         'response.user.gender',
      email:          'response.user.contact.email',
    }
  },


  github: {
    id:               'github',
    name:             'GitHub',
    protocol:         'OAuth 2.0',
    url:              'https://github.com',
    redirect_uri:     config.issuer + '/connect/github/callback',
    endpoints: {
      authorize: {
        url: 'https://github.com/login/oauth/authorize',
        method: 'POST',
      },
      token: {
        url: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        auth: 'client_secret_post'
      },
      user: {
        url: 'https://api.github.com/user',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    separator:   ',',
    mapping: {
      id:                 'id',
      email:              'email',
      name:               'name',
      website:            'blog',
      preferredUsername:  'login',
      profile:            'html_url',
      picture:            'avatar_url',
    }
  },


  google: {
    id:               'google',
    name:             'Google',
    protocol:         'OAuth 2.0',
    url:              'https://google.com',
    redirect_uri:     config.issuer + '/connect/google/callback',
    endpoints: {
      authorize: {
        url:    'https://accounts.google.com/o/oauth2/auth',
        method: 'POST',
      },
      token: {
        url:    'https://accounts.google.com/o/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://www.googleapis.com/oauth2/v1/userinfo',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    mapping: {
      id:             'id',
      email:          'email',
      emailVerified:  'verified_email',
      name:           'name',
      givenName:      'given_name',
      familyName:     'family_name',
      profile:        'link',
      picture:        'picture',
      gender:         'gender',
      locale:         'locale',
    }
  },


  instagram: {
    id:               'instagram',
    name:             'instagram',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/instagram/callback',
    endpoints: {
      authorize: {
        url:    'https://api.instagram.com/oauth/authorize/',
        method: 'POST',
      },
      token: {
        url:    'https://api.instagram.com/oauth/access_token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://api.instagram.com/v1/users/self',
        method: 'GET',
        auth: {
          query: 'access_token'
        }
      }
    },
    mapping: {
      id:                'data.id',
      name:              'data.fullname',
      preferredUsername: 'data.username',
      picture:           'data.profile_picture',
      website:           'data.website',
    }
  },


  mailchimp: {
    id:             'mailchimp',
    name:             'mailchimp',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     localhost(config.issuer) + '/connect/mailchimp/callback',
    endpoints: {
      authorize: {
        url:    'https://login.mailchimp.com/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://login.mailchimp.com/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://login.mailchimp.com/oauth2/metadata',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    mapping: {

    }
  },


  reddit: {
    id:             'reddit',
    name:             'reddit',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/reddit/callback',
    endpoints: {
      authorize: {
        url:    'https://ssl.reddit.com/api/v1/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://ssl.reddit.com/api/v1/access_token',
        method: 'POST',
        auth:   'client_secret_basic'
      },
      user: {
        url:    'https://oauth.reddit.com/api/v1/me',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    scope:            ['identity'],
    mapping: {
      id: 'id',
      emailVerified: 'has_verified_email',
      preferredUsername: 'name'
    }
  },


  soundcloud: {
    id:               'soundcloud',
    name:             'soundcloud',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/soundcloud/callback',
    endpoints: {
      authorize: {
        url:    'https://soundcloud.com/connect',
        method: 'POST',
      },
      token: {
        url:    'https://api.soundcloud.com/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://api.soundcloud.com/me.json',
        method: 'GET',
        auth: {
          query: 'oauth_token'
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
  },


  twitch: {
    id:               'twitch',
    name:             'Twitch',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/twitch/callback',
    endpoints: {
      authorize: {
        url:    'https://api.twitch.tv/kraken/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://api.twitch.tv/kraken/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://api.twitch.tv/kraken/user',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'OAuth'
        }
      }
    },
    mapping: {
      id:       '_id',
      name:     'name',
      profile:  '_links.self',
    }
  },


  wordpress: {
    id:               'wordpress',
    name:             'WordPress',
    protocol:         'OAuth 2.0',
    url:              '',
    redirect_uri:     config.issuer + '/connect/wordpress/callback',
    endpoints: {
      authorize: {
        url:    'https://public-api.wordpress.com/oauth2/authorize',
        method: 'POST',
      },
      token: {
        url:    'https://public-api.wordpress.com/oauth2/token',
        method: 'POST',
        auth:   'client_secret_post'
      },
      user: {
        url:    'https://public-api.wordpress.com/rest/v1/me',
        method: 'GET',
        auth: {
          header: 'Authorization',
          scheme: 'Bearer'
        }
      }
    },
    mapping: {
      id:                 'ID',
      email:              'email',
      emailVerified:      'email_verified',
      name:               'display_name',
      preferredUsername:  'username',
      picture:            'avatar_URL',
      profile:            'profile_URL',
    }
  },


};


function localhost(issuer) {
  return issuer.replace('localhost', '127.0.0.1')
}
