---
title: Configure
---

## JSON files {#json-files}

Anvil Connect loads it's configuration from a JSON file in the `config` directory of the current working directory for the process. File names must match the `NODE_ENV` value. If `NODE_ENV` is not set, `config/development.json` will be loaded.

## Key pairs

If you generated a deployment repository with `nv init`, a new RSA key pair will be generated for you in `config/keys`. This pair of files is required for signing and verifying tokens. We recommend using the generated files. If you want to provide your own, you can obtain them using OpenSSL.

```
$ cd PROJECT_ROOT
$ mkdir -p config/keys
$ openssl genrsa -out config/keys/private.pem 2048
$ openssl rsa -pubout -in config/keys/private.pem -out config/keys/public.pem
```

## Settings


### REQUIRED



#### issuer

Fully qualified base uri of the authorization server; e.g., <code>https://accounts.anvil.io</code>


#### cookie_secret


#### session_secret


#### providers

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






### OPTIONAL

#### port
An integer value representing the port the server will be bound to, unless a <code>PORT</code> environment variable is provided. Defaults to <code>3000</code>.


#### client_registration

Anvil Connect can be configured for three types of client registration: `dynamic`, `token`, or `scoped`, each being more restrictive than the previous option. The default `client_registration` type is `scoped`.

#### trusted_registration_scope

#### redis

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

#### logger

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


### Client Registration

Anvil Connect can be configured for three types of client registration: `dynamic`, `token`, or `scoped`, each being more restrictive than the previous option. The default `client_registration` type is `scoped`.

#### Dynamic Client Registration

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


#### Token-restricted Registration

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

#### Scoped Registration

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



## OpenID Metadata

OpenID Metadata Default Values can be overridden by defining them in the configuration file. Don't change these unless you know what you're doing.
