chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



server            = require '../../server'
AccessToken       = require '../../models/AccessToken'
IDToken           = require '../../models/IDToken'
AuthorizationCode = require '../../models/AuthorizationCode'
token             = require('../../lib/oidc').token(server)




describe 'Token response', ->


  {req,res,next,err} = {}



  describe 'authorization code grant', ->

    {at} = {}

    before (done) ->
      at = AccessToken.initialize()
      sinon.stub(AccessToken, 'exchange').callsArgWith(1, null, at)

      req =
        body:
          grant_type: 'authorization_code'
          state: 'st4t3'
        code:
          user_id: 'uuid1'
          client_id: 'uuid2'
      res =
        set: sinon.spy()
        json: sinon.spy()
      next = sinon.spy (error) ->
        err = error
        done()

      token req, res, next
      done()

    after ->
      AccessToken.exchange.restore()

    it 'should respond with access_token', ->
      res.json.should.have.been.calledWith sinon.match({ access_token: at.at })

    it 'should respond with token_type', ->
      res.json.should.have.been.calledWith sinon.match({ token_type: 'Bearer' })

    it 'should respond with expires_in', ->
      res.json.should.have.been.calledWith sinon.match({ expires_in: 3600 })

    it 'should respond with id_token', ->
      res.json.should.have.been.calledWith sinon.match({
        id_token: sinon.match.string
      })

    it 'should respond with state', ->
      res.json.should.have.been.calledWith sinon.match({ state: 'st4t3' })




  describe 'refresh grant', ->

    {at} = {}

    before (done) ->
      at = AccessToken.initialize({cid:'uuid2',uid: 'uuid1'})
      sinon.stub(AccessToken, 'refresh').callsArgWith(2, null, at)

      req =
        body:
          grant_type: 'refresh_token'
          state: 'st4t3'
        client:
          _id: 'uuid2'
      res =
        set: sinon.spy()
        json: sinon.spy()
      next = sinon.spy (error) ->
        err = error
        done()

      token req, res, next
      done()


    it 'should respond with access_token', ->
      res.json.should.have.been.calledWith sinon.match({ access_token: at.at })

    it 'should respond with token_type', ->
      res.json.should.have.been.calledWith sinon.match({ token_type: 'Bearer' })

    it 'should respond with expires_in', ->
      res.json.should.have.been.calledWith sinon.match({ expires_in: 3600 })

    it 'should respond with id_token', ->
      res.json.should.have.been.calledWith sinon.match({
        id_token: sinon.match.string
      })

    it 'should respond with state', ->
      res.json.should.have.been.calledWith sinon.match({ state: 'st4t3' })



