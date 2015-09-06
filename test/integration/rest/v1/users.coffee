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
server = require '../../../../server'
User = require '../../../../models/User'
AccessToken = require '../../../../models/AccessToken'




request = supertest(server)




describe 'RESTful User Routes', ->




  {err, res} = {}




  describe 'GET /v1/users', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/users')
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




  describe 'GET /v1/users/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/users/uuid')
          .end (error, response) ->
            err = error
            res = response
            done()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with unknown user id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/users/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid token and known user id', ->

      user = new User name: 'Joe'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        request
          .get('/v1/users/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a list of users', ->
        res.body.name.should.equal user.name




  describe 'POST /v1/users', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .post('/v1/users')
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


    describe 'with valid data', ->

      user = new User name: 'Joe'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'insert').callsArgWith(1, null, user)
        request
          .post("/v1/users")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'Joe' })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.insert.restore()

      it 'should respond 201', ->
        res.statusCode.should.equal 201

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'name'


    describe 'with invalid data', ->

      user = new User name: false
      validation = user.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'insert').callsArgWith(1, validation, undefined)
        request
          .post("/v1/users")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.insert.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'PATCH /v1/users/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .patch('/v1/users/uuid')
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


    describe 'with unknown user id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'patch').callsArgWith(2, null, null)
        request
          .patch('/v1/users/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.patch.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid data', ->

      user = new User name: 'Jim'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'patch').callsArgWith(2, null, user)
        request
          .patch("/v1/users/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'Jim' })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.patch.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.name.should.equal user.name


    describe 'with invalid data', ->

      user = new User name: false
      validation = user.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'patch').callsArgWith(2, validation, undefined)
        request
          .patch("/v1/users/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.patch.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'DELETE /v1/users/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .del('/v1/users/uuid')
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


    describe 'with unknown user id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'delete').callsArgWith(1, null, null)
        request
          .del('/v1/users/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.delete.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      user = new User name: 'Joe'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'delete').callsArgWith(1, null, user)
        request
          .del('/v1/users/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.delete.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204




