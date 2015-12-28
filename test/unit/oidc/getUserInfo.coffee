chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()




User              = require '../../../models/User'
getUserInfo       = require('../../../oidc').getUserInfo




describe 'UserInfo', ->




  {req,res,next,err,json} = {}




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




  describe 'with a valid token', ->

    before (done) ->
      sinon.stub(User, 'get').callsArgWith(1, null, user)
      json = sinon.spy()

      req =
        claims: sub: 'uuid'
        scopes: [ scopes.openid, scopes.profile ]

      res = status: sinon.spy -> { json: json }
      next = sinon.spy()

      getUserInfo req, res, next
      done()

    after ->
      User.get.restore()

    it 'should respond with the sub claim', ->
      json.should.have.been.calledWith sinon.match({
        sub: 'uuid'
      })

    it 'should respond with permitted attributes', ->
      json.should.have.been.calledWith sinon.match({
        sub: sinon.match.string
        name: sinon.match.string
        family_name: sinon.match.string
        middle_name: sinon.match.string
        given_name: sinon.match.string
        nickname: sinon.match.string
        preferred_username: sinon.match.string
        profile: sinon.match.string
        picture: sinon.match.string
        website: sinon.match.string
        gender: sinon.match.string
        birthdate: sinon.match.string
        zoneinfo: sinon.match.string
        locale: sinon.match.string
        updated_at: sinon.match.number
      })

    it 'should not respond with attributes not permitted', ->
      json.should.not.have.been.calledWith sinon.match({
        email: sinon.match.string
      })

