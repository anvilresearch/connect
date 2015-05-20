---
title: Get Started
---

## Install the CLI

Anvil Connect is built with the latest versions of [Node.js](https://nodejs.org/) (0.12.x) and [Redis](http://redis.io/) (3.0.x). You'll need these installed on your system before you can run the server. Then you can get started by installing the CLI using npm.

```
$ npm install -g anvil-connect
```

## Initialize a project

### Generate deployment

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

### Install Dependencies

Now you can install npm and bower dependencies.

```bash
$ npm install
$ bower install
```

### Initialize the database

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



## Run your server

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


## Register your apps

Now you can register your apps and start authenticating users. This can be done over HTTP with the `/register` endpoint, but the quickest way to get started is with the CLI.

```bash
$ nv add client '{ "client_name": "YOUR APP NAME", "client_uri": "http://localhost:9000", "redirect_uris": ["http://localhost:9000/callback"], "post_logout_redirect_uris": ["http://localhost:9000"], "trusted": "true" }'
```

### IMPORTANT!

Remember to keep your `client_secret` a secret. Never share client credentials between apps. Always register a new client for each app.
