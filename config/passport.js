/**
 * Passport Configuration
 */

var _                = require('lodash')
  , cwd              = process.cwd()
  , env              = process.env.NODE_ENV || 'development'
  , path             = require('path')
  , util             = require('util')
  , config           = require(path.join(cwd, 'config.' + env + '.json'))
  , LocalStrategy    = require('passport-local').Strategy
  , TwitterStrategy  = require('passport-twitter').Strategy
  , base64url        = require('base64url')
  , User             = require('../models/User')
  ;


module.exports = function (passport) {


  /**
   * Sessions
   */

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.get(id, function (err, user) {
      done(err, user);
    });
  });


  /**
   * Local Strategy
   */

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    function (email, password, done) {
      User.authenticate(email, password, function (err, user, info) {
        done(err, user, info);
      });
    }
  ));


  /**
   * OAuth Strategies
   */

  var providers = config.providers;

  if (providers) {

    /**
     * Cut the verbosity of the config files
     */

    Object.keys(providers).forEach(function (name) {
      var callbackUrl = config.issuer + '/connect/' + name + '/callback';
      providers[name].callbackURL = callbackUrl;
      providers[name].passReqToCallback = true;
    });


    /**
     * Twitter
     */

    if (typeof providers.twitter === 'object') {
      passport.use(new TwitterStrategy(
        providers.twitter,
        function (request, token, secret, profile, done) {
          User.connect({
            provider: 'twitter',
            user:      request.user,
            token:     token,
            profile:   profile._json
          }, function (err, user) {
            if (err) { return done(err); }
            done(null, user);
          });
        }
      ));
    }

  }


  var providerMetadata = {

    dropbox: {
      name:             'dropbox',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://www.dropbox.com/1/oauth2/authorize',
      tokenURL:         'https://api.dropbox.com/1/oauth2/token',
      profileURL:       'https://api.dropbox.com/1/account/info',
      scopeSeparator:   ',',
      mapping: {
        id:             'uid',
        name:           'display_name',
        email:          'email',
        emailVerified:  'email_verified',
        locale:         'country'
      }
    },

    facebook: {
      name:             'facebook',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://www.facebook.com/dialog/oauth',
      tokenURL:         'https://graph.facebook.com/oauth/access_token',
      profileURL:       'https://graph.facebook.com/me',
      scopeSeparator:   ',',
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
      name:             'foursquare',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://foursquare.com/oauth2/authenticate',
      tokenURL:         'https://foursquare.com/oauth2/access_token',
      profileURL:       'https://api.foursquare.com/v2/users/self',
      apiVersion:       '20140308',
      accessTokenName:  'oauth_token',
      mapping: {
        id:             'response.user.id',
        givenName:      'response.user.firstName',
        familyName:     'response.user.lastName',
        gender:         'response.user.gender',
        email:          'response.user.contact.email',
      }
    },

    github: {
      name:             'github',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL:         'https://github.com/login/oauth/access_token',
      profileURL:       'https://api.github.com/user',
      scopeSeparator:   ',',
      useAuthorizationHeaderforGET: true,
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
      name:             'google',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL:         'https://accounts.google.com/o/oauth2/token',
      profileURL:       'https://www.googleapis.com/oauth2/v1/userinfo',
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
      name:             'instagram',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://api.instagram.com/oauth/authorize/',
      tokenURL:         'https://api.instagram.com/oauth/access_token',
      profileURL:       'https://api.instagram.com/v1/users/self',
      mapping: {
        id:                'data.id',
        name:              'data.fullname',
        preferredUsername: 'data.username',
        picture:           'data.profile_picture',
        website:           'data.website',
      }
    },

    soundcloud: {
      name:             'soundcloud',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://soundcloud.com/connect',
      tokenURL:         'https://api.soundcloud.com/oauth2/token',
      profileURL:       'https://api.soundcloud.com/me.json',
      accessTokenName:  'oauth_token',
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
      name:             'twitch',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://api.twitch.tv/kraken/oauth2/authorize',
      tokenURL:         'https://api.twitch.tv/kraken/oauth2/token',
      profileURL:       'https://api.twitch.tv/kraken/user',
      authMethod:       'OAuth',
      useAuthorizationHeaderforGET: true,
      mapping: {
        id:       '_id',
        name:     'name',
        profile:  '_links.self',
      }
    },

    wordpress: {
      name:             'wordpress',
      protocol:         'OAuth 2.0',
      authorizationURL: 'https://public-api.wordpress.com/oauth2/authorize',
      tokenURL:         'https://public-api.wordpress.com/oauth2/token',
      profileURL:       'https://public-api.wordpress.com/rest/v1/me',
      useAuthorizationHeaderforGET: true,
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

  // This is a list of user configured providers with credentials and metadata
  var configuredProviders = (function () {

    var providers = [];

    if (config.providers) {

      Object.keys(config.providers).forEach(function (name) {
        var opts = {}
          , info = providerMetadata[name]
          , conf = config.providers[name]
          ;

        // merge provider metadata with configuration and universal defaults
        var provider = _.extend(opts, info, conf, {
          callbackURL: config.issuer + '/connect/' + name + '/callback',
          passReqToCallback: true
        });

        if (!provider.customHeaders) { provider.customHeaders = {}; }
        provider.customHeaders['User-Agent'] = 'anvil-connect';

        providers.push(provider);
      });

    }

    return providers;
  })();


  var InternalOAuthError = require('passport-oauth').InternalOAuthError;

  var PassportStrategies = {
    "OAuth":     require('passport-oauth').OAuthStrategy,
    "OAuth 2.0": require('passport-oauth').OAuth2Strategy,
  };

  function OAuthCallback (request, token, secret, profile, done) {
    // ...
  }

  function OAuth2Callback (request, accessToken, refreshToken, profile, done) {
    User.connect({
      provider:  profile.provider,
      user:      request.user,
      token:     accessToken,
      profile:   profile
    }, function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }


  var map = require('../node_modules/modinha/lib/initialize').map
  function OAuth2Profile (provider) {
    return function (accessToken, done) {
      var profileURL = provider.profileURL;

      // Required by Foursquare
      if (this._apiVersion) {
        profileURL += '?v=' + this._apiVersion;
      }

      this._oauth2.get(profileURL, accessToken, function (err, body, res) {
        if (err) {
          return done(new InternalOAuthError('failed to fetch profile', err));
        }

        // parse userInfo response and map to our own user schema
        try {
          var json    = JSON.parse(body)
            , profile = { provider: provider.name }
            ;

          console.log('PROFILE', json)
          map(provider.mapping, json, profile)
          done(null, profile);
        } catch (e) {
          done(e);
        }
      });
    };
  }


  var PassportProfiles = {
    "OAuth 2.0": OAuth2Profile
  };

  var PassportCallbacks = {
    "OAuth":     OAuthCallback,
    "OAuth 2.0": OAuth2Callback,
  };


  configuredProviders.forEach(function (provider) {
    // eventually we can drop this `if` wrapper
    if ([
          'dropbox',
          'github',
          'facebook',
          'google',
          'instagram',
          'foursquare',
          'soundcloud',
          'twitch',
          'wordpress'
    ].indexOf(provider.name) !== -1) {
      var name       = provider.name
        , superclass = PassportStrategies[provider.protocol]
        , callback   = PassportCallbacks[provider.protocol]
        , getProfile = PassportProfiles[provider.protocol](provider)
        ;

      // Define a new strategy for the provider
      var strategy = function (options, verify) {
        superclass.call(this, options, verify);
        this.name = name;

        if (options.useAuthorizationHeaderforGET) {
          this._oauth2.useAuthorizationHeaderforGET(true);
        }

        if (options.authMethod) {
          this._oauth2.setAuthMethod(options.authMethod)
        }

        if (options.accessTokenName) {
          this._oauth2.setAccessTokenName(options.accessTokenName);
        }

        this._apiVersion = options.apiVersion;
      };

      // Inherit from base strategy
      util.inherits(strategy, superclass);

      // define user profile method
      strategy.prototype.userProfile = getProfile;

      // register the strategy with passport
      passport.use(new strategy(provider, callback));
    }
  });

};
