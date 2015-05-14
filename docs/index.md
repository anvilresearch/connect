---
title: "Anvil Connect"
---
## Overview

Lorem quae unde impedit numquam qui consectetur quia dolore ea quibusdam placeat architecto dolor? Illo deserunt nobis at magni natus deserunt aperiam deserunt iure quos velit aliquam quibusdam tempora? Voluptatem.

Sit facere voluptatibus veritatis voluptates saepe, molestiae. Dicta placeat molestias dicta beatae accusantium, consequuntur rerum quis nobis temporibus doloribus architecto dignissimos autem consectetur quia. Autem pariatur perspiciatis adipisci minus provident?

Adipisicing sed aspernatur laudantium provident rem aspernatur. Doloribus provident quidem molestias laboriosam perferendis placeat modi saepe quas. Voluptatum illum blanditiis quam nobis sapiente. Nihil ex placeat officiis qui adipisci quis.


## Get Started

### Install the CLI

Anvil Connect is built with the latest versions of [Node.js](https://nodejs.org/) (0.12.x) and [Redis](http://redis.io/) (3.0.x). You'll need these installed on your system before you can run the server. Then you can get started by installing the CLI using npm.

```
$ npm install -g anvil-connect
```

### Initialize a project

#### Generate deployment

Once you have installed the CLI, make a new directory and initialize your project.

```
$ mkdir path/to/project && cd $_
$ nv init
```

This will generate a file tree that looks something like this:

```
├── .bowerrc
├── .git
├── .gitignore
├── Dockerfile
├── bower.json
├── config
│   ├── development.json
│   ├── keys
│   │   ├── private.pem
│   │   └── public.pem
│   └── production.json
├── package.json
├── public
│   ├── images
│   │   └── anvil.svg
│   ├── javascript
│   │   └── session.js
│   └── stylesheets
│       └── app.css
├── server.js
└── views
    ├── authorize.jade
    ├── session.jade
    ├── signin.jade
    └── signup.jade
```

Anvil Connect aims to be easily customizable. Using a deployment repository allows you to serve your own static assets, customize views (HTML templates), manage dependencies and keep your configuration under version control. It also makes upgrading Anvil Connect as simple as changing the version number in `package.json`.

#### Install Dependencies

Now you can install npm and bower dependencies.

```bash
$ npm install
$ bower install
```

#### Initialize the database

If you're using a fresh Redis installation running on `localhost` and you're ok with using the default (preferably empty) database, there's nothing to configure. If you're using a remote Redis instance, your instance requires a password, or you want to use a database other than `0`, [edit the config file](#redis) for the environment you're preparing (development or production).

Then, to initialize your development database, run:

```bash
$ nv migrate
```

To initialize a production database, run:

```bash
$ NODE_ENV=production nv migrate
```

This will create default clients, roles, scopes and permissions necessary to operate the authorization server.



### Run your server

Run the authorization server in `development` mode:

```bash
# Any of the following are equivalent
$ nv serve
$ node server.js
$ npm start
```

To run the server in production, set `NODE_ENV`:

```bash
# Any of the following are equivalent
$ nv serve --production
$ node server.js -e production
$ NODE_ENV=production node server.js
```


### Register your apps

Now you can register your apps and start authenticating users. This can be done over HTTP with the `/register` endpoint, but the quickest way to get started is with the CLI.

```bash
$ nv add client '{ "client_name": "YOUR APP NAME", "client_uri": "http://localhost:9000", "redirect_uris": ["http://localhost:9000/callback"], "post_logout_redirect_uris": ["http://localhost:9000"], "trusted": "true" }'
```

#### IMPORTANT!

Remember to keep your `client_secret` a secret. Never share client credentials between apps. Always register a new client for each app.



## Configure

### JSON files {#json-files}

Anvil Connect loads it's configuration from a JSON file in the `config` directory of the current working directory for the process. File names must match the `NODE_ENV` value. If `NODE_ENV` is not set, `config/development.json` will be loaded.

### Key pairs

If you generated a deployment repository with `nv init`, a new RSA key pair will be generated for you in `config/keys`. This pair of files is required for signing and verifying tokens. We recommend using the generated files. If you want to provide your own, you can obtain them using OpenSSL.

```
$ cd PROJECT_ROOT
$ mkdir -p config/keys
$ openssl genrsa -out config/keys/private.pem 2048
$ openssl rsa -pubout -in config/keys/private.pem -out config/keys/public.pem
```

### Settings


#### REQUIRED



##### issuer

Fully qualified base uri of the authorization server; e.g., <code>https://accounts.anvil.io</code>


##### cookie_secret


##### session_secret


##### providers

The providers setting is an object containing settings for various authentication methods.

```json
{
  // ...
  "providers": { ... }
}
```

To enable local password authentication, add a `password` property to the `providers` object with a value of `true`.

```json
{
  // ...
  "providers": {
    "password": true
  }
}
```

Most OAuth 2.0 providers only require a `client_id` and `client_secret`. You can obtain these by registering your app with the respective provider.

```json
{
  // ...
  "providers": {
    "facebook": {
      "client_id": "App ID",
      "client_secret": "App Secret"
    }
  }
}
```

OAuth 2.0 supports a `scope` authorization parameter, and some providers use it to restricted access to specific resources. You can set scope for a provider using the `scope` property with an array of strings. See provider API documentation for specifics.

```json
{
  //...
  "providers": {
    "google": {
      "client_id": "Client ID",
      "client_secret": "Client secret",
      "scope": [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    },
    "linkedin": {
      "client_id": "Client ID",
      "client_secret": "Client Secret",
      "scope": [
        "r_basicprofile",
        "r_fullprofile",
        "r_emailaddress",
        "r_network",
        "r_contactinfo"
      ]
    }
  }
}
```

OAuth 1.0 providers require `oauth_consumer_key` and `oauth_consumer_secret`.


```json
{
  //...
  "providers": {
    "twitter": {
      "oauth_consumer_key": "Consumer Key (API Key)",
      "oauth_consumer_secret": "Consumer Secret"
    }
  }
}
```

You can see all the natively supported providers in the [providers directory](https://github.com/anvilresearch/connect/tree/master/providers) in the Anvil Connect repository on GitHub. If you want to use an OAuth provider not listed there, you can easily add support in your instance by creating a simple configuration file in a providers directory in your project repository.






#### OPTIONAL

##### port
An integer value representing the port the server will be bound to, unless a <code>PORT</code> environment variable is provided. Defaults to <code>3000</code>.


##### client_registration

Anvil Connect can be configured for three types of client registration: `dynamic`, `token`, or `scoped`, each being more restrictive than the previous option. The default `client_registration` type is `scoped`.

##### trusted_registration_scope

##### redis

Anvil Connect requires access to a Redis server and uses the default host and port for a local instance. To use a remote Redis server, provide url and auth parameters.

```json
{
  // ...
  "redis": {
    "url": "redis://HOST:PORT",
    "auth": "PASSWORD"
  }
}
```

You can also provide a `db` setting (integer) if you want to use a different Redis database. By default, Redis is configured to support 16 databases (0 - 15). This can be configured in the `redis.conf` file for your Redis installation.

```json
{
  // ...
  "redis": {
    "db": 3
  }
}
```

##### logger

Anvil Connect uses [bucker](https://github.com/nlf/bucker) for logging. Any valid configuration parameters for bucker can be included in the "logger" parameter. For example:

```json
{
  // ...
  "logger": {
    "console": {
      "color": false
    },
    "syslog": {
      "host": "localhost",
      "port": 514,
      "facility": 18
    }
  }
}
```


#### Client Registration

Anvil Connect can be configured for three types of client registration: `dynamic`, `token`, or `scoped`, each being more restrictive than the previous option. The default `client_registration` type is `scoped`.

##### Dynamic Client Registration

With `client_registration` set to `dynamic`, any party can register a client with the authorization server.

Optionally, a bearer token may be provided in the authorization header per RFC6750. If a valid access token is presented with a registration request, the client will be associated with the user represented by that token.

A trusted client may be registered, however, an access token must be presented and the token must have sufficient scope to register trusted clients. The scope required to register a trusted client defaults to `realm`. This value can be configured with the `trusted_registration_scope` setting.

    // config/NODE_ENV.json
    {
      // ...
      "client_registration": "dynamic",
      "trusted_registration_scope": "register"
      // ...
    }

The following table indicates expected responses to *Dynamic Client Registration* requests.

| trusted | w/token | w/scope | response  |
|:-------:|:-------:|:-------:|----------:|
|         |         |         | 201       |
| x       |         |         | 403       |
|         | x       |         | 201       |
| x       | x       |         | 403       |
| x       | x       | x       | 201       |
|         | x       | x       | 201       |


##### Token-restricted Registration

Client registration can be restricted so that a valid user access token is required by setting `client_registration` to `token`. In this case, any request without a token will fail. As with *Dynamic Client Registration*, in order to register a trusted client, the access token must have sufficient scope.

    // config/NODE_ENV.json
    {
      // ...
      "client_registration": "token",
      "trusted_registration_scope": "realm"
      // ...
    }

| trusted | w/token | w/scope | response  |
|:-------:|:-------:|:-------:|----------:|
|         |         |         | 403       |
| x       |         |         | 403       |
|         | x       |         | 201       |
| x       | x       |         | 403       |
| x       | x       | x       | 201       |
|         | x       | x       | 201       |

##### Scoped Registration

Third party registration can be restricted altogether with the `scoped` `client_registration` setting. In this case, all registration requires a prescribed `registration_scope`.

    // config/NODE_ENV.json
    {
      // ...
      "client_registration": "scoped",
      "registration_scope": "realm"
      // ...
    }

| trusted | w/token | w/scope | response  |
|:-------:|:-------:|:-------:|----------:|
|         |         |         | 403       |
| x       |         |         | 403       |
|         | x       |         | 403       |
| x       | x       |         | 403       |
| x       | x       | x       | 201       |
|         | x       | x       | 201       |



### OpenID Metadata

OpenID Metadata Default Values can be overridden by defining them in the configuration file. Don't change these unless you know what you're doing.





## Integrate

### Registering Clients

#### Registering Clients using the CLI
#### Registering Clients with the REST API
#### Registering Clients with Dynamic Registration

### Authenticating Users

#### Server

* LAMP
* Rails
* Java
* Node.js

#### Browser

* Plain JavaScript
* AngularJS

#### Native

* Android
* iOS
* Desktop
* CLI

### Clients that play well with connect

##### Wordpress
* [Wordpress-OpenID-Connect-Login](https://github.com/jumbojett/Wordpress-OpenID-Connect-Login)

##### Drupal
* [OpenID Connect](https://www.drupal.org/project/openid_connect)

### Protecting APIs

#### Obtaining Tokens
#### Verifying Tokens

* JWTs
* Round-trip
* Libraries

### Custom authentication strategies

* Custom providers
* Custom protocols

### Middleware hooks


## Customize

### Views
### Hooks
### Providers
### Protocols


## Deploy


## HTTP API

### Auth Endpoints
  * /.well-known/openid-configuration
    * GET
  * /authorize
    * GET
    * POST
  * /connect/:provider
    * GET
  * /connect/:provider/callback
    * GET
  * /jwks
    * GET
  * /register
    * POST
  * /register/:clientId
    * GET
    * PATCH
  * /signin
    * GET
    * POST
  * /signout
    * GET
    * POST
  * /signup
    * GET
    * POST
  * /token
    * POST
  * /userinfo
    * GET
  * /verify
    * ALL

### REST Endpoints
  * /v1/clients
    * GET
    * POST
  * /v1/clients/:id
    * GET
    * PATCH
    * DELETE
  * /v1/clients/:clientId/roles
  * /v1/roles
    * GET
    * POST
  * /v1/roles/:id
    * GET
    * PATCH
    * DELETE
  * /v1/scopes
    * GET
    * POST
  * /v1/scopes/:id
    * GET
    * PATCH
    * DELETE
  * /v1/users
    * GET
    * POST
  * /v1/users/:id
    * GET
    * PATCH
    * DELETE
  * /v1/users/:userId/roles
  * /v1/...

## CLI Reference

The `nv` command aims to provide control over every aspect of your server. It should be run from the root of your project directory. You can get it by installing Anvil Connect globally via npm:

```bash
# Install CLI
$ npm install -g anvil-connect
```



### Manage Resources

There are a set a CRUD commands for managing resources on the server including users, clients, roles, and scopes.

```bash
$ nv ls <user|client|role|scope>
$ nv get <user|client|role|scope> <_id|email>
$ nv add <user|client|role|scope> <json>
$ nv update <user|client|role|scope> <_id|email> <json>
$ nv rm <user|client|role|scope> <_id|email>
```

### Manage Permissions

You can manage user and client RBAC permissions with `assign`, `revoke`, `permit`, and `forbid`.

```bash
$ nv assign <email> <role>
$ nv revoke <email> <role>
$ nv permit <role> <scope>
$ nv forbid <role> <scope>
```

### Convenience commands

The `uri` command is useful for quickly obtaining an authorization uri for experimentation and testing. This command logs a URI for the user and client to the console and also copies it to the clipboard.

```bash
$ nv uri
```

You can quickly generate and decode JWT access tokens using the `token` and `decode` commands.

```bash
$ nv token        # obtain an access token for a user
$ nv token -c     # obtain an access token for a client
$ nv decode JWT   # decode a JWT issued by your server
```

Register a user with a password based on your `gitconfig`. This can be useful for quickly creating an administrative user.

```bash
$ nv signup

# OPTIONALLY ASSIGN ADMINISTRATIVE PRIVILEGES
$ nv assign <email> authority
```

### Configuration

View Configured OpenID Provider Metadata.

```bash
$ nv config
```

## Concepts

### Security Realm

```text
                                                                       
   +-------------------------------------------------------------+     
   |                                                             |     
   |                         Security Realm                      |     
   |                          (your domain)                      |     
   |                                                             |     
   |                       +-----------------+                   |     
   |                       |                 |                   |     
   |                       |  Anvil Connect  |                   |     
   |                       |                 |                   |     
   |                       +-----------------+                   |     
   |                                                             |     
   | +---------+  +----------+ +----------+ +-------+ +--------+ |     
   | |         |  |          | |          | |       | |        | |     
   | | RESTful |  | Realtime | | HTML5/JS | |  Web  | | Native | |     
   | |   API   |  |   API    | | (static) | |  App  | | Client | |     
   | |         |  |          | |          | |       | |        | |     
   | +---------+  +----------+ +----------+ +-------+ +--------+ |     
   |                                                             |     
   +-------------------------------------------------------------+     
                                                                       
                                                                       
       +-------------+      +-------------+     +-------------+        
       |             |      |             |     |             |        
       | Third Party |      | Third Party |     | Third Party |        
       |   Web App   |      |   Web App   |     |   Web App   |        
       |             |      |             |     |             |        
       +-------------+      +-------------+     +-------------+        
                                                                       
```

### Discovery
### Dynamic Registration
### ID Token
### Access Token
### Role
### Scope
### Authorization Flows
### RBAC

## Recommended Reading

### OpenID Connect

* [OpenID Connect](http://openid.net/connect/)
* [OpenID Connect Core 1.0](http://openid.net/specs/openid-connect-core-1_0.html)
* [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
* [OpenID Connect Dynamic Client Registration 1.0](http://openid.net/specs/openid-connect-registration-1_0.html)
* [OpenID Connect Session Management 1.0 - draft 19](http://openid.net/specs/openid-connect-session-1_0.html)
* [OpenID Connect Implicit Client Implementer's Guide 1.0](http://openid.net/specs/openid-connect-implicit-1_0.html)
* [Native Applications](http://openid.net/wg/napps/)
* [OpenID Connect is Here](https://www.tbray.org/ongoing/When/201x/2014/03/01/OpenID-Connect), Tim Bray
* **RFC 5785** [Defining Well-Known Uniform Resource Identifiers (URIs)](http://tools.ietf.org/html/rfc5785)

### JSON Web Tokens

* [JSON Web Token (JWT)](http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-19)
* [JSON Web Signature (JWS)](http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-24)
* [JSON Web Encryption (JWE)](http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption-24)
* [JSON Web Algorithms (JWA)](http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-24)
* [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key-24)
* [Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/accounts/docs/OAuth2ServiceAccount)
* [Secure Messaging vs. Javascript Object Signing and Encryption](http://manu.sporny.org/2013/sm-vs-jose/)
* **GitHub** [brianloveswords / node-jwa](https://github.com/brianloveswords/node-jwa)
* **GitHub** [Anvil Connect JWT](https://github.com/christiansmith/anvil-connect/blob/master/lib/JWT.js)
* **GitHub** [hokaccha / node-jwt-simple](https://github.com/hokaccha/node-jwt-simple)
* **GitHub** [berngp / node-green-jwt](https://github.com/berngp/node-green-jwt)
* **GitHub** [kjur / jsjws](https://github.com/kjur/jsjws)
* **GitHub** [davedoesdev / node-jsjws](https://github.com/davedoesdev/node-jsjws)

### OAuth 2.0

* **RFC 6749** [The OAuth 2.0 Authorization Framework](http://tools.ietf.org/html/rfc6749)
* **RFC 6750** [The OAuth 2.0 Authorization Framework: Bearer Token Usage](http://tools.ietf.org/html/rfc6750)
* **RFC 6819** [OAuth 2.0 Threat Model and Security Considerations](http://tools.ietf.org/html/rfc6819)
* [Assertion Framework for OAuth 2.0 Client Authentication and Authorization Grants](http://tools.ietf.org/html/draft-ietf-oauth-assertions-15)
* [JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants](http://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-08)

### Browser State

* **RFC 6265** [HTTP State Management Mechanism](http://tools.ietf.org/html/rfc6265)


### Claims-Based Identity and Access Control

* [Claims-based identity (Wikipedia)](http://en.wikipedia.org/wiki/Claims-based_identity)
* [A Guide to Claims-Based Identity and Access Control (2nd Edition)](http://msdn.microsoft.com/en-us/library/ff423674.aspx)

### Webfinger

* **RFC 7033** [WebFinger](http://tools.ietf.org/html/rfc7033)
* [Bootstrapping WebFinger decentralized discovery with WebFist](http://www.onebigfluke.com/2013/06/bootstrapping-webfinger-with-webfist.html)

### Cryptography

* [Handbook of Applied Cryptography](http://cacr.uwaterloo.ca/hac/)
* [An Introduction to the OpenSSL command line tool](http://users.dcc.uchile.cl/~pcamacho/tutorial/crypto/openssl/openssl_intro.html)
* [The anatomy of a Firebase client-side session (Stack Overflow)](http://stackoverflow.com/questions/20436325/the-anatomy-of-a-firebase-client-side-session)
* [Stanford Javascript Crypto Library](http://bitwiseshiftleft.github.io/sjcl/) [GitHub](https://github.com/bitwiseshiftleft/sjcl)
* [Symmetric Cryptography in Javascript (pdf)](http://bitwiseshiftleft.github.io/sjcl/acsac.pdf)
* [crypto-js](https://code.google.com/p/crypto-js/)
* [Understanding JavaScript Cryptography using Stanford Javascript Crypto Library](http://stackoverflow.com/questions/15219892/understanding-javascript-cryptography-using-stanford-javascript-crypto-library)
* **W3C** [Web Cryptography API](http://www.w3.org/TR/WebCryptoAPI/)
* [What's wrong with in-browser cryptography?](http://tonyarcieri.com/whats-wrong-with-webcrypto)
* [The anatomy of a bad idea](http://blog.cryptographyengineering.com/2012/12/the-anatomy-of-bad-idea.html)
* http://en.wikipedia.org/wiki/PBKDF2
* [Javascript Cryptography Considered Harmful](http://www.matasano.com/articles/javascript-cryptography/)
* [The Matasano Crypto Challenges](http://www.matasano.com/articles/crypto-challenges/)
* [The Matasano Crypto Challenges (Pinboard)](https://blog.pinboard.in/2013/04/the_matasano_crypto_challenges/)
* **RFC 3447** [Public-Key Cryptography Standards (PKCS) #1: RSA Cryptography Specifications Version 2.1](http://tools.ietf.org/html/rfc3447)
* Description of [RSAES-OAEP](http://tools.ietf.org/html/rfc3447#section-7.1) algorithm required for JWE
* [RSA PCKS1 v2.1 RSAES-OAEP algorithm](http://crypto.stackexchange.com/questions/10145/rsa-pcks1-v2-1-rsaes-oaep-algorithm) StackExchange Cryptography
* [RSAES-OAEP JavaScript implementation](http://webrsa.cvs.sourceforge.net/viewvc/webrsa/Client/RSAES-OAEP.js?content-type=text%2Fplain)
* [Glossary of cryptographic keys](http://en.wikipedia.org/wiki/Glossary_of_cryptographic_keys)
* [Optimal Asymmetric Encryption Padding](http://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding)
* **GitHub** [davedoesdev / simple-crypt](https://github.com/davedoesdev/simple-crypt)
* **sourceforge** [WebRSA](http://webrsa.sourceforge.net/)

### Access Control Models

* **Wikipedia** [Mandatory access control](http://en.wikipedia.org/wiki/Mandatory_access_control)
* **Wikipedia** [Discretionary access control](http://en.wikipedia.org/wiki/Discretionary_access_control)
* **Wikipedia** [Role-based access control](http://en.wikipedia.org/wiki/Role-based_access_control)
* **Wikipedia** [Group identifier](http://en.wikipedia.org/wiki/Group_identifier_(Unix))
* **Wikipedia** [Access control list](http://en.wikipedia.org/wiki/Access_control_lists)
* **Wikipedia** [File system permissions](http://en.wikipedia.org/wiki/Filesystem_permissions)
* **Wikipedia** [Attribute Based Access Control](http://en.wikipedia.org/wiki/Attribute_Based_Access_Control)

#### Role-Based Access Control

* **NIST** [An Introduction To Role-Based Access Control (NIST)](http://csrc.nist.gov/groups/SNS/rbac/documents/design_implementation/Intro_role_based_access.htm)
* **NIST** [The NIST Model for Role-Based Access Control: Towards a Unified Standard](http://csrc.nist.gov/rbac/sandhu-ferraiolo-kuhn-00.pdf) (pdf)
* [A Critique of the ANSI Standard on Role Based Access Control](https://www.cs.purdue.edu/homes/ninghui/courses/Spring06/lectures/aboutRBACStandard.pdf) (pdf)
* [Proposed NIST Standard for Role-Based Access Control](https://cs.nmt.edu/~doshin/t/s10/cs589/pub/5.Ferraiolo-NISTstdRBAC.pdf) (pdf)
* [Role-Based Access Controls, 15th National Computer Security Conference](http://arxiv.org/pdf/0903.2171.pdf)  (pdf)
* [Role-Based Access Control, Second Edition](), David F. Ferraiolo, D. Richard Kuhn, Ramaswamy Chandramouli
* [Roles vs. Groups](http://profsandhu.com/workshop/role-group.pdf) (pdf), Ravi Sandhu
* [Role Based Access Control Models](http://profsandhu.com/journals/computer/i94rbac(org).pdf) (pdf) Ravi S. Sandhu, Edward J. Coyne, Hal L. Feinstein, Charles E. Youman

#### Distributed Role-Based Access Control

* [dRBAC: Distributed Role-based Access Control for Dynamic Coalition Environments](http://www.cs.nyu.edu/vijayk/papers/drbac-icdcs02.pdf)  (pdf)
* [Cassandra: Distributed Access Control Policies with Tunable Expressiveness](http://research.microsoft.com/pubs/76082/becker04cassandra-policy2004.pdf) (pdf)
* [Role-based access control and single sign-on for Web services](http://liu.diva-portal.org/smash/record.jsf?pid=diva2:17631), Falkcrona, Jerry (Linköping University, Department of Electrical Engineering)

#### Rule-Based Access Control

* [Rule-based access control (IBM developerWorks)](http://www.ibm.com/developerworks/webservices/library/ws-soa-access/index.html)

#### Attribute Based Access Control

* **NIST** [Guide to Attribute Based Access Control (ABAC) Definition and Considerations](http://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.sp.800-162.pdf) (pdf)
* **NIST** [ABAC and RBAC: Scalable, Flexible, and Auditable Access Management](http://csrc.nist.gov/groups/SNS/rbac/documents/coyne-weil-13.pdf), Ed Coyne, DRC
Timothy R. Weil, Coalfire
* **Wikipedia** [XACML](http://en.wikipedia.org/wiki/XACML)

### Vulnerabilities

* [OAuth Security Cheatsheet](http://www.oauthsecurity.com/)
* [Heartbleed](http://heartbleed.com/)
* [Covert Redirect](http://tetraph.com/covert_redirect/oauth2_openid_covert_redirect.html) | [HN Discussion](https://news.ycombinator.com/item?id=7685677)
* [Critical vulnerabilities in JSON Web Token libraries](https://auth0.com/blog/2015/03/31/critical-vulnerabilities-in-json-web-token-libraries/)
