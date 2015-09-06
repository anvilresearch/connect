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
User   = require '../../../../models/User'
Role   = require '../../../../models/Role'
AccessToken = require '../../../../models/AccessToken'




# HTTP Client
request = supertest(server)




describe 'User Roles REST Routes', ->



  {err,res} = {}

  roles = [
    new Role name: 'x'
    new Role name: 'y'
    new Role name: 'z'
  ]


  describe 'GET /v1/users/:userId/roles', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .get('/v1/users/1234/roles')
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
        user = new User
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        sinon.stub(Role, 'list').callsArgWith(1, null, roles)
        request
          .get('/v1/users/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()
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
        user = new User
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        sinon.stub(Role, 'list').callsArgWith(1, null, [])
        request
          .get('/v1/users/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()
        Role.list.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with an empty list', ->
        res.body.should.be.an 'array'
        res.body.length.should.equal 0


    describe 'with unknown user', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, null)
        request
          .get('/v1/users/1234/roles')
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with text', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'



  describe 'PUT /v1/users/:userId/roles/:roleId', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .put("/v1/users/1234/roles/5678")
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
        user = new User
        role = roles[0]
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        sinon.stub(Role, 'get').callsArgWith(1, null, role)
        request
          .put("/v1/users/#{user._id}/roles/#{role._id}")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()
        Role.get.restore()

      it 'should respond 200', ->
        res.statusCode.should.equal 200

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'application/json'

      it 'should respond with the resource', ->
        res.body.should.have.property 'added'


    describe 'with unknown user', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/users/unknown/roles/any")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with unknown role', ->

      before (done) ->
        user = new User
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        sinon.stub(Role, 'get').callsArgWith(1, null, null)
        request
          .put("/v1/users/uuid/roles/unknown")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        Role.get.restore()
        User.get.restore()

      it 'should respond 404', ->
        res.statusCode.should.equal 404

      it 'should respond with JSON', ->
        res.headers['content-type'].should.contain 'text/html'

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'




  describe 'DELETE /v1/users/:id', ->

    describe 'without authentication', ->

      before (done) ->
        request
          .del('/v1/users/1234/roles/5678')
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


    describe 'with unknown user', ->

      before (done) ->
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, null)
        request
          .del("/v1/users/1234/roles/5678")
          .set('Authorization', 'Bearer valid.access.token')
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

      it 'should respond with "Not found" error', ->
        res.text.should.contain 'Not found.'


    describe 'with valid request', ->

      before (done) ->
        user = new User
        sinon.stub(AccessToken, 'verify').callsArgWith(2, null, {})
        sinon.stub(User, 'get').callsArgWith(1, null, user)
        sinon.stub(User.prototype, 'removeRoles').callsArgWith(
          1, null, [ null, true ]
        )
        request
          .del("/v1/users/1234/roles/5678")
          .set('Authorization', 'Bearer valid.access.token')
          .end (error, response) ->
            err = error
            res = response
            done()

      after ->
        AccessToken.verify.restore()
        User.get.restore()
        User.prototype.removeRoles.restore()

      it 'should respond 204', ->
        res.statusCode.should.equal 204
        res.text.should.eql ''
        res.body.should.eql {}




