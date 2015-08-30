chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




User = require('../../../models/User')
{authenticateUser} = require('../../../oidc')




describe 'Authenticate User', ->


  {req,res,next,err,user} = {}


  describe 'with valid access token and valid user', ->

    before (done) ->
      user = new User
      sinon.stub(User, 'get').callsArgWith(1, null, user)

      req =
        claims:
          sub: 'uuid'
      res: {}
      next = sinon.spy (error) ->
        err = error
        done()

      authenticateUser req, res, next

    after ->
      User.get.restore()

    it 'should not provide an error', ->
      next.args[0].length.should.equal 0

    it 'should add user to the request', ->
      req.user.should.equal user

    it 'should continue', ->
      next.should.have.been.called




  describe 'with valid access token and unknown user', ->

    before (done) ->
      user = null
      sinon.stub(User, 'get').callsArgWith(1, null, null)

      req =
        claims:
          sub: 'uuid'
      res: {}
      next = sinon.spy (error) ->
        err = error
        done()

      authenticateUser req, res, next

    after ->
      User.get.restore()

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        statusCode: 401
      })

    it 'should not add user to the request', ->
      expect(req.user).to.be.undefined




  describe 'with authenticated session', ->

    before ->
      req =
        user: {}
      res = {}
      next = sinon.spy()

      authenticateUser req, res, next

    it 'should not provide an error', ->
      next.args[0].length.should.equal 0

    it 'should continue', ->
      next.should.have.been.called




  describe 'with unauthenticated session', ->

    before ->
      req = {}
      res = {}
      next = sinon.spy()

      authenticateUser req, res, next

    it 'should provide an error', ->
      next.should.have.been.calledWith sinon.match({
        statusCode: 401
      })




