/**
 * Module dependencies
 */

var cp      = require('child_process')
  , fs      = require('fs-extra')
  , path    = require('path')
  , crypto  = require('crypto')
  , async   = require('async')
  , mkdirp  = require('mkdirp')
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

      fs.outputJSON(file, obj, { spaces: 2 }, function (err) {
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
  fs.exists('connect/config/keys', function (exists) {
    if (exists) {
      console.log('* RSA key pair already initialized.');
      return done();
    }

    cp.exec('openssl genrsa 2048', function (err, stdout, stderr) {
      if (err) { return done(err); }

      fs.outputFile('connect/config/keys/private.pem', stdout, function (err) {
        if (err) { return done(err); }

        var cmd = 'openssl rsa -in connect/config/keys/private.pem -pubout';
        cp.exec(cmd, function (err, stdout, stderr) {
          if (err) { return done(err) }

          fs.outputFile('connect/config/keys/public.pem', stdout, function (err) {
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

  mkdirp.sync('connect');
  mkdirp.sync('nginx');
  mkdirp.sync('nginx/conf.d');
  mkdirp.sync('nginx/logs');
  mkdirp.sync('redis');
  mkdirp.sync('redis/etc');

  async.series([

    gitInit,

    // initialize npm package
    safeJSON('connect/package.json', {
      name:          process.cwd().split('/').pop(),
      version:      '0.0.0',
      description:  'Anvil Connect Deployment',
      private:       true,
      main:         'server.js',
      scripts: {
        start:      'node server.js'
      },
      engines: {
        node:       '>=0.12.0'
      },
      dependencies: {
        'anvil-connect': require(path.join(__dirname, '../../package.json')).version
      }
    }),

    // initialize bower package
    safeJSON('connect/bower.json', {
      name:         process.cwd().split('/').pop(),
      version:      '0.0.0',
      description:  'Anvil Connect Deployment',
      private:       true,
      ignore: [
        "**/.*",
        "node_modules",
        "public/vendor",
        "test"
      ],
      dependencies: {
        "crypto-js": "~3.1.4",
        "event-source-polyfill": "~0.0.4"
      }
    }),

    // initialize development configuration
    safeJSON('connect/config/development.json', {
      issuer: 'http://localhost:3000',
      client_registration: 'scoped',
      providers: {
        password: true,
        google: {
          client_id: 'CLIENT_ID',
          client_secret: 'CLIENT_SECRET',
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
          ]
        }
      },
      cookie_secret: crypto.randomBytes(10).toString('hex'),
      session_secret: crypto.randomBytes(10).toString('hex'),
    }),

    // initialize production configuration
    safeJSON('connect/config/production.json', {
      issuer: 'https://your.authorization.server',
      client_registration: 'scoped',
      providers: {
        password: true,
        google: {
          client_id: 'CLIENT_ID',
          client_secret: 'CLIENT_SECRET',
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
          ]
        }
      },
      cookie_secret: crypto.randomBytes(10).toString('hex'),
      session_secret: crypto.randomBytes(10).toString('hex'),
      redis: {
        url: 'redis://redis:6379'
      }
    }),

    // copy default files and directories
    safeCopy(path.join(__dirname, 'deployment/docker-compose.yml'), 'docker-compose.yml'),
    safeCopy(path.join(__dirname, 'deployment/connect/Dockerfile'), 'connect/Dockerfile'),
    safeCopy(path.join(__dirname, 'deployment/connect/server.js'), 'connect/server.js'),
    safeCopy(path.join(__dirname, 'deployment/connect/bowerrc'), 'connect/.bowerrc'),
    safeCopy(path.join(__dirname, 'deployment/gitignore'), '.gitignore'),
    safeCopy(path.join(__dirname, '../../views'), 'connect/views'),
    safeCopy(path.join(__dirname, '../../public/images'), 'connect/public/images'),
    safeCopy(path.join(__dirname, '../../public/javascript'), 'connect/public/javascript'),
    safeCopy(path.join(__dirname, '../../public/stylesheets'), 'connect/public/stylesheets'),

    // nginx
    safeCopy(path.join(__dirname, 'deployment/nginx/Dockerfile'), 'nginx/Dockerfile'),
    safeCopy(path.join(__dirname, 'deployment/nginx/nginx.conf'), 'nginx/nginx.conf'),
    safeCopy(path.join(__dirname, 'deployment/nginx/conf.d/default.conf'), 'nginx/conf.d/default.conf'),
    safeCopy(path.join(__dirname, 'deployment/nginx/certs'), 'nginx/certs'),

    // redis
    safeCopy(path.join(__dirname, 'deployment/redis/Dockerfile'), 'redis/Dockerfile'),
    safeCopy(path.join(__dirname, 'deployment/redis/etc/redis.conf'), 'redis/etc/redis.conf'),

    // generate rsa key pair
    rsaKeys

  ], function (err, result) {
    fs.readFile(path.join(__dirname, 'docs/post-init-deployment.txt'), 'utf-8', function (err, file) {
      console.log(file);
      process.exit();
    });
  });

};
