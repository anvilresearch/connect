# Test dependencies
nock      = require 'nock'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
Strategy      = require('passport-strategy')
OAuthStrategy = require '../../lib/strategies/OAuth'
provider      = require('../../lib/providers').oauthtest




describe 'OAuth Strategy', ->

  {err,req} = {}

  config =
    client_id:      'id',
    client_secret:  'secret'
    scope:          ['c']

  verify = () ->

  strategy = new OAuthStrategy provider, config, verify


  describe 'instance', ->

    it 'should inherit from Strategy', ->
      expect(strategy).to.be.instanceof Strategy




  describe 'constructor', ->

    it 'should set provider', ->
      strategy.provider.should.equal provider

    it 'should set endpoints', ->
      strategy.endpoints.should.equal provider.endpoints

    it 'should set client', ->
      strategy.client.should.equal config

    it 'should set name', ->
      strategy.name.should.equal provider.id

    it 'should set verify', ->
      strategy.verify.should.equal verify




  # SUPPORTING FUNCTIONS
  describe 'authorizationHeaderParams', ->

    {encoded} = {}

    before ->
      data = a: 'b', c: 'd', e: 'f/g h>i'
      encoded = OAuthStrategy.authorizationHeaderParams data

    it 'should set the provided parameters', ->
      encoded.should.contain 'a="b", c="d", '

    it 'should URI encode parameter values', ->
      encoded.should.contain 'e="f%2Fg%20h%3Ei"'




  describe 'requestURIQuery', ->




  describe 'formEncodedBody', ->




  describe 'encodeOAuthData', ->

    describe 'with null value', ->

      it 'should return an empty string', ->
        OAuthStrategy.encodeOAuthData().should.equal ''
        OAuthStrategy.encodeOAuthData(null).should.equal ''

    describe 'with non-empty string', ->

      it 'should escape !', ->
        OAuthStrategy.encodeOAuthData('!2!4').should.equal '%212%214'

      it 'should escape \'', ->
        OAuthStrategy.encodeOAuthData('\'2\'4').should.equal '%272%274'

      it 'should escape (', ->
        OAuthStrategy.encodeOAuthData('(2(4').should.equal '%282%284'

      it 'should escape )', ->
        OAuthStrategy.encodeOAuthData(')2)4').should.equal '%292%294'

      it 'should escape *', ->
        OAuthStrategy.encodeOAuthData('*2*4').should.equal '%2A2%2A4'




  describe 'timestamp', ->

    it 'should return a positive integer', ->
      OAuthStrategy.timestamp().should.be.greaterThan 0




  describe 'nonce', ->

    it 'should generate a random string of a given size', ->
      p = OAuthStrategy.nonce(10)
      q = OAuthStrategy.nonce(10)
      p.should.not.equal q
      p.length.should.equal 10




  describe 'signatureBaseStringURI', ->

    it 'should include the lowercase http scheme', ->
      uri = 'HTTP://example.com/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.contain 'http://'

    it 'should include the lowercase https scheme', ->
      uri = 'HTTPS://example.com/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.contain 'https://'

    it 'should not include the http default port', ->
      uri = 'http://example.com:80/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.not.contain ':80'

    it 'should not include the https default port', ->
      uri = 'https://example.com:443/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.not.contain ':443'

    it 'should include a non-standard http port', ->
      uri = 'http://example.com:8080/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.contain ':8080'

    it 'should include a non-standard https port', ->
      uri = 'https://example.com:4443/path'
      OAuthStrategy
        .signatureBaseStringURI(uri)
        .should.contain ':4443'




  describe 'signatureBaseString', ->

    it 'should contain the uppercase HTTP method', ->
      method = 'post'
      uri    = 'http://example.com/path'
      params = '...'
      OAuthStrategy
        .signatureBaseString('post', uri, params)
        .should.contain 'POST&'

    it 'should contain the encoded uri', ->
      method = 'post'
      uri    = 'https://example.com/path'
      params = ''
      OAuthStrategy
        .signatureBaseString(method, uri, params)
        .should.contain '&https%3A%2F%2Fexample.com%2Fpath&'



  describe 'normalizeParameters', ->

    it 'should do stuff (TEST OBVIOUSLY NEEDS LOVE)', ->
      data =
        b5: '=%3D'
        a3: 'a'
        'c@': undefined
        a2: 'r b'
        oauth_consumer_key: '9djdj82h48djs9d2'
        oauth_token: 'kkk9d7dh3k39sjv7'
        oauth_signature_method: 'HMAC-SHA1'
        oauth_timestamp: '137131201'
        oauth_nonce: '7d8f3e4a'
        c2: undefined
        a3: '2 q'
      OAuthStrategy
        .normalizeParameters(data)
        .should.equal 'a2=r%20b&a3=2%20q&b5=%3D%253D&c%40=&c2=&oauth_consumer_key=9djdj82h48djs9d2&oauth_nonce=7d8f3e4a&oauth_signature_method=HMAC-SHA1&oauth_timestamp=137131201&oauth_token=kkk9d7dh3k39sjv7'




  describe 'sign', ->

    describe 'with PLAINTEXT method', ->

      it 'should return the key', ->
        OAuthStrategy.sign('PLAINTEXT', '', 'SECRET').should.equal 'SECRET'


    describe 'with RSA-SHA1', ->

    describe 'with HMAC-SHA1', ->

    describe 'with unknown method', ->




