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
OAuthStrategy = require '../../../protocols/OAuth'
providers = require '../../../providers'




describe 'OAuthStrategy temporaryCredentials', ->

  {err,req,res,headers,provider,client} = {}

  describe 'with defaults and valid parameters', ->

    beforeEach (done) ->
      provider = _.clone providers.oauthtest, true
      client =
        oauth_consumer_key: '1q2w3e4r'
        oauth_consumer_secret: 's3cr3t'
      verifier = () ->

      reply = 'oauth_token=hdk48Djdsa&oauth_token_secret=xyz4992k83j47x0b&oauth_callback_confirmed=true'
      scope = nock(provider.url)
                .post('/credentials')
                .reply(200, reply, {
                  'content-type': 'application/x-www-form-urlencoded'
                })

      strategy = new OAuthStrategy provider, client, verifier
      req = strategy.temporaryCredentials (error, response) ->
        err = error
        res = response
        done()
      headers = req.req._headers


    it 'should use the specified endpoint', ->
      req.url.should.equal provider.endpoints.credentials.url

    it 'should use the "POST" method', ->
      req.method.should.equal 'POST'

    it 'should set the "Authorization" header', ->
      expect(headers.authorization).to.be.a.defined

    it 'should use the "OAuth" scheme', ->
      headers.authorization.should.contain 'OAuth'

#    it 'should set the realm'

    it 'should set the oauth_consumer_key', ->
      headers.authorization.should.contain(
        'oauth_consumer_key="' + client.oauth_consumer_key + '"'
      )

    it 'should set the oauth_signature_method', ->
      headers.authorization.should.contain(
        'oauth_signature_method="' + provider.oauth_signature_method + '"'
      )

    it 'should set the oauth_callback', ->
      headers.authorization.should.contain(
        'oauth_callback="' + encodeURIComponent(provider.oauth_callback) + '"'
      )

    it 'should set the oauth_signature', ->
      headers.authorization.should.contain(
        'oauth_signature="' + encodeURIComponent(client.oauth_consumer_secret + '&') + '"'
    )

    it 'should set the accept header', ->
      headers.accept.should.contain 'application/x-www-form-urlencoded'

    it 'should set the user agent', ->
      headers['user-agent'].should.contain 'Anvil Connect/'

    it 'should provide a null error', ->
      expect(err).to.null

    it 'should provide credentials', ->
      res.oauth_token.should.equal 'hdk48Djdsa'




