/**
 * Module dependencies
 */

var client                = require('../boot/redis')
  , mailer                = require('../boot/mailer')
  , settings              = require('../boot/settings')
  , providers             = require('../providers')
  , bcrypt                = require('bcrypt')
  , qs                    = require('qs')
  , url                   = require('url')
  , CheckPassword         = require('mellt').CheckPassword
  , Modinha               = require('modinha')
  , Document              = require('modinha-redis')
  , PasswordRequiredError = require('../errors/PasswordRequiredError')
  , InsecurePasswordError = require('../errors/InsecurePasswordError')
  ;


/**
 * User model
 */

var User = Modinha.define('users', {

  // OpenID Connect Standard Claims
  //
  // NOTE: The "sub" claim is stored as `_id`.
  //       Expose it as `sub` via mappings.
  name:                 { type: 'string' },
  givenName:            { type: 'string' },
  familyName:           { type: 'string' },
  middleName:           { type: 'string' },
  nickname:             { type: 'string' },
  preferredUsername:    { type: 'string' },
  profile:              { type: 'string' },
  picture:              { type: 'string' },
  website:              { type: 'string' },
  email:                {
                          type:     'string',
                          //required: true,
                          unique:   true,
                          format:   'email'
                        },
  emailVerified:        { type: 'boolean', default: false },
  dateEmailVerified:    { type: 'number' },
  emailVerifyToken:     {
                          type: 'string',
                          unique: true
                        },
  gender:               { type: 'string' },
  birthdate:            { type: 'string' },
  zoneinfo:             { type: 'string' },
  locale:               { type: 'string' },
  phoneNumber:          { type: 'string' },
  phoneNumberVerified:  { type: 'boolean', default: false },
  address:              { type: 'object' },

  // Hashed password
  hash:                 {
                          type:    'string',
                          private: true,
                          set:     hashPassword
                        },


  /**
   * Each provider object in user.providers should include
   *  - Provider user/account id
   *  - Name of provider
   *  - Protocol of provider
   *  - Complete authorization response from provider
   *  - Complete userInfo response from the provider
   *  - Last login time
   *  - Last login provider
   */

  providers: {
    type: 'object',
    default: {},
    set: function (data) {
      var providers = this.providers = this.providers || {};
      Object.keys(data.providers || {}).forEach(function (key) {
        providers[key] = data.providers[key];
      });
    }
  },

  // supports indexing user.providers.PROVIDER.info.id
  lastProvider: {
    type: 'string'
  }

});


/**
 * Hash Password Setter
 */

function hashPassword (data) {
  var password = data.password
    , hash     = data.hash
    ;

  if (password) {
    var salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);
  }

  this.hash = hash;
}


/**
 * UserInfo Mapping
 */

User.mappings.userinfo = {
  '_id':                  'sub',
  'name':                 'name',
  'givenName':            'given_name',
  'familyName':           'family_name',
  'middleName':           'middle_name',
  'nickname':             'nickname',
  'preferredUsername':    'preferred_username',
  'profile':              'profile',
  'picture':              'picture',
  'website':              'website',
  'email':                'email',
  'emailVerified':        'email_verified',
  'gender':               'gender',
  'birthdate':            'birthdate',
  'zoneinfo':             'zoneinfo',
  'locale':               'locale',
  'phoneNumber':          'phone_number',
  'phoneNumberVerified':  'phone_number_verified',
  'address':              'address',
  'created':              'joined_at',
  'modified':             'updated_at'
};


/**
 * Document persistence
 */

User.extend(Document);
User.__client = client;


/**
 * User intersections
 */

User.intersects('roles');


/**
 * Authorized scope
 */

User.prototype.authorizedScope = function (callback) {
  var client   = User.__client
    , defaults = ['openid', 'profile']
    ;

  client.zrange('users:' + this._id + ':roles', 0, -1, function (err, roles) {
    if (err) { return callback(err); }

    if (!roles || roles.length === 0) {
      return callback(null, defaults);
    }

    var multi = client.multi();

    roles.forEach(function (role) {
      multi.zrange('roles:' + role + ':scopes', 0, -1);
    });

    multi.exec(function (err, results) {
      if (err) { return callback(err); }
      callback(null, [].concat.apply(defaults, results));
    });

  });
};


/**
 * Verify password
 */

User.prototype.verifyPassword = function (password, callback) {
  if (!this.hash) { return callback(null, false); }
  bcrypt.compare(password, this.hash, callback);
};


/**
 * Create
 */

