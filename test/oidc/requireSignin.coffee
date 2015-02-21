chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
expect = chai.expect
chai.use sinonChai
chai.should()




{requireSignin} = require '../../oidc'




describe 'Require Signin', ->



  {req,res,err} = {}

  beforeEach ->
    req = (params, authenticated) ->
      connectParams: params
      isAuthenticated: -> authenticated
    res = redirect: sinon.spy()
    err = null




  describe 'with authenticated user and no prompt', ->

    beforeEach (done) ->
      requireSignin req({}, true), res, (error) ->
        err = error
        done()

    it 'should not redirect to signin', ->
      res.redirect.should.not.have.been.called

    it 'should not provide an error', ->
      expect(err).to.be.undefined



  describe 'with unauthenticated user', ->

    beforeEach ->
      requireSignin req({}, false), res

    it 'should redirect to signin', ->
      res.redirect.should.have.been.calledWith '/signin?'




  describe 'with authenticated user and "login" prompt', ->

    beforeEach ->
      params = { prompt: 'login' }
      requireSignin req(params, true), res

    it 'should redirect to signin', ->
      res.redirect.should.have.been.calledWith '/signin?prompt=login'




