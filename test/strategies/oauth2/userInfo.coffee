# Test dependencies
_         = require 'lodash'
nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




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

describe 'OAuth2Strategy userInfo', ->


  {err,res,req,provider,client,strategy,headers,token} = {}


  describe 'with a missing token argument', ->




  describe 'with defaults', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .get('/user')
                   .reply(200, { uid: 1234, name: 'Dude' })
      req = strategy.userInfo 'r4nd0m', -> done()

    it 'should use the specified endpoint', ->
      req.url.should.equal provider.endpoints.user.url

    it 'should use the "GET" method', ->
      req.method.should.equal 'GET'

    it 'should set the accept header', ->
      req.req._headers['accept'].should.equal 'application/json'

    it 'should set the user agent', ->
      req.req._headers['user-agent'].should.contain 'Anvil Connect/'




  describe 'with custom HTTP method', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.method = 'PATCH'
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .patch('/user')
                   .reply(200, { uid: '1234', fullname: 'Dude' })
      req = strategy.userInfo 'r4nd0m', -> done()

    it 'should use the specified HTTP method', ->
      req.method.should.equal 'PATCH'




  describe 'with authorization header (bearer token)', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.auth =
        header: 'Authorization'
        scheme: 'Bearer'
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .get('/user')
                   .reply(200, { name: 'Dude' })
      req = strategy.userInfo 'r4nd0m', -> done()
      headers = req.req._headers

    it 'should set the Authorization header', ->
      expect(headers.authorization).to.be.defined

    it 'should use the Basic scheme', ->
      expect(headers.authorization).to.contain 'Bearer '

    it 'should set the credentials', ->
      expect(headers.authorization).to.contain 'r4nd0m'




  describe 'with authorization header (custom)', ->

    before (done) ->
      auth =
        header: 'X-Custom-Header'
        scheme: 'OAuth'
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.auth = auth
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .get('/user')
                   .reply(200, { fullname: 'Dude' })
      req = strategy.userInfo 'r4nd0m', -> done()
      headers = req.req._headers

    it 'should set a custom header', ->
      expect(headers['x-custom-header']).to.be.defined

    it 'should use a custom scheme', ->
      expect(headers['x-custom-header']).to.contain 'OAuth '

    it 'should set token as credentials', ->
      expect(headers['x-custom-header']).to.contain 'r4nd0m'



  describe 'with access token (querystring)', ->

    before (done) ->
      auth =
        query: 'oauth_token'
      token = 'r4nd0m'
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.auth = auth
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .get('/user?' + auth.query + '=' + token)
                   .reply(200, { fullname: 'Dude' })
      req = strategy.userInfo token, -> done()

    it 'should set a custom parameter', ->
      req.qsRaw.should.contain 'oauth_token=r4nd0m'




  describe 'with custom params', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.params = foo: 'bar'
      client   = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier
      scope    = nock(provider.url)
                   .get('/user?foo=bar')
                   .reply(200, { fullname: 'Dude' })
      req = strategy.userInfo token, -> done()

    it 'should set a custom parameter', ->
      req.qs.foo.should.equal 'bar'




  describe 'with error response', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.auth = query: 'entropy'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .get('/user?entropy=t0k3n')
        .reply(400, { error: 'oops' })

      req = strategy.userInfo 't0k3n', (error, response) ->
        err = error
        res = response
        done()

    it 'should provide an error', ->
      err.message.should.equal 'oops'

    it 'should not provide a profile', ->
      expect(res).to.be.undefined




  describe 'with user profile', ->

    before (done) ->
      provider = _.clone providers.oauth2test, true
      provider.endpoints.user.auth = query: 'entr0py'
      client = client_id: 'uuid', client_secret: 'h4sh'
      verifier = () ->
      strategy = new OAuth2Strategy provider, client, verifier

      scope = nock(provider.url)
        .get('/user?entr0py=t0k3n')
        .reply(200, { uid: 1234, fullname: 'Yoda' })

      req = strategy.userInfo 't0k3n', (error, response) ->
        err = error
        res = response
        done()

    it 'should not provide an error', ->
      expect(err).to.be.null

    it 'should provide the provider name', ->
      res.provider.should.equal provider.id

    it 'should normalize the provider user id', ->
      res.id.should.equal '1234'