User.insert = function (data, options, callback) {
  var collection = User.collection;

  if (!callback) {
    callback = options;
    options = {};
  }

  if (options.password !== false) {
    // require a password
    if (!data.password) {
      return callback(new PasswordRequiredError());
    }

    // check the password strength
    var daysToCrack = providers.password.daysToCrack;
    if (CheckPassword(data.password) <= daysToCrack) {
      return callback(new InsecurePasswordError());
    }
  }

  // create an instance
  var user = User.initialize(data, { private: true })
    , validation = user.validate()
    ;

  // pick up mapped values
  if (options.mapping) {
    user.merge(data, { mapping: options.mapping });
  }

  // require a valid user
  if (!validation.valid) {
    return callback(validation);
  }

  // catch duplicate values
  User.enforceUnique(user, function (err) {
    if (err) { return callback(err); }

    // batch operations
    var multi = User.__client.multi()

    // store the user
    multi.hset(collection, user._id, User.serialize(user))

    // index the user
    User.index(multi, user);

    // execute ops
    multi.exec(function (err) {
      if (err) { return callback(err); }
      callback(null, User.initialize(user));
    });
  });
};


/**
 * Authenticate
 */

User.authenticate = function (email, password, callback) {
  User.getByEmail(email, { private: true }, function (err, user) {
    if (!user) {
      return callback(null, false, {
        message: 'Unknown user.'
      });
    }

    user.verifyPassword(password, function (err, match) {
      if (match) {
        callback(null, User.initialize(user), {
          message: 'Authenticated successfully!'
        });
      } else {
        callback(null, false, {
          message: 'Invalid password.'
        });
      }
    })
  })
};



/**
 * Lookup
 *
 * Takes a request object and third party userinfo
 * object and provides either an authenticated user
 * or attempts to lookup the user based on a provider
 * param in the request and a provider id in the
 * userinfo.
 */

User.lookup = function (req, info, callback) {
  if (req.user) { return callback(null, req.user); }

  var provider = req.params.provider || req.body.provider
    , index = User.collection + ':' + provider
    ;

  User.__client.hget(index, info.id, function (err, id) {
    if (err) { return callback(err); }

    User.get(id, function (err, user) {
      if (err) { return callback(err); }
      callback(null, user);
    });
  });
};


/**
 * Index provider user id
 *
 * This index matches a provider's user id to an
 * Anvil Connect `user._id` for later lookup by
 * that provider identifier.
 *
 * This is a tricky index to implement, because we
 * don't know the full path ahead of time, so we'll
 * need to first resolve it.
 *
 * Support for this requirement was added to modinha-redis
 * for this specific index. The nested array that
 * defines `field` gets evaluated first. That value at
 * that path is then used as a property name to access
 * the id.
 */

User.defineIndex({
  type:   'hash',
  key:    [User.collection + ':$', 'lastProvider'],
  field:  ['$', ['providers.$.info.id', 'lastProvider']],
  value:  '_id'
});


/**
 * Connect
 */

User.connect = function (req, auth, info, callback) {
  var provider = providers[req.params.provider || req.body.provider];
  // what if there's no provider param?

  // Try to find an existing user.
  User.lookup(req, info, function (err, user) {
    if (err) { return callback(err); }

    // Initialize the user data.
    var data = {
      providers: {},
      lastProvider: provider.id
    };

    // Set the provider object
    data.providers[provider.id] = {
      provider: provider.id,
      protocol: provider.protocol,
      auth:     auth,
      info:     info,
    };

    // Update an existing user with the authorization response
    // and userinfo from this provider. By default this will not
    // update existing OIDC standard claims values. If
    // `refresh_userinfo` is set to `true`, in the configuration
    // file, claims will be updated.
    if (user) {
      if (settings.refresh_userinfo || provider.refresh_userinfo) {
        Modinha.map(provider.mapping, info, data);
      }

      User.patch(user._id, data, function (err, user) {
        if (err) { return callback(err); }
        callback(null, user);
      })
    }

    // Create a new user based on this provider's response. This
    // WILL map from the provider's raw userInfo properties into the
    // user's OIDC standard claims.
    else {
      Modinha.map(provider.mapping, info, data);

      User.insert(data, {
        password: false,
      }, function (error, user) {

        // Handle unique email error
        if (error && error.message === 'email must be unique') {

          // Lookup the existing user
          User.getByEmail(data.email, function (err, user) {
            if (err || !user) { return callback(err); }

            return callback(null, false, {
              message: error.message,
              providers: user.providers
            });

          });
        }

        // Handle other error
        else if (error) {
          return callback(error);
        }

        // User registered successfully
        else {
          req.sendVerificationEmail = req.provider.emailVerification.enable;
          req.flash('isNewUser', true);
          callback(null, user, { message: 'Registered successfully' });
        }
      });
    }

  });
};


/**
 * Errors
 */

User.PasswordRequiredError = PasswordRequiredError;
User.InsecurePasswordError = InsecurePasswordError;


/**
 * Exports
 */

module.exports = User;
