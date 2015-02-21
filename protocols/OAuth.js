/**
 * Module dependencies
 */

var pkg      = require('../package.json')
  , qs       = require('qs')
  , URL      = require('url')
  , util     = require('util')
  , crypto   = require('crypto')
  , request  = require('superagent')
  , map      = require('modinha').map
  , User     = require('../models/User')
  , Strategy = require('passport-strategy')
  , agent    = 'Anvil Connect/v' + pkg.version
  , nowSeconds    = require('../lib/time-utils').nowSeconds
  ;


/**
 * OAuthStrategy
 */

function OAuthStrategy (provider, client, verify) {
  Strategy.call(this);
  this.provider   = provider;
  this.endpoints  = provider.endpoints;
  this.mapping    = provider.mapping;
  this.client     = client;
  this.verify     = verify;
  this.name       = provider.id;
}

util.inherits(OAuthStrategy, Strategy);


/**
 * Verifier
 */

function verifier (req, auth, userInfo, done) {
  User.connect(req, auth, userInfo, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
};

OAuthStrategy.verifier = verifier;


/**
 * Initialize
 */

function initialize (provider, configuration) {
  return new OAuthStrategy(provider, configuration, verifier);
}

OAuthStrategy.initialize = initialize;


/**
 * Authorization Header Params
 * https://tools.ietf.org/html/rfc5849#section-3.5.1
 */

function authorizationHeaderParams (data) {
  var keys    = Object.keys(data).sort()
    , encoded = ''
    ;

  keys.forEach(function (key, i) {
    encoded += key;
    encoded += '="';
    encoded += encodeOAuthData(data[key]);
    encoded += '"';
    if (i < keys.length - 1) {
      encoded += ', ';
    }
  });

  return encoded;
}

OAuthStrategy.authorizationHeaderParams = authorizationHeaderParams;


/**
 * Encode Data
 * https://tools.ietf.org/html/rfc5849#section-3.6
 */

function encodeOAuthData (data) {
  // empty data
  if (!data || data === '') {
    return '';
  }

  // non-empty data
  else {
    return encodeURIComponent(data)
      .replace(/\!/g, "%21")
      .replace(/\'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A")
      ;
  }
}

OAuthStrategy.encodeOAuthData = encodeOAuthData;


/**
 * Timestamp
 */

function timestamp () {
  return nowSeconds();
}

OAuthStrategy.timestamp = timestamp;


/**
 * Nonce
 */

//function nonce (size) {
//  return crypto.randomBytes(size).toString('hex').slice(0, 10);
//}
var NCHARS = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n',
  'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
  'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
  'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
  '4','5','6','7','8','9'
];

function nonce (size) {
  var res = []
    , len = NCHARS.length
    , pos
    ;

  for (var i = 0; i < size; i++) {
    pos = Math.floor(Math.random() * len);
    res[i] = NCHARS[pos];
  }

  return res.join('');
}

OAuthStrategy.nonce = nonce;


/**
 * Signature Base String URI
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.1
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.2
 */

function signatureBaseStringURI (uri) {
  var url      = URL.parse(uri, true)
    , protocol = url.protocol
    , hostname = url.hostname
    , pathname = url.pathname
    , search   = url.search
    , port     = ''
    , result   = ''
    ;

  if (url.port) {
    if ((protocol === 'http:'  && url.port !== '80')
     || (protocol === 'https:' && url.port !== '443')) {
      port = ':' + url.port;
    }
  }

  if (!pathname || pathname === '') {
    pathname = '/';
  }

  result += protocol;
  result += '//';
  result += hostname;
  result += port;
  result += pathname;
  return result;
}

OAuthStrategy.signatureBaseStringURI = signatureBaseStringURI;


/**
 * Normalize Parameters
 * https://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
 */

function normalizeParameters (data) {
  var encoded    = []
    , normalized = ''
    ;

  // Convert object into nested arrays
  // and encode the keys and values.
  Object.keys(data).forEach(function (key) {
    encoded[encoded.length] = [
      encodeOAuthData(key),
      encodeOAuthData(data[key])
    ];
  });

  // Sort by keys and values
  encoded.sort(function (a, b) {
    return (a[0] === b[0])
            ? (a[1] < b[1])
               ? -1
               : 1
            : (a[0] < b[0])
               ? -1
               : 1
               ;
  });

  // Encode parameters similar to
  // query string.
  encoded.forEach(function (pair, i) {
    normalized += pair[0];
    normalized += '=';
    normalized += pair[1];
    if (i < encoded.length - 1) {
      normalized += '&';
    }
  });

  // bada boom
  return normalized;
}

OAuthStrategy.normalizeParameters = normalizeParameters;


/**
 * Signature Base String
 * https://tools.ietf.org/html/rfc5849#section-3.4.1
 */

function signatureBaseString (method, url, parameters) {
  return method.toUpperCase() + '&'
       + encodeOAuthData(signatureBaseStringURI(url)) + '&'
       + encodeOAuthData(parameters)
       ;
}

OAuthStrategy.signatureBaseString = signatureBaseString;


/**
 * Signature
 */

function sign (method, input, consumerSecret, tokenSecret) {
  var encoding = 'base64'
    , result   = ''
    , key      = encodeOAuthData(consumerSecret) + '&' +
                 encodeOAuthData(tokenSecret)
    ;

  switch (method) {

    case 'PLAINTEXT':
      result = key;
      break;

    case 'RSA-SHA1':
      result = crypto.createSign(method).update(input).sign(key, encoding);
      break;

    case 'HMAC-SHA1':
      result = crypto.createHmac('sha1', key).update(input).digest(encoding);
      break;

    default:
      // ERROR

  }

  return result;
}

OAuthStrategy.sign = sign;


/**
 * Temporary Credentials
 * https://tools.ietf.org/html/rfc5849#section-2.1
 */

function temporaryCredentials (done) {
  var strategy = this
    , provider = strategy.provider
    , endpoint = strategy.endpoints.credentials
    , client   = strategy.client
    , method   = endpoint.method && endpoint.method.toLowerCase()
    , url      = endpoint.url
    , header   = endpoint.header || 'Authorization'
    , scheme   = endpoint.scheme || 'OAuth'
    , accept   = endpoint.accept || 'application/x-www-form-urlencoded'
    , key      = client.oauth_consumer_key
    , secret   = client.oauth_consumer_secret
    , signer   = provider.oauth_signature_method || 'PLAINTEXT'
    , realm    = provider.realm
    , callback = provider.oauth_callback
    , params   = {}
    ;

  // Initialize request
  var req = request[method || 'post'](url);

  // Build request parameters
  params.oauth_consumer_key     = key;
  params.oauth_signature_method = signer;
  params.oauth_timestamp        = timestamp();
  params.oauth_nonce            = nonce(32);
  params.oauth_callback         = callback;
  params.oauth_version          = '1.0';

  // Generate signature (is next line needed for PLAINTEXT?)
  var input = signatureBaseString(method, url, normalizeParameters(params));
  params.oauth_signature = sign(signer, input, secret);

  if (realm) { params.realm = realm; }

  // Set Authorization header
  req.set(header, scheme + ' ' + authorizationHeaderParams(params));

  // Set other headers
  req.set('Accept',     accept);
  req.set('User-Agent', agent);

  // Execute request
  return req.end(function (res) {
    var response = qs.parse(res.text);

    if (res.statusCode !== 200) {
      return done(new Error(res.text));
    }

    done(null, response);
  });
}

OAuthStrategy.prototype.temporaryCredentials = temporaryCredentials;


/**
 * Resource Owner Authorization
 * https://tools.ietf.org/html/rfc5849#section-2.2
 */

function resourceOwnerAuthorization (token) {
  var strategy = this
    , endpoint = strategy.endpoints.authorization
    , url      = endpoint.url
    , param    = endpoint.param || 'oauth_token'
    ;

  strategy.redirect(url + '?' + param + '=' + token);
}

OAuthStrategy.prototype.resourceOwnerAuthorization = resourceOwnerAuthorization;


/**
 * Token Credentials
 * https://tools.ietf.org/html/rfc5849#section-2.3
 */

function tokenCredentials (authorization, secret, done) {
  var strategy = this
    , provider = strategy.provider
    , endpoint = strategy.endpoints.token
    , client   = strategy.client
    , method   = endpoint.method && endpoint.method.toLowerCase()
    , url      = endpoint.url
    , header   = endpoint.header || 'Authorization'
    , scheme   = endpoint.scheme || 'OAuth'
    , accept   = endpoint.accept || 'application/x-www-form-urlencoded'
    , key      = client.oauth_consumer_key
    , signer   = provider.oauth_signature_method || 'PLAINTEXT'
    , realm    = provider.realm
    , verifier = authorization.oauth_verifier || null
    , token    = authorization.oauth_token
    , params   = {}
    ;

  // Initialize request
  var req = request[method || 'post'](url);

  // Build request parameters
  params.oauth_consumer_key     = key;
  params.oauth_signature_method = signer;
  params.oauth_timestamp        = timestamp();
  params.oauth_nonce            = nonce(32);
  params.oauth_token            = token;
  params.oauth_verifier         = verifier;
  params.oauth_version          = '1.0';

  var input = signatureBaseString(method, url, normalizeParameters(params));
  params.oauth_signature = sign(signer, input, secret);

  // Set Authorization header
  req.set(header, scheme + ' ' + authorizationHeaderParams(params));

  // Set other headers
  req.set('Accept',     accept);
  req.set('User-Agent', agent);

  // Execute request
  return req.end(function (res) {
    var response = qs.parse(res.text)

    if (res.statusCode !== 200) {
      return done(new Error('Couldn\'t obtain token credentials'));
    }

    done(null, response);
  });
}

OAuthStrategy.prototype.tokenCredentials = tokenCredentials;


/**
 * User Info
 */

function userInfo (credentials, done) {
  var strategy = this
    , provider = strategy.provider
    , endpoint = strategy.endpoints.user
    , mapping  = strategy.mapping
    , client   = strategy.client
    , method   = endpoint.method && endpoint.method.toLowerCase()
    , url      = endpoint.url
    , header   = endpoint.header || 'Authorization'
    , scheme   = endpoint.scheme || 'OAuth'
    , key      = client.oauth_consumer_key
    , token    = credentials.oauth_token
    , secret   = client.oauth_consumer_secret
    , signer   = provider.oauth_signature_method || 'PLAINTEXT'
    , ctype    = 'application/x-www-form-urlencoded'
    , params   = {}
    ;

  var query = { user_id: credentials.user_id } // twitter specific

  // Initialize request
  var req = request[method || 'get'](url);

  req.query(query)

  // Params
  params.oauth_consumer_key     = key;
  params.oauth_signature_method = signer;
  params.oauth_timestamp        = timestamp();
  params.oauth_nonce            = nonce(32);
  params.oauth_token            = token;
  params.oauth_version          = '1.0';

  // Authenticate
  var input = signatureBaseString(
    method,
    url,
    normalizeParameters(params) + '&' +
    normalizeParameters(query)
  );

  params.oauth_signature = sign(
    signer, input, secret, credentials.oauth_token_secret
  );

  // Set Authorization header
  req.set(header, scheme + ' ' + authorizationHeaderParams(params));

  // Set other headers
  req.set('Content-Type', ctype);
  req.set('User-Agent',   agent);

  return req.end(function (res) {
    // error
    if (res.statusCode !== 200) {
      return done(
        new Error('Unable to obtain user profile.')
      );
    }

    var profile = { provider: strategy.name };
    map(mapping, res.body, profile);

    done(null, profile);
  });
}

OAuthStrategy.prototype.userInfo = userInfo;


/**
 * Authenticate
 */

function authenticate (req, options) {
  var strategy = this;

  // Handle the authorization response
  if (req.query && req.query.oauth_token) {
    if (!req.session['oauth']) {
      strategy.error(
        new Error('Failed to find request token in session')
      );
    }

    var authorization = req.query
      , secret = req.session['oauth'].oauth_token_secret
      ;

    // request token credentials
    strategy.tokenCredentials(authorization, secret, function (err, credentials) {
      if (err) { return strategy.error(err); }

      // clean up session
      delete req.session['oauth'];

      // request user info
      strategy.userInfo(credentials, function (err, profile) {
        if (err) { return strategy.error(err); }

        // invoke the callback
        strategy.verify(req, credentials, profile, function (err, user, info) {
          if (err)   { return strategy.error(err); }
          if (!user) { return strategy.fail(info); }
          strategy.success(user, info);
        });
      });
    });
  }

  // Initiate the authorization flow
  else {
    strategy.temporaryCredentials(function (err, response) {
      if (err || !response && response.oauth_token) {
        return strategy.error(
          new Error('Failed to obtain OAuth request token')
        );
      }

      // Store response in session
      if (!req.session['oauth']) { req.session['oauth'] = {}; }
      req.session['oauth'].oauth_token = response.oauth_token;
      req.session['oauth'].oauth_token_secret = response.oauth_token_secret;

      // Redirect to OAuth server
      strategy.resourceOwnerAuthorization(response.oauth_token);
    });
  }
}

OAuthStrategy.prototype.authenticate = authenticate;


/**
 * Exports
 */

module.exports = OAuthStrategy;
