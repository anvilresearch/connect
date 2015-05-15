chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




{authenticateUser} = require('../../oidc')




describe 'Authenticate User', ->


  {req,res,next} = {}


  describe 'with authenticated session', ->

    before ->
      req =
        isAuthenticated: sinon.stub().returns(true)
      res = {}
      next = sinon.spy()

      authenticateUser req, res, next

    it 'should not provide an error', ->
      next.args[0].length.should.equal 0

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unauthenticated session', ->

    before ->
      req =
        isAuthenticated: sinon.stub().returns(false)
      res = {}
      next = sinon.spy()

      authenticateUser req, res, next

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        statusCode: 401
      })




