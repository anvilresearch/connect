chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




User          = require '../../../models/User'
patchUserInfo = require('../../../oidc').patchUserInfo




describe 'Update UserInfo', ->

  user = new User
    _id: 'uuid'
    name: 'name'
    givenName: 'givenName'
    familyName: 'familyName'
    middleName: 'middleName'
    nickname: 'nickname'
    preferredUsername: 'preferredUsername'
    profile: 'profile'
    picture: 'picture'
    website: 'website'
    email: 'email'
    emailVerified: true
    dateEmailVerified: Date.now()
    gender: 'gender'
    birthdate: 'birthdate'
    zoneinfo: 'zoneinfo'
    locale: 'locale'
    phoneNumber: 'phoneNumber'
    phoneNumberVerified: true
    address:
      test: 'hello world'

  scopes =
    openid:
      name: 'openid'
      description: 'View your identity'
      restricted: false
    profile:
      name: 'profile'
      description: 'View your basic account info'
      restricted: false
      attributes:
        user: [
          'name', 'family_name', 'given_name',
          'middle_name', 'nickname',
          'preferred_username', 'profile', 'picture',
          'website', 'gender',
          'birthdate', 'zoneinfo', 'locale', 'updated_at'
        ]
    email:
      name: 'email',
      description: 'View your email address',
      restricted: false,
      attributes:
        user: ['email', 'email_verified']
    address:
      name: 'address',
      description: 'View your address',
      restricted: false,
      attributes:
        user: ['address']
    phone:
      name: 'phone',
      description: 'View your phone number',
      restricted: false,
      attributes:
        user: ['phone_number', 'phone_number_verified']




  describe 'with unknown user', ->

    {req,res,next,err,status,json} = {}

    before (done) ->
      json = sinon.spy()
      status = sinon.spy -> json: json
      sinon.stub(User, 'patch')
        .callsArgWith(2, null, null)

      req =
        claims: sub: 'uuid'
        scopes: [scopes.profile, scopes.phone]
        body: givenName: 'changeme'
      res = status: status
      next = sinon.spy (error) ->
        err = error
        done()

      patchUserInfo req, res, next

    after ->
      User.patch.restore()

    it 'should not respond 200', ->
      res.status.should.not.have.been.called

    it 'should not respond with userinfo', ->
      json.should.not.have.been.called

    it 'should provide a NotFoundError', ->
      next.should.have.been.calledWith sinon.match({
        name: 'NotFoundError'
      })




  describe 'with invalid data', ->

    {req,res,next,err,status,json} = {}

    before (done) ->
      json = sinon.spy()
      status = sinon.spy -> json: json
      sinon.stub(User, 'patch')
        .callsArgWith(2, new Error('Validation error'))

      req =
        claims: sub: 'uuid'
        scopes: [scopes.profile, scopes.phone]
        body: givenName: 13 # should cause validation err
      res = status: status
      next = sinon.spy (error) ->
        err = error
        done()

      patchUserInfo req, res, next

    after ->
      User.patch.restore()

    it 'should not respond 200', ->
      res.status.should.not.have.been.called

    it 'should not respond with userinfo', ->
      json.should.not.have.been.called

    it 'should provide an error', ->
      next.should.have.been.calledWith err




  describe 'with valid data', ->

    {req,res,next,err,status,json} = {}

    before (done) ->
      json = sinon.spy()
      status = sinon.spy -> json: json
      sinon.stub(User, 'patch')
        .callsArgWith(2, null, user)

      req =
        claims: sub: 'uuid'
        scopes: [scopes.profile, scopes.phone]
        body: givenName: 13 # should cause validation err
      res = status: status
      next = sinon.spy()

      patchUserInfo req, res, next
      done()

    after ->
      User.patch.restore()

    it 'should respond 200', ->
      status.should.have.been.calledWith 200

    it 'should respond with attributes by scope', ->
      json.should.have.been.calledWith sinon.match({
        name: sinon.match.string
        phone_number: sinon.match.string
      })

    it 'should not provide an error', ->
      next.should.not.have.been.called


