# Test dependencies
chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
supertest = require 'supertest'
expect = chai.expect



# Assertions
chai.use sinonChai
chai.should()




# Code under test
server = require '../../../server'
User = require '../../../models/User'
AccessToken = require '../../../models/AccessToken'




request = supertest(server)




describe 'RESTful User Routes', ->




  {err, res} = {}




  describe 'GET /v1/users', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/users')
          #.set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      it 'should respond 40x', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with valid token', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        request
          .get('/v1/users')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a list of users', ->
        res.body.should.be.an 'array'




