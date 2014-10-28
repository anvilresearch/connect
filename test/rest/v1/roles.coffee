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
Role = require '../../../models/Role'
AccessToken = require '../../../models/AccessToken'




request = supertest(server)




describe 'RESTful Role Routes', ->




  {err, res} = {}




  describe 'GET /v1/roles', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/roles')
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
          .get('/v1/roles')
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

      it 'should respond with a list of roles', ->
        res.body.should.be.an 'array'




  describe 'GET /v1/roles/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/roles/uuid')
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


    describe 'with unknown role id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/roles/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.equal 'Not found.'


    describe 'with valid token and known role id', ->

      role = new Role name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        request
          .get('/v1/roles/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a resource', ->
        res.body.name.should.equal role.name




  describe 'POST /v1/roles', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .post('/v1/roles')
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

      role = new Role name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'insert').callsArgWith(1, null, role)
        request
          .post("/v1/roles")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'custom' })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.insert.restore()

      it 'should respond 201', ->
        res.statusCode.should.equal 201

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'name'


    describe 'with invalid data', ->

      role = new Role name: false
      validation = role.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'insert').callsArgWith(1, validation, undefined)
        request
          .post("/v1/roles")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ application_type: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.insert.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'PATCH /v1/roles/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .patch('/v1/roles/uuid')
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


    describe 'with unknown role id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'patch').callsArgWith(2, null, null)
        request
          .patch('/v1/roles/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.patch.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.equal 'Not found.'


    describe 'with valid data', ->

      role = new Role name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'patch').callsArgWith(2, null, role)
        request
          .patch("/v1/roles/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'custom' })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.patch.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.name.should.equal role.name


    describe 'with invalid data', ->

      role = new Role name: false
      validation = role.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'patch').callsArgWith(2, validation, undefined)
        request
          .patch("/v1/roles/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.patch.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'DELETE /v1/roles/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .del('/v1/roles/uuid')
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


    describe 'with unknown role id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'delete').callsArgWith(1, null, null)
        request
          .del('/v1/roles/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.delete.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.equal 'Not found.'


    describe 'with valid request', ->

      role = new Role name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'delete').callsArgWith(1, null, role)
        request
          .del('/v1/roles/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.delete.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204




