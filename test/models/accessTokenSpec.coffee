# Test dependencies
cwd         = process.cwd()
path        = require 'path'


# Test dependencies
cwd       = process.cwd()
path      = require 'path'
Faker     = require 'Faker'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
Modinha     = require 'modinha'
AccessToken = require path.join(cwd, 'models/AccessToken')




# Redis lib for spying and stubbing
redis   = require('fakeredis')
client  = redis.createClient()
multi   = redis.Multi.prototype
rclient = redis.RedisClient.prototype
AccessToken.__client = client


describe 'AccessToken', ->

  {err,validation,instance} = {}


  #before ->

  #  # Mock data
  #  data = []

  #  for i in [0..9]
  #    data.push
  #      name:     "#{Faker.Name.firstName()} #{Faker.Name.lastName()}"
  #      email:    Faker.Internet.email()
  #      hash:     'private'
  #      password: 'secret1337'

  #  users = User.initialize(data, { private: true })
  #  jsonUsers = users.map (d) ->
  #    User.serialize(d)
  #  ids = users.map (d) ->
  #    d._id


  describe 'schema', ->

    beforeEach ->
      instance = new AccessToken
      validation = instance.validate()

    it 'should have unique identifier', ->
      AccessToken.schema[AccessToken.uniqueId].should.be.an.object

    it 'should generate a default access token', ->
      instance.at.length.should.equal 20

    it 'should require an access token', ->
      AccessToken.schema.at.required.should.equal true

    it 'should use the access token as unique identifier', ->
      AccessToken.uniqueId.should.equal 'at'

    it 'should have token type', ->
      AccessToken.schema.tt.type.should.equal 'string'

    it 'should enumerate token types', ->
      AccessToken.schema.tt.enum.should.contain 'Bearer'
      AccessToken.schema.tt.enum.should.contain 'mac'

    it 'should default token type to "Bearer"', ->
      instance.tt.should.equal 'Bearer'

    it 'should have expires in', ->
      AccessToken.schema.ei.type.should.equal 'number'

    it 'should default expires in to 3600 seconds', ->
      instance.ei.should.equal 3600

    it 'should have refresh token', ->
      AccessToken.schema.rt.type.should.equal 'string'

    it 'should index refresh token as unique', ->
      AccessToken.schema.rt.unique.should.equal true

    it 'should require client id', ->
      validation.errors.cid.attribute.should.equal 'required'

    it 'should require user id', ->
      validation.errors.uid.attribute.should.equal 'required'

    it 'should require scope', ->
      validation.errors.scope.attribute.should.equal 'required'

    # TIMESTAMPS

    it 'should have "created" timestamp', ->
      AccessToken.schema.created.default.should.equal Modinha.defaults.timestamp

    it 'should have "modified" timestamp', ->
      AccessToken.schema.modified.default.should.equal Modinha.defaults.timestamp




  describe 'indexing', ->




  describe 'exchange', ->

    {res, instance} = {}

    describe 'with invalid request', ->

      before (done) ->
        sinon.stub(AccessToken, 'insert').callsArgWith(1, new Error)
        req =
          code:
            user_id:    'uuid1'
            client_id:   false    # this will cause a validation error
            max_age:     600
            scope:      'openid profile'
        AccessToken.exchange req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide an error', ->
        expect(err).to.be.an.object

      it 'should not provide a value', ->
        expect(res).to.equal undefined


    describe 'with valid request', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          code:
            user_id:    'uuid1'
            client_id:  'uuid2'    # this will cause a validation error
            max_age:     600
            scope:      'openid profile'

        AccessToken.exchange req, (error, result) ->
          err = error
          instance = result
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide an instance', ->
        expect(instance).to.be.instanceof AccessToken

      it 'should provide a refresh token', ->
        AccessToken.insert.should.have.been.calledWith sinon.match({
          rt: sinon.match.string
        })

      it 'should expire in the default duration', ->
        instance.ei.should.equal AccessToken.schema.ei.default




  describe 'issue', ->

    {res} = {}

    describe 'with invalid request', ->

      before (done) ->
        sinon.stub(AccessToken, 'insert').callsArgWith(1, new Error)
        req =
          user: {}
          client: {}
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide an error', ->
        expect(err).to.be.an.object

      it 'should not provide a value', ->
        expect(res).to.equal undefined


    describe 'with valid request', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2' }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide an "issue" projection of the token', ->
        res.access_token.length.should.equal 20

      it 'should expire in the default duration', ->
        res.expires_in.should.equal AccessToken.schema.ei.default


    describe 'with max_age parameter', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2', default_max_age: 7777 }
          connectParams: { max_age: '1000' }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should set expires_in from max_age', ->
        AccessToken.insert.should.have.been.calledWith sinon.match({
          ei: 1000
        })


    describe 'with client default_max_age property', ->

      before (done) ->
        instance = new AccessToken
        sinon.stub(AccessToken, 'insert').callsArgWith(1, null, instance)
        req =
          user:   { _id: 'uuid1' }
          client: { _id: 'uuid2', default_max_age: 7777 }
        AccessToken.issue req, (error, response) ->
          err = error
          res = response
          done()

      after ->
        AccessToken.insert.restore()

      it 'should set expires_in from default_max_age', ->
        AccessToken.insert.should.have.been.calledWith sinon.match({
          ei: 7777
        })




  describe 'refresh', ->

    describe 'with unknown refresh token', ->

      before (done) ->
        sinon.stub(AccessToken, 'getByRt').callsArgWith(1, null, null)
        AccessToken.refresh 'r3fr3sh', 'uuid', (error, result) ->
          err = error
          instance = result
          done()

      after ->
        AccessToken.getByRt.restore()

      it 'should provide an error', ->
        expect(err).to.be.instanceof AccessToken.InvalidTokenError

      it 'should not provide a token', ->
        expect(instance).to.be.undefined


    describe 'with mismatching client id', ->

      before (done) ->
        sinon.stub(AccessToken, 'getByRt').callsArgWith(1, null, { cid: 'uuid' })
        AccessToken.refresh 'r3fr3sh', 'wrong', (error, result) ->
          err = error
          instance = result
          done()

      after ->
        AccessToken.getByRt.restore()

      it 'should provide an error', ->
        expect(err).to.be.instanceof AccessToken.InvalidTokenError

      it 'should not provide a token', ->
        expect(instance).to.be.undefined


    describe 'with valid token', ->

      before (done) ->
        sinon.stub(AccessToken, 'delete').callsArgWith(1, null)
        sinon.stub(AccessToken, 'getByRt').callsArgWith(1, null, {
          at:     't0k3n'
          uid:    'uuid1'
          cid:    'uuid2'
          ei:      600
          scope:  'openid profile'
        })
        AccessToken.refresh 'r3fr3sh', 'uuid2', (error, result) ->
          err = error
          instance = result
          done()

      after ->
        AccessToken.delete.restore()
        AccessToken.getByRt.restore()

      it 'should delete the existing token', ->
        AccessToken.delete.should.have.been.calledWith 't0k3n'

      it 'should provide a null error', ->
        expect(err).to.be.null

      it 'should provide a new token instance', ->
        expect(instance).to.be.instanceof AccessToken




