# Test dependencies
chai        = require 'chai'
sinon       = require 'sinon'
sinonChai   = require 'sinon-chai'
supertest   = require 'supertest'
expect      = chai.expect




# Assertions
chai.use sinonChai
chai.should()




# Code under test
server = require '../../../../server'
Client   = require '../../../../models/Client'
Role   = require '../../../../models/Role'
AccessToken = require '../../../../models/AccessToken'




# HTTP Client
request = supertest(server)




describe 'Client Roles REST Routes', ->



  {err,res} = {}

  roles = [
    new Role name: 'x'
    new Role name: 'y'
    new Role name: 'z'
  ]


  describe 'GET /v1/clients/:clientId/roles', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .get('/v1/clients/1234/roles')
          .set('Authorization', 'Bearer invalid.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->

      it 'should respond 401', ->
        res.statusCode.should.equal 401

      it 'should respond "Unauthorized"', ->
        res.text.should.contain 'Unauthorized'


    describe 'by default', ->

      before (done) ->
        client = new Client
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        sinon.stub(Role, 'list').callsArgWith(1, null, roles)
        request
          .get('/v1/clients/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()
        Role.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a list', ->
        res.body.should.be.an 'array'
        res.body.length.should.equal roles.length


    describe 'with paging', ->

      it 'should respond 200'
      it 'should respond with JSON'
      it 'should respond with a range'


    describe 'with empty results', ->

      before (done) ->
        client = new Client
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        sinon.stub(Role, 'list').callsArgWith(1, null, [])
        request
          .get('/v1/clients/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()
        Role.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an empty list', ->
        res.body.should.be.an 'array'
        res.body.length.should.equal 0


    describe 'with unknown client', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/clients/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with text', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'



  describe 'PUT /v1/clients/:clientId/roles/:roleId', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .put("/v1/clients/1234/roles/5678")
          .set('Authorization', 'Bearer invalid.token')
          .send({})
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->

      it 'should respond 401', ->
        res.statusCode.should.equal 401

      it 'should respond "Unauthorized"', ->
        res.text.should.contain 'Unauthorized'


    describe 'with valid data', ->

      before (done) ->
        client = new Client
        client.addRoles = (id, cb) ->
          cb()
        role = roles[0]
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        request
          .put("/v1/clients/#{client._id}/roles/#{role._id}")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()
        Role.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'added'


    describe 'with unknown client', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/clients/unknown/roles/any")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with unknown role', ->

      before (done) ->
        client = new Client
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/clients/uuid/roles/unknown")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        Client.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'




  describe 'DELETE /v1/clients/:id', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .del('/v1/clients/1234/roles/5678')
          .set('Authorization', 'Bearer invalid.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->

      it 'should respond 401', ->
        res.statusCode.should.equal 401

      it 'should respond "Unauthorized"', ->
        res.text.should.contain 'Unauthorized'


    describe 'with unknown client', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, null)
        request
          .del("/v1/clients/1234/roles/5678")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      before (done) ->
        client = new Client
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Client, 'get').callsArgWith(1, null, client)
        sinon.stub(Client.prototype, 'removeRoles').callsArgWith(
          1, null, [ null, true ]
        )
        request
          .del("/v1/clients/1234/roles/5678")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Client.get.restore()
        Client.prototype.removeRoles.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204
        res.text.should.eql ''
        res.body.should.eql {}





