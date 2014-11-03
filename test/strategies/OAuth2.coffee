# Test dependencies
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
OAuth2Strategy = require '../../lib/strategies/OAuth2'




describe 'OAuth2 Strategy', ->


  provider =
    client_id:      'id',
    client_secret:  'secret'


  describe 'base64credentials', ->

    credentials = undefined

    before ->
      credentials = OAuth2Strategy.base64credentials(provider)

    it 'should include the client_id', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain provider.client_id

    it 'should include the client_secret', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain provider.client_secret

    it 'should include the separator', ->
      new Buffer(credentials, 'base64')
        .toString().should.contain ':'


