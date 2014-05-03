chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




server = require '../../server'
ClientToken = require '../../models/ClientToken'
verifyClientToken = require('../../lib/oidc').verifyClientToken(server)




describe 'Verify Client Token', ->


  {req,res,next,err} = {}


  describe 'with missing bearer token', ->

    before (done) ->
      req  = headers: {}
      res  = {}
      next = sinon.spy()

      verifyClientToken req, res, (error) ->
        err = error
        done()

    it 'should provide an UnauthorizedError', ->
      err.name.should.equal 'UnauthorizedError'

    it 'should provide a realm', ->
      err.realm.should.equal 'client'

    it 'should provide an error code', ->
      err.error.should.equal 'unauthorized_client'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Missing authorization header'

    it 'should provide a status code', ->
      err.statusCode.should.equal 403




  describe 'with valid token', ->

    token = null

    before (done) ->
      token =
        header: {}
        payload: {}

      sinon.stub(ClientToken, 'decode').returns token

      req  = headers: { authorization: 'Bearer valid.signed.jwt' }
      res  = {}
      next = sinon.spy (error) ->
        err = error
        done()

      verifyClientToken req, res, next

    after ->
      ClientToken.decode.restore()

    it 'should reference the retrieved token object', ->
      req.token.should.equal token

    it 'should continue', ->
      next.should.have.been.called




  describe 'with invalid token', ->

    before (done) ->
      req  = headers: { authorization: 'Bearer invalid' }
      res  = {}
      next = sinon.spy()

      verifyClientToken req, res, (error) ->
        err = error
        done()

    it 'should provide an UnauthorizedError', ->
      err.name.should.equal 'UnauthorizedError'

    it 'should provide a realm', ->
      err.realm.should.equal 'client'

    it 'should provide an error code', ->
      err.error.should.equal 'unauthorized_client'

    it 'should provide an error description', ->
      err.error_description.should.equal 'Invalid access token'

    it 'should provide a status code', ->
      err.statusCode.should.equal 403




