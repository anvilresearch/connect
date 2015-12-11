# req =
#         scopes: [
#           {
#             name: 'openid',
#             description: 'View your identity',
#             restricted: false
#           },
#           {
#             name: 'profile',
#             description: 'View your basic account info',
#             restricted: false,
#             attributes: {
#               user: [
#                 'name', 'family_name', 'given_name', 'middle_name', 'nickname',
#                 'preferred_username', 'profile', 'picture', 'website', 'gender',
#                 'birthdate', 'zoneinfo', 'locale', 'updated_at'
#               ]
#             }
#           },
#           {
#             name: 'email',
#             description: 'View your email address',
#             restricted: false,
#             attributes: {
#               user: ['email', 'email_verified']
#             }
#           },
#           {
#             name: 'address',
#             description: 'View your address',
#             restricted: false,
#             attributes: {
#               user: ['address']
#             }
#           },
#           {
#             name: 'phone',
#             description: 'View your phone number',
#             restricted: false,
#             attributes: {
#               user: ['phone_number', 'phone_number_verified']
#             }
#           },
#           {
#             name: 'client',
#             description: 'Register and configure clients'
#           },
#           {
#             name: 'realm',
#             description: 'Configure the security realm'
#           }
#       ]

chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




chai.use sinonChai
chai.should()



User              = require '../../../models/User'
getUserInfo       = require('../../../oidc').getUserInfo



describe 'get User Info Endpoint', ->

  {req,res,next,err} = {}

  user =
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

  describe 'with a valid token and profile scope', ->

    before (done) ->

      sinon.stub(User, 'get').callsArgWith(1, null, user)

      req =
        scopes: [
          {
            name: 'openid',
            description: 'View your identity',
            restricted: false
          },
          {
            name: 'profile',
            description: 'View your basic account info',
            restricted: false,
            attributes: {
              user: [
                'name', 'family_name', 'given_name', 'middle_name', 'nickname',
                'preferred_username', 'profile', 'picture', 'website', 'gender',
                'birthdate', 'zoneinfo', 'locale', 'updated_at'
              ]
            }
          }
        ]

      res =
        json: sinon.spy()
      next = sinon.spy (error) ->
        err = error
        done()

      getUserInfo req, res, next
      done()

    after ->
      User.get.restore()

    it 'should respond with user profile attributes', ->
      res.json.should.have.been.calledWith sinon.match({
          name: sinon.match.string()
        })
    it 'shouldn\'t respond with attributes other than those it was scoped for', ->
      

  describe 'with a valid token and email scope', ->
  describe 'with a valid token and address scope', ->
  describe 'with a valid token and phone scope', ->



  describe 'with a valid token and insufficient scope', ->
    


  describe 'with an invalid token', ->



  describe 'without a token', ->
    
    
    
