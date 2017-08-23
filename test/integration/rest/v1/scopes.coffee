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
Scope = require '../../../../models/Scope'
AccessToken = require '../../../../models/AccessToken'




request = supertest(server)




describe 'RESTful Scope Routes', ->




  {err, res} = {}




  describe 'GET /v1/scopes', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/scopes')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      it 'should respond 40x', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with valid token', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'list').callsArgWith 1, null, []
        request
          .get('/v1/scopes')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a list of scopes', ->
        res.body.should.be.an 'array'




  describe 'GET /v1/scopes/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/scopes/uuid')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with unknown scope id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/scopes/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid token and known scope id', ->

      scope = new Scope name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'get').callsArgWith(1, null, scope)
        request
          .get('/v1/scopes/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a resource', ->
        res.body.name.should.equal scope.name




  describe 'POST /v1/scopes', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .post('/v1/scopes')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      it 'should respond 40x', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with valid data', ->

      scope = new Scope name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'insert').callsArgWith(1, null, scope)
        request
          .post("/v1/scopes")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'custom' })
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.insert.restore()

      it 'should respond 201', ->
        res.statusCode.should.equal 201

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'name'


    describe 'with invalid data', ->

      scope = new Scope name: false
      validation = scope.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'insert').callsArgWith(1, validation, undefined)
        request
          .post("/v1/scopes")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ application_type: false })
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.insert.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.contain 'validation_error'




  describe 'PATCH /v1/scopes/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .patch('/v1/scopes/uuid')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      it 'should respond 40x', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with unknown scope id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'patch').callsArgWith(2, null, null)
        request
          .patch('/v1/scopes/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.patch.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid data', ->

      scope = new Scope name: 'custom'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'patch').callsArgWith(2, null, scope)
        request
          .patch("/v1/scopes/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'custom' })
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.patch.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.name.should.equal scope.name


    describe 'with invalid data', ->

      scope = new Scope name: false
      validation = scope.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'patch').callsArgWith(2, validation, undefined)
        request
          .patch("/v1/scopes/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: false })
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.patch.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.contain 'validation_error'




  describe 'DELETE /v1/scopes/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .del('/v1/scopes/uuid')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      it 'should respond 40x', ->
        res.statusCode.should.equal 400

      it 'should respond with error', ->
        res.body.error.should.equal 'invalid_request'

      it 'should respond with error_description', ->
        res.body.error_description.should.equal 'An access token is required'


    describe 'with unknown scope id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'delete').callsArgWith(1, null, null)
        request
          .del('/v1/scopes/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.delete.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      scope = new Scope name: 'Joe'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Scope, 'delete').callsArgWith(1, null, scope)
        request
          .del('/v1/scopes/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()
        return

      after ->
        AccessToken.verify.restore()
        Scope.delete.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204




