# Test dependencies
chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
supertest = require 'supertest'
expect = chai.expect


# Allow all requests to localhost
nock = require 'nock'
nock.enableNetConnect('127.0.0.1')



# Assertions
chai.use sinonChai
chai.should()



# Code under test
server = require '../../../../server'
Client = require '../../../../models/Client'
AccessToken = require '../../../../models/AccessToken'




request = supertest(server)




describe 'RESTful Client Routes', ->




  {err, res} = {}




  describe 'GET /v1/clients', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/clients')
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
          .get('/v1/clients')
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

      it 'should respond with a list of clients', ->
        res.body.should.be.an 'array'




  describe 'GET /v1/clients/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .get('/v1/clients/uuid')
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


    describe 'with unknown client id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/clients/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid token and known client id', ->

      client = new Client

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        request
          .get('/v1/clients/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a resource', ->
        res.body.application_type.should.equal client.application_type




  describe 'POST /v1/clients', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .post('/v1/clients')
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

      client = new Client

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'insert').callsArgWith(1, null, client)
        request
          .post("/v1/clients")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({})
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.insert.restore()

      it 'should respond 201', ->
        res.statusCode.should.equal 201

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'application_type'


    describe 'with invalid data', ->

      client = new Client name: false
      validation = client.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'insert').callsArgWith(1, validation, undefined)
        request
          .post("/v1/clients")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ application_type: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.insert.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'PATCH /v1/clients/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .patch('/v1/clients/uuid')
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


    describe 'with unknown client id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'patch').callsArgWith(2, null, null)
        request
          .patch('/v1/clients/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.patch.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid data', ->

      client = new Client name: 'Jim'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'patch').callsArgWith(2, null, client)
        request
          .patch("/v1/clients/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: 'Jim' })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.patch.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.application_type.should.equal client.application_type


    describe 'with invalid data', ->

      client = new Client name: false
      validation = client.validate()

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'patch').callsArgWith(2, validation, undefined)
        request
          .patch("/v1/clients/uuid")
          .set('Authorization', 'Bearer valid.signed.token')
          .send({ name: false })
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.patch.restore()

      it 'should respond 400', ->
        res.statusCode.should.equal 400

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an error', ->
        res.body.error.should.equal 'Validation error.'




  describe 'DELETE /v1/clients/:id', ->

    describe 'without valid token', ->

      before (done) ->
        request
          .del('/v1/clients/uuid')
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


    describe 'with unknown client id', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'delete').callsArgWith(1, null, null)
        request
          .del('/v1/clients/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.delete.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found."', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      client = new Client name: 'Joe'

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'delete').callsArgWith(1, null, client)
        request
          .del('/v1/clients/uuid')
          .set('Authorization', 'Bearer valid.signed.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.delete.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204




