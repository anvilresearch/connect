# Test dependencies
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
OAuth2Strategy = require '../../lib/strategies/OAuth2'




describe 'OAuth2 Strategy', ->


  {err, res, credentials} = {}

  provider =
    id:           'id'
    name:         'Name'
    protocol:     'OAuth 2.0'
    url:          'https://domain.tld'
    redirect_uri: 'https://local.tld/callback'
    endpoints:
      authorize:
        url:      'https://domain.tld/authorize'
        method:   'POST'
      token:
        url:      'https://domain.tld/token'
        method:   'POST'
        auth:     'client_secret_basic'
      user:
        url:      'https://domain.tld/userinfo'
        method:   'GET'
        auth:     'bearer_token'

  config =
    client_id:      'id',
    client_secret:  'secret'


  describe 'base64credentials', ->

    before ->
      credentials = OAuth2Strategy.base64credentials(config)

    it 'should include the client_id', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain config.client_id

    it 'should include the client_secret', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain config.client_secret

    it 'should include the separator', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain ':'




  describe 'authorizationCodeGrant', ->

    describe 'with valid request', ->

      before (done) ->
        params =
          grant_type: 'authorization_code'
          code: 'r4nd0m'
          redirect_uri: provider.redirect_uri

        scope = nock(provider.url)
                .matchHeader('User-Agent', 'Anvil Connect/0.1.26')
                .matchHeader(
                  'Authorization',
                  'Basic ' + OAuth2Strategy.base64credentials(config)
                )
                .post('/token', FormUrlencoded.encode params)
                .reply(201, { access_token: 'token' })
        OAuth2Strategy.authorizationCodeGrant params.code, provider, config, (error, response) ->
          err = error
          res = response
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide the token response', ->
        res.access_token.should.equal 'token'
