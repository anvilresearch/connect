---
title: CLI Reference
---

## Install CLI

The `nv` command aims to provide control over every aspect of your server. It should be run from the root of your project directory. You can get it by installing Anvil Connect globally via npm:

```bash
$ npm install -g anvil-connect
```



## Manage Resources

There are a set a CRUD commands for managing resources on the server including users, clients, roles, and scopes.

```bash
$ nv ls <user|client|role|scope>
$ nv get <user|client|role|scope> <_id|email>
$ nv add <user|client|role|scope> <json>
$ nv update <user|client|role|scope> <_id|email> <json>
$ nv rm <user|client|role|scope> <_id|email>
```

## Manage Permissions

You can manage user and client RBAC permissions with `assign`, `revoke`, `permit`, and `forbid`.

```bash
$ nv assign <email> <role>
$ nv revoke <email> <role>
$ nv permit <role> <scope>
$ nv forbid <role> <scope>
```

## Convenience commands

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

## Configuration

View Configured OpenID Provider Metadata.

```bash
$ nv config
```
