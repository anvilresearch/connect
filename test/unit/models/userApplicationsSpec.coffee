# Test dependencies
cwd       = process.cwd()
path      = require 'path'
faker     = require 'faker'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
mockMulti = require '../lib/multi'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
userApplications = require path.join(cwd, 'models/UserApplications')
User = require path.join(cwd, 'models/User')
Client = require path.join(cwd, 'models/Client')




# Redis lib for spying and stubbing
Redis   = require('ioredis')
rclient = Redis.prototype
{client,multi} = {}




describe 'User Applications', ->

  before ->
    client = new Redis(12345)
    multi = mockMulti(rclient)
    Client.__client = client

  after ->
    rclient.multi.restore()

  {err,res,clients} = {}

  # Mock data
  data = []

  for i in [0..9]
    data.push
      _id: "uuid-#{i}"
      client_name: faker.company.companyName()
      client_uri: "http://#{faker.internet.domainName()}"
      application_type: 'web'
      logo_uri: faker.image.imageUrl()
      trusted: true

  data[1].scopes = ['n0p3']
  data[2].scopes = ['a', 'b', 'c']

  clients = Client.initialize(data)
  jsonClients = clients.map (d) ->
    Client.serialize(d)
  ids = clients.map (d) -> d._id
  scopes = ['openid', 'profile', 'a', 'b', 'c']
  visited = ids.slice(4)


  before (done) ->
    user = new User
    sinon.stub(User.prototype, 'authorizedScope').callsArgWith(0, null, scopes)
    sinon.stub(rclient, 'hmget').callsArgWith(2, null, jsonClients)
    sinon.stub(rclient, 'zrevrange').callsArgWith(3, null, visited)
    userApplications user, (error, results) ->
      err = error
      res = results
      done()

  after ->
    User.prototype.authorizedScope.restore()
    rclient.hmget.restore()
    rclient.zrevrange.restore()

  it 'should include client id', ->
    res.forEach (client) ->
      expect(client._id).to.be.defined

  it 'should include client name', ->
    res.forEach (client) ->
      expect(client.client_name).to.be.defined

  it 'should include client uri', ->
    res.forEach (client) ->
      expect(client.client_uri).to.be.defined

  it 'should include application_type', ->
    res.forEach (client) ->
      expect(client.application_type).to.be.defined

  it 'should include logo_uri', ->
    res.forEach (client) ->
      expect(client.logo_uri).to.be.defined

  it 'should include scopes', ->
    res.forEach (client) ->
      expect(client.scopes).to.be.defined

  it 'should include created', ->
    res.forEach (client) ->
      expect(client.created).to.be.defined

  it 'should include modified', ->
    res.forEach (client) ->
      expect(client.modified).to.be.defined

  it 'should include visited', ->
    res.forEach (client) ->
      expect(client.visited).to.be.defined

  it 'should not include client secret', ->
    res.forEach (client) ->
      expect(client.client_secret).to.be.undefined

  it 'should not include unauthorized clients', ->
    res.forEach (client) ->
      client.scopes.should.not.contain 'w00t'




