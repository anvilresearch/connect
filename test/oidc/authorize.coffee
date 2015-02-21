chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



server = require '../../server'
AccessToken = require '../../models/AccessToken'
AuthorizationCode  = require '../../models/AuthorizationCode'
authorize = require('../../oidc').authorize(server)




describe 'Authorize', ->


  {req,res,next,err} = {}


  describe 'with consent and "code" response type', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code'
          redirect_uri:   'https://host/callback'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()

    it 'should set default max_age if none is provided', ->
      AuthorizationCode.insert.should.have.been.calledWith sinon.match({
        max_age: undefined
      })

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a query string', ->
      res.redirect.should.have.been.calledWith sinon.match('?')

    it 'should provide authorization code', ->
      res.redirect.should.have.been.calledWith sinon.match 'code=1234'

    it 'should provide state', ->
      res.redirect.should.have.been.calledWith sinon.match 'state=r4nd0m'




  describe 'with consent and "code" response type and "max_age" param', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code'
          redirect_uri:   'https://host/callback'
          state:          'r4nd0m'
          max_age:        1000
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()

    it 'should set max_age from params', ->
      AuthorizationCode.insert.should.have.been.calledWith sinon.match({
        max_age: req.connectParams.max_age
      })




  describe 'with consent and "code" response type and client "default_max_age"', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })

      req =
        client:
          _id: 'uuid1'
          default_max_age: 2000
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code'
          redirect_uri:   'https://host/callback'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()

    it 'should set max_age from client default_max_age', ->
      AuthorizationCode.insert.should.have.been.calledWith sinon.match({
        max_age: req.client.default_max_age
      })




  describe 'with consent and "code token" response type', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })
      response = AccessToken.initialize().project('issue')
      sinon.stub(AccessToken, 'issue').callsArgWith(2, null, response)

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code token'
          redirect_uri:   'https://host/callback'
          scope:          'openid profile'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()
      AccessToken.issue.restore()

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a query string', ->
      res.redirect.should.have.been.calledWith sinon.match('?')

    it 'should provide authorization code', ->
      res.redirect.should.have.been.calledWith sinon.match 'code=1234'

    it 'should provide access_token', ->
      res.redirect.should.have.been.calledWith sinon.match('access_token=')

    it 'should provide token_type', ->
      res.redirect.should.have.been.calledWith sinon.match('token_type=Bearer')

    it 'should provide expires_in', ->
      res.redirect.should.have.been.calledWith sinon.match('expires_in=3600')

    it 'should not provide id_token', ->
      res.redirect.should.not.have.been.calledWith sinon.match('id_token=')

    it 'should provide state', ->
      res.redirect.should.have.been.calledWith sinon.match req.connectParams.state




  describe 'with consent and "code id_token" response type', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code id_token'
          redirect_uri:   'https://host/callback'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()

    it 'should set default max_age if none is provided', ->
      AuthorizationCode.insert.should.have.been.calledWith sinon.match({
        max_age: undefined
      })

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a query string', ->
      res.redirect.should.have.been.calledWith sinon.match('?')

    it 'should provide authorization code', ->
      res.redirect.should.have.been.calledWith sinon.match 'code=1234'

    it 'should provide id_token', ->
      res.redirect.should.have.been.calledWith sinon.match('id_token=')

    it 'should not provide access_token', ->
      res.redirect.should.not.have.been.calledWith sinon.match('access_token=')

    it 'should provide state', ->
      res.redirect.should.have.been.calledWith sinon.match 'state=r4nd0m'




  describe 'with consent and "id_token token" response type', ->

    before (done) ->
      response = AccessToken.initialize().project('issue')
      sinon.stub(AccessToken, 'issue').callsArgWith(2, null, response)

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'id_token token'
          redirect_uri:   'https://host/callback'
          nonce:          'n0nc3'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AccessToken.issue.restore()

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a uri fragment', ->
      res.redirect.should.have.been.calledWith sinon.match('#')

    it 'should provide access_token', ->
      res.redirect.should.have.been.calledWith sinon.match('access_token=')

    it 'should provide token_type', ->
      res.redirect.should.have.been.calledWith sinon.match('token_type=Bearer')

    it 'should provide expires_in', ->
      res.redirect.should.have.been.calledWith sinon.match('expires_in=3600')

    it 'should provide id_token', ->
      res.redirect.should.have.been.calledWith sinon.match('id_token=')

    it 'should provide state', ->
      res.redirect.should.have.been.calledWith sinon.match req.connectParams.state




  describe 'with consent and "code id_token token" response type', ->

    before (done) ->
      sinon.stub(AuthorizationCode, 'insert').callsArgWith(1, null, {
        code: '1234'
      })
      response = AccessToken.initialize().project('issue')
      sinon.stub(AccessToken, 'issue').callsArgWith(2, null, response)

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'code id_token token'
          redirect_uri:   'https://host/callback'
          scope:          'openid profile'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AuthorizationCode.insert.restore()
      AccessToken.issue.restore()

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a query string', ->
      res.redirect.should.have.been.calledWith sinon.match('?')

    it 'should provide authorization code', ->
      res.redirect.should.have.been.calledWith sinon.match 'code=1234'

    it 'should provide access_token', ->
      res.redirect.should.have.been.calledWith sinon.match('access_token=')

    it 'should provide token_type', ->
      res.redirect.should.have.been.calledWith sinon.match('token_type=Bearer')

    it 'should provide expires_in', ->
      res.redirect.should.have.been.calledWith sinon.match('expires_in=3600')

    it 'should provide id_token', ->
      res.redirect.should.have.been.calledWith sinon.match('id_token=')

    it 'should provide state', ->
      res.redirect.should.have.been.calledWith sinon.match req.connectParams.state




  describe 'with consent and response mode param', ->

    before (done) ->
      response = AccessToken.initialize().project('issue')
      sinon.stub(AccessToken, 'issue').callsArgWith(2, null, response)

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          authorize:      'true'
          response_type:  'id_token token'
          response_mode:  'query'
          redirect_uri:   'https://host/callback'
          nonce:          'n0nc3'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    after ->
      AccessToken.issue.restore()

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide a query string', ->
      res.redirect.should.have.been.calledWith sinon.match('?')




  describe 'without consent', ->

    before (done) ->

      req =
        client:
          _id: 'uuid1'
        user:
          _id: 'uuid2'
        connectParams:
          response_type:  'id_token token'
          redirect_uri:   'https://host/callback'
          nonce:          'n0nc3'
          state:          'r4nd0m'
      res =
        redirect: sinon.spy()
      next = sinon.spy()

      authorize req, res, next
      done()

    it 'should redirect to the redirect_uri', ->
      res.redirect.should.have.been.calledWith sinon.match(
        req.connectParams.redirect_uri
      )

    it 'should provide an "access_denied" error', ->
      res.redirect.should.have.been.calledWith sinon.match('error=access_denied')



