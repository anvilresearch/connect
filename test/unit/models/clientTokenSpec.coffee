# Test dependencies
cwd         = process.cwd()
path        = require 'path'
chai        = require 'chai'
sinon       = require 'sinon'
sinonChai   = require 'sinon-chai'
expect      = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
ClientToken = require path.join cwd, 'models/ClientToken'
JWT = require 'anvil-connect-jwt'
base64url = require 'base64url'
settings = require path.join cwd, 'boot/settings'




describe 'Client Token', ->

  it 'should be a subclass of JWT', ->
    ClientToken.super.should.equal JWT




  describe 'header', ->

    it 'must not use "none" as "alg" value', ->
      expect(-> new ClientToken({}, { alg: 'none'})).to.throw Error

    it 'should not use "x5u", "x5c", "jku", or "jwk" header parameter fields', ->
      header =
        alg: 'RS256'
        x5u: 'x5u'
        x5c: 'x5c'
        jku: 'jku'
        jwk: 'jwk'
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'
        #exp: Date.now()
        iat: Date.now()
      token = new ClientToken payload, header
      expect(token.header.x5u).to.be.undefined
      expect(token.header.x5c).to.be.undefined
      expect(token.header.jku).to.be.undefined
      expect(token.header.jwk).to.be.undefined




  describe 'claims', ->

    it 'should have "jti" Token Identifer', ->
      ClientToken.registeredClaims.jti.format.should.equal 'String'

    it 'should require "iss" Issuer Identifier', ->
      ClientToken.registeredClaims.iss.required.should.be.true

    it 'should require "sub" Subject Identifier', ->
      ClientToken.registeredClaims.sub.required.should.be.true

    it 'should require "aud" Audience array or string'

    it 'should have "exp" Expiration time', ->
      ClientToken.registeredClaims.exp.format.should.equal 'IntDate'

    #it 'should default "exp" to 24 hours', ->
    #  payload =
    #    iss: 'http://anvil.io'
    #    sub: 'uuid'
    #    aud: 'uuid'

    #  token = new ClientToken payload
    #  token.payload.exp.should.be.a.number
    #  new Date(token.payload.exp).getDay().should.not.equal new Date().getDay()

    it 'should require "iat" Issued time', ->
      ClientToken.registeredClaims.iat.required.should.be.true

    it 'should default "iat" to now', ->
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'

      token = new ClientToken payload
      token.payload.iat.should.be.a.number

    it 'should require "scope"', ->
      ClientToken.registeredClaims.scope.required.should.be.true

    it 'should default "scope" to "client"', ->
      payload =
        iss: 'http://anvil.io'
        sub: 'uuid'
        aud: 'uuid'

      token = new ClientToken payload
      token.payload.scope.should.contain 'client'




  describe 'issue', ->

    {err,jwt} = {}
    privateKey = settings.keys.sig.prv

    describe 'with valid claims', ->

      before (done) ->
        ClientToken.issue {
          iss: 'http://anvil.io'
          sub: 'uuid'
          aud: 'uuid'
        }, privateKey, (error, encoded) ->
          err = error
          jwt = encoded
          done()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide an encoded JWT', ->
        jwt.should.contain '.'

    describe 'with invalid claims', ->

      before (done) ->
        ClientToken.issue {}, privateKey, (error, encoded) ->
          err = error
          jwt = encoded
          done()

      it 'should provide an error', ->
        expect(err).to.be.instanceof Error

      it 'should not provide an encoded jwt', ->
        expect(jwt).to.be.undefined
