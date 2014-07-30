chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



server = require '../../server'
AccessToken = require '../../models/AccessToken'
{verifyUserToken} = require '../../lib/oidc'


describe 'Verify User Token', ->


  {req,res,next,err} = {}


  describe 'with missing bearer token', ->

    beforeEach (done) ->
      req  = headers: {}
      res  = {}
      next = sinon.spy()

      verifyUserToken(server, 'profile') req, res, (error) ->
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
          at:       'r4nd0m'
          iss:      server.settings.issuer
          uid:      'uuid1'
          cid:      'uuid2'
          scope:    'openid profile'
          created: Date.now()
          ei: 1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'valid' }
        res  = {}
        next = sinon.spy (error) ->
          err = error
          done()

        verifyUserToken(server, 'profile') req, res, next

      after ->
        AccessToken.get.restore()

      it 'should reference the retrieved token object', ->
        req.token.jti.should.equal token.at

      it 'should continue', ->
        next.should.have.been.called




    describe 'with unknown token', ->

      before (done) ->
        sinon.stub(AccessToken, 'get').callsArgWith(1, null, null)

        req  = { bearer: 'unknown' }
        res  = {}
        next = sinon.spy()

        verifyUserToken(server, 'profile') req, res, (error) ->
          err = error
          done()

      after ->
        AccessToken.get.restore()

      it 'should provide an UnauthorizedError', ->
        err.name.should.equal 'UnauthorizedError'

      it 'should provide a realm', ->
        err.realm.should.equal 'user'

      it 'should provide an error code', ->
        err.error.should.equal 'invalid_request'

      it 'should provide an error description', ->
        err.error_description.should.equal 'Unknown access token'

      it 'should provide a status code', ->
        err.statusCode.should.equal 401




    describe 'with expired token', ->

      before (done) ->
        token =
          iss: server.settings.issuer
          created: Date.now() - 10000000
          ei: 1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'expired' }
        res  = {}
        next = sinon.spy()

        verifyUserToken(server, 'profile') req, res, (error) ->
          console.log('ERROOOOOOOR', error)
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
        err.statusCode.should.equal 403




    describe 'with insufficient scope', ->

      before (done) ->
        token =
          iss:      server.settings.issuer
          scope:    ''
          created:  Date.now()
          ei:       1000

        sinon.stub(AccessToken, 'get').callsArgWith(1, null, token)

        req  = { bearer: 'insufficient' }
        res  = {}
        next = sinon.spy()

        verifyUserToken(server, 'profile') req, res, (error) ->
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
        err.error_description.should.equal 'Insufficient scope'

      it 'should provide a status code', ->
        err.statusCode.should.equal 403




  describe 'via JWT access token', ->

    describe 'with invalid token', ->
