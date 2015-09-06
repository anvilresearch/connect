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
Role   = require '../../../../models/Role'
Scope   = require '../../../../models/Scope'
AccessToken = require '../../../../models/AccessToken'




# HTTP Client
request = supertest(server)




describe 'Role Scopes REST Routes', ->



  {err,res} = {}

  scopes = [
    new Scope name: 'x'
    new Scope name: 'y'
    new Scope name: 'z'
  ]


  describe 'GET /v1/roles/:roleId/scopes', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .get('/v1/roles/1234/scopes')
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
        role = new Role
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        sinon.stub(Scope, 'list').callsArgWith(1, null, scopes)
        request
          .get('/v1/roles/1234/scopes')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        Scope.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with a list', ->
        res.body.should.be.an 'array'
        res.body.length.should.equal scopes.length


    describe 'with paging', ->

      it 'should respond 200'
      it 'should respond with JSON'
      it 'should respond with a range'


    describe 'with empty results', ->

      before (done) ->
        role = new Role
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        sinon.stub(Scope, 'list').callsArgWith(1, null, [])
        request
          .get('/v1/roles/1234/scopes')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        Scope.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an empty list', ->
        res.body.should.be.an 'array'
        res.body.length.should.equal 0


    describe 'with unknown role', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/roles/1234/scopes')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with text', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'



  describe 'PUT /v1/roles/:roleId/scopes/:scopeId', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .put("/v1/roles/1234/scopes/5678")
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
        role = new Role
        scope = scopes[0]
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        sinon.stub(Scope, 'get').callsArgWith(1, null, scope)
        request
          .put("/v1/roles/#{role._id}/scopes/#{scope._id}")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        Scope.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'added'


    describe 'with unknown role', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/roles/unknown/scopes/any")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with unknown scope', ->

      before (done) ->
        role = new Role
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        sinon.stub(Scope, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/roles/uuid/scopes/unknown")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Scope.get.restore()
        Role.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'




  describe 'DELETE /v1/roles/:id', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .del('/v1/roles/1234/scopes/5678')
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


    describe 'with unknown role', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .del("/v1/roles/1234/scopes/5678")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      before (done) ->
        role = new Role
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        sinon.stub(Role.prototype, 'removeScopes').callsArgWith(
          1, null, [ null, true ]
        )
        request
          .del("/v1/roles/1234/scopes/5678")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        Role.prototype.removeScopes.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204
        res.text.should.eql ''
        res.body.should.eql {}




