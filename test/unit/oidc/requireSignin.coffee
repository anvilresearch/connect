chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
expect = chai.expect
chai.use sinonChai
chai.should()




{requireSignin} = require '../../../oidc'




describe 'Require Signin', ->



  {req,res,err} = {}

  beforeEach ->
    req = (params, authenticated) ->
      connectParams: params
      user: if authenticated then {} else undefined
      client: {}
      session: {}
    res = redirect: sinon.spy()
    err = null




  describe 'with authenticated user and no prompt', ->

    beforeEach (done) ->
      params = response_type: 'id_token token'
      requireSignin req(params, true), res, (error) ->
        err = error
        done()

    it 'should not redirect to signin', ->
      res.redirect.should.not.have.been.called

    it 'should not provide an error', ->
      expect(err).to.be.undefined



  describe 'with unauthenticated user', ->

    beforeEach ->
      params = response_type: 'id_token token'
      requireSignin req(params, false), res

    it 'should redirect to signin', ->
      res.redirect.should.have.been.calledWith sinon.match '/signin?'




  describe 'with authenticated user and "login" prompt', ->

    beforeEach ->
      params = prompt: 'login', response_type: 'id_token token'
      requireSignin req(params, true), res

    it 'should redirect to signin', ->
      res.redirect.should.have.been.calledWith sinon.match '/signin?prompt=login'




  describe 'with unauthenticated user and "none" prompt', ->

    beforeEach ->
      params = prompt: 'none', response_type: 'id_token token'
      requireSignin req(params, false), res

    it 'should redirect to the redirect_uri with an error', ->
      res.redirect.should.have.been.calledWith sinon.match "#error=login_required"




  describe 'with authenticated user and "none" prompt', ->

    beforeEach (done) ->
      params = prompt: 'none', response_type: 'id_token token'
      requireSignin req(params, true), res, (error) ->
        err = error
        done()

    it 'should not redirect', ->
      res.redirect.should.not.have.been.called

    it 'should not provide an error', ->
      expect(err).to.be.undefined
