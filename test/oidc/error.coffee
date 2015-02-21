chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{error} = require '../../oidc'




describe 'Error Response', ->


  {err,req,res,next} = {}


  describe 'with 302 status code', ->

    before ->
        err =
          error:              'error_code'
          error_description:  'description'
          redirect_uri:       'https://client.tld/callback'
          statusCode:         302

        req = {}

        res =
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        error err, req, res, next

    it 'should redirect', ->
      res.redirect.should.have.been.calledWith sinon.match(err.redirect_uri)

    it 'should provide an error', ->
      res.redirect.should.have.been.calledWith sinon.match('error=error_code')

    it 'should provide an error description', ->
      res.redirect.should.have.been.calledWith(
        sinon.match('&error_description=description')
      )

    it 'should not continue', ->
      next.should.not.have.been.called




  describe 'with 400 status code', ->

    before ->
        err =
          error:              'error_code'
          error_description:  'description'
          statusCode:         400

        req = {}

        res =
          json: sinon.spy()
          set: sinon.spy (headers) -> res.headers = headers
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        error err, req, res, next

    it 'should respond 400', ->
      res.json.should.have.been.calledWith 400

    it 'should respond with JSON', ->
      res.json.should.have.been.called

    it 'should set the Cache-Control header', ->
      res.headers['Cache-Control'].should.equal 'no-store'

    it 'should set the Pragma header', ->
      res.headers['Pragma'].should.equal 'no-cache'

    it 'should provide an error', ->
      res.json.should.have.been.calledWith(
        sinon.match.number,
        sinon.match({ error: 'error_code' })
      )

    it 'should provide an error description', ->
      res.json.should.have.been.calledWith(
        sinon.match.number,
        sinon.match({ error_description: 'description' })
      )




  describe 'with 401 status code', ->

    before ->
        err =
          realm:              'realm'
          error:              'error_code'
          error_description:  'description'
          statusCode:         401

        req = {}

        res =
          send: sinon.spy()
          set: sinon.spy (headers) -> res.headers = headers
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        error err, req, res, next

    it 'should respond 401', ->
      res.send.should.have.been.calledWith 401

    it 'should respond "Unauthorized"', ->
      res.send.should.have.been.calledWith sinon.match.number, 'Unauthorized'

    it 'should challenge to authenticate', ->
      res.headers['WWW-Authenticate'].should.be.defined

    it 'should provide a realm in the challenge', ->
      res.headers['WWW-Authenticate'].should.contain 'realm="realm"'

    it 'should provide an error in the challenge', ->
      res.headers['WWW-Authenticate'].should.contain 'error="error_code"'

    it 'should provide an error description in the challenge', ->
      res.headers['WWW-Authenticate'].should.contain 'error_description="description"'



  describe 'with 403 status code', ->

    before ->
        err =
          error:              'error_code'
          error_description:  'description'
          statusCode:         403

        req = {}

        res =
          send: sinon.spy()
          set: sinon.spy (headers) -> res.headers = headers
          render: sinon.spy()
          redirect: sinon.spy()

        next = sinon.spy()

        error err, req, res, next

    it 'should respond 403', ->
      res.send.should.have.been.calledWith 403

    it 'should respond "Forbidden"', ->
      res.send.should.have.been.calledWith sinon.match.number, 'Forbidden'




  describe 'with other status code', ->

    before ->
        err =
          message:    'I am a teapot'
          statusCode: 418

        req = {}
        res = send: sinon.spy()
        next = sinon.spy()
        error err, req, res, next


    it 'should respond with error status code', ->
      res.send.should.have.been.calledWith 418

    it 'should respond with error message', ->
      res.send.should.have.been.calledWith sinon.match.number, 'I am a teapot'




  describe 'with no error status code', ->

    before ->
        err = {}
        req = {}
        res = send: sinon.spy()
        next = sinon.spy()
        error err, req, res, next

    it 'should respond 500', ->
      res.send.should.have.been.calledWith 500

    it 'should respond with error message', ->
      res.send.should.have.been.calledWith(
        sinon.match.number, 'Internal Server Error'
      )
