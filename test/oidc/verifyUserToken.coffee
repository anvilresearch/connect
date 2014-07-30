chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



AccessToken = require '../../models/AccessToken'
{verifyUserToken} = require '../../lib/oidc'


describe 'Verify User Token', ->


  {req,res,next,err} = {}


  describe 'with missing bearer token', ->

    beforeEach (done) ->
      req  = headers: {}
      res  = {}
      next = sinon.spy()

      verifyUserToken('profile') req, res, (error) ->
        err = error
        done()

    it 'should provide an UnauthorizedError', ->
      err.name.should.equal 'UnauthorizedError'

    it 'should provide a realm', ->
      err.realm.should.equal 'user'

    it 'should provide an error code', ->
      err.error.should.equal 'invalid_request'

    it 'should provide an error description', ->
      err.error_description.should.equal 'An access token is required'

    it 'should provide a status code', ->
      err.statusCode.should.equal 400




  describe 'via random string access token', ->

    describe 'with valid token', ->

      token = null

      before (done) ->
        token =
          scope: 'openid profile'
          created: Date.now()
          ei: 1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'valid' }
        res  = {}
        next = sinon.spy (error) ->
          err = error
          done()

        verifyUserToken('profile') req, res, next

      after ->
        AccessToken.get.restore()

      it 'should reference the retrieved token object', ->
        req.token.should.equal token

      it 'should continue', ->
        next.should.have.been.called




    describe 'with unknown token', ->

      before (done) ->
        sinon.stub(AccessToken, 'get').callsArgWith(1, null, null)

        req  = { bearer: 'unknown' }
        res  = {}
        next = sinon.spy()

        verifyUserToken('profile') req, res, (error) ->
          err = error
          done()

      after ->
        AccessToken.get.restore()

      it 'should provide an UnauthorizedError', ->
        err.name.should.equal 'UnauthorizedError'

      it 'should provide a realm', ->
        err.realm.should.equal 'user'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_token'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Unknown access token'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401




    describe 'with expired token', ->

      before (done) ->
        token =
          created: Date.now() - 10000000
          ei: 1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'expired' }
        res  = {}
        next = sinon.spy()

        verifyUserToken('profile') req, res, (error) ->
          err = error
          done()

      after ->
        AccessToken.get.restore()

      it 'should provide an UnauthorizedError', ->
        err.name.should.equal 'UnauthorizedError'

      it 'should provide a realm', ->
        err.realm.should.equal 'user'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_token'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Expired access token'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401




    describe 'with insufficient scope', ->

      before (done) ->
        token =
          scope: ''
          created: Date.now()
          ei: 1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'insufficient' }
        res  = {}
        next = sinon.spy()

        verifyUserToken('profile') req, res, (error) ->
          err = error
          done()

      after ->
        AccessToken.get.restore()

      it 'should provide an UnauthorizedError', ->
        err.name.should.equal 'UnauthorizedError'

      it 'should provide a realm', ->
        err.realm.should.equal 'user'

      it 'should provide an error code', ->
        err.error.should.equal 'insufficient_scope'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Insufficient access token scope'

      it 'should provide a status code', ->
        err.statusCode.should.equal 403




  describe 'via JWT access token', ->

    describe 'with invalid token', ->
