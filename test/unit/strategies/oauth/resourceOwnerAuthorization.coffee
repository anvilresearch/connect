# Test dependencies
_         = require 'lodash'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
OAuthStrategy = require '../../../../protocols/OAuth'
providers = require '../../../../providers'




describe 'OAuthStrategy resourceOwnerAuthorization', ->

  {token,provider,strategy} = {}

  beforeEach ->
    token = 't0k3n'
    provider = _.clone providers.oauthtest, true
    client   = {}
    verifier = () ->
    strategy = new OAuthStrategy provider, client, verifier
    strategy.redirect = sinon.spy()
    strategy.resourceOwnerAuthorization(token)

  it 'should redirect', ->
    url = provider.endpoints.authorization.url
    strategy.redirect.should.have.been.calledWith sinon.match(url)

  it 'should include oauth_token', ->
    strategy.redirect.should.have.been.calledWith sinon.match(
      'oauth_token=' + token
    )




