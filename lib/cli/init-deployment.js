/**
 * Module dependencies
 */

var cp      = require('child_process')
  , fs      = require('fs-extra')
  , path    = require('path')
  , crypto  = require('crypto')
  , async   = require('async')
  ;


/**
 * Initialize Git Repository
 */

function gitInit (done) {
  fs.exists('.git', function (exists) {
    if (exists) {
      console.log('* Git repository already initialized.');
      return done();
    }

    cp.exec('git init', function (err, stdout, stderr) {
      console.log('* Initialized git repository');
      done(err);
    });
  });
}


/**
 * Safe JSON
 */

function safeJSON (file, obj) {
  return function (done) {
    fs.exists(file, function (exists) {
      if (exists) {
        console.log('* %s already initialized.', file);
        return done();
      }

      fs.outputJSON(file, obj, function (err) {
        console.log('* Generated %s', file);
        done(err);
      });
    })
  };
}

/**
 * Safe copy files and directories
 */

function safeCopy (from, to) {
  return function (done) {
    fs.exists(to, function (exists) {
      if (exists) {
        console.log('* %s already initialized.', to);
        return done();
      }

      fs.copy(from, to, function (err) {
        console.log('* Generated %s', to);
        done(err);
      });
    });
  };
}


/**
 * Generate RSA Key Pair
 */

function rsaKeys (done) {
  fs.exists('keys', function (exists) {
    if (exists) {
      console.log('* RSA key pair already initialized.');
      return done();
    }

    cp.exec('openssl genrsa 2048', function (err, stdout, stderr) {
      if (err) { return done(err); }

      fs.outputFile('keys/private.pem', stdout, function (err) {
        if (err) { return done(err); }

        var cmd = 'openssl rsa -in keys/private.pem -pubout';
        cp.exec(cmd, function (err, stdout, stderr) {
          if (err) { return done(err) }

          fs.outputFile('keys/public.pem', stdout, function (err) {
            if (err) { return done(err); }

            console.log('* Generated RSA keypair');
            done();
          });
        });
      });
    });
  });
}


/**
 * Export
 */

module.exports = function (argv) {

  console.log();
  console.log('Initializing Anvil Connect deployment repository:');
  console.log();

  async.series([

    gitInit,

    // initialize npm package
    safeJSON('package.json', {
      name:          process.cwd().split('/').pop(),
      version:      '0.0.0',
      description:  'Anvil Connect Deployment',
      private:       true,
      main:         'server.js',
      scripts: {
        start:      'node server.js'
      },
      dependencies: {
        'anvil-connect': '0.1.3'
      }
    }),

    // initialize development configuration
    safeJSON('config.development.json', {
      issuer: 'http://localhost:3000',
      client_registration: 'scoped',
      cookie_secret: crypto.randomBytes(10).toString('hex'),
      session_secret: crypto.randomBytes(10).toString('hex'),
      keypair: {
        private: 'keys/private.pem',
        public: 'keys/public.pem'
      }
    }),

    // initialize production configuration
    safeJSON('config.production.json', {
      issuer: 'https://your.authorization.server',
      client_registration: 'scoped',
      providers: {
        google: {
          clientID: 'CLIENT_ID',
          clientSecret: 'CLIENT_SECRET',
          callbackURL: 'https://YOUR.AUTH.SERVER/connect/google/callback',
          passReqToCallback: true,
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
          ]
        }
      },
      cookie_secret: crypto.randomBytes(10).toString('hex'),
      session_secret: crypto.randomBytes(10).toString('hex'),
      redis: {
        url: 'redis://HOST:PORT',
        auth: 'PASSWORD'
      }
    }),

    // copy default files and directories
    safeCopy(path.join(__dirname, 'deployment/server.js'), 'server.js'),
    safeCopy(path.join(__dirname, '../../views'), 'views'),
    safeCopy(path.join(__dirname, '../../public'), 'public'),
    safeCopy(path.join(__dirname, 'deployment/.gitignore'), '.gitignore'),

    // generate rsa key pair
    rsaKeys

  ], function (err, result) {
    fs.readFile(path.join(__dirname, 'help/post-init-deployment.txt'), 'utf-8', function (err, file) {
      console.log(file);
      process.exit();
    });
  });

};
