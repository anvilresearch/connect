# Test dependencies
_         = require 'lodash'
nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect
FormUrlencoded = require('form-urlencoded')




# Assertions
chai.use sinonChai
chai.should()




# Code under test
OAuth2Strategy = require '../../../protocols/OAuth2'
providers = require '../../../providers'


# We need to test two things.
#   1. That the request is being formed correctly given the
#      properties of a provider and client. For this we'll
#      return a superagent request object to assert against.
#   2. That the response is handled correctly. For this we'll
#      use `nock`, to mock the HTTP service in question.

describe 'OAuth2Strategy authorizationCodeGrant', ->


  {err,res,req,provider,client,strategy,headers} = {}


  describe 'with defaults and valid parameters', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .post('/token')
                   .reply(200, { access_token: 'h3x' })
      req = strategy.authorizationCodeGrant 'r4nd0m', done

    it 'should use the specified endpoint', ->
      req.url.should.equal provider.endpoints.token.url

    it 'should use the "POST" method', ->
      req.method.should.equal 'POST'

    it 'should send the grant_type', ->
      req._data.should.contain 'grant_type=authorization_code'

    it 'should send the code', ->
      req._data.should.contain 'code=r4nd0m'

    it 'should send the redirect_uri', ->
      req._data.should.contain encodeURIComponent(provider.redirect_uri)

    it 'should set the accept header', ->
      req.req._headers['accept'].should.equal 'application/json'

    it 'should set the user agent', ->
      req.req._headers['user-agent'].should.contain 'Anvil Connect/'




  describe 'with custom method', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.token.method = 'PATCH'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .patch('/token')
        .reply(200, { access_token: 'h3x' })

      req = strategy.authorizationCodeGrant 'r4nd0m', (error, response) ->
        done()

    it 'should use the correct HTTP method', ->
      req.method.should.equal 'PATCH'




  describe 'with "client_secret_basic" auth', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.token.auth = 'client_secret_basic'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .post('/token')
        .reply(200, { access_token: 'h3x' })

      req = strategy.authorizationCodeGrant 'r4nd0m', done
      headers = req.req._headers

    it 'should set the Authorization header', ->
      expect(headers.authorization).to.be.defined

    it 'should use the Basic scheme', ->
      expect(headers.authorization).to.contain 'Basic '

    it 'should set base64 encoded credentials', ->
      expect(headers.authorization).to.contain strategy.base64credentials()




  describe 'with "client_secret_post" auth', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.token.auth = 'client_secret_post'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .post('/token')
        .reply(200, { access_token: 'h3x' })

      req = strategy.authorizationCodeGrant 'r4nd0m', done

    it 'should send the client_id', ->
      req._data.should.contain 'client_id=' + client.client_id

    it 'should send the client_secret', ->
      req._data.should.contain 'client_secret=' + client.client_secret




  describe 'with error response', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .post('/token')
        .reply(400, { error: 'oops' })

      req = strategy.authorizationCodeGrant 'r4nd0m', (error, response) ->
        err = error
        res = response
        done()

    it 'should provide an error', ->
      expect(err).to.be.an.object

    it 'should not provide a token response', ->
      expect(res).to.be.undefined




  describe 'with "x-www-form-urlencoded" response', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.token.parser = 'x-www-form-urlencoded'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .post('/token')
        .reply(200, 'access_token=t0k3n&expires=3600', {
          'content-type': 'application/x-www-form-urlencoded'
        })

      req = strategy.authorizationCodeGrant 'r4nd0m', (error, response) ->
        err = error
        res = response
        done()

    it 'should not provide an error', ->
      expect(err).to.be.null

    it 'should provide the token response', ->
      res.access_token.should.equal 't0k3n'
      res.expires.should.equal '3600'




  describe 'with "JSON" response', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .post('/token')
        .reply(200, { access_token: 'h3x' }, {
          'content-type': 'application/json'
        })

      req = strategy.authorizationCodeGrant 'r4nd0m', (error, response) ->
        err = error
        res = response
        done()

    it 'should not provide an error', ->
      expect(err).to.be.null

    it 'should provide the token response', ->
      res.access_token.should.equal 'h3x'




