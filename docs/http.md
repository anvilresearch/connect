---
title: HTTP API
---

## Auth Endpoints
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

## REST Endpoints
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
