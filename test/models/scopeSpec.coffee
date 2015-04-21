# Test dependencies
cwd       = process.cwd()
path      = require 'path'
faker     = require 'faker'
chai      = require 'chai'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'
expect    = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
Modinha = require 'modinha'
Scope   = require path.join(cwd, 'models/Scope')




# Redis lib for spying and stubbing
redis   = require('fakeredis')
client  = redis.createClient()
multi   = redis.Multi.prototype
rclient = redis.RedisClient.prototype
Scope.__client = client




describe 'Scope', ->

  describe 'schema', ->

    it 'should use name for unique identifier', ->
      Scope.uniqueId.should.equal 'name'

    it 'should require name'
    it 'should require description'
    it 'should have a false default property by default'
    it 'should have a false restricted property by default'



  describe 'determine', ->

    {scp, scps} = {}

    before (done) ->
      scopes = [
        new Scope { name: 'a', description: 'a', restricted: true }
        new Scope { name: 'b', description: 'b', restricted: true }
        new Scope { name: 'c', description: 'c', restricted: true }
        new Scope { name: 'd', description: 'd', restricted: false }
        new Scope { name: 'e', description: 'e', restricted: false }
        new Scope { name: 'f', description: 'f', restricted: false }
      ]
      sinon.stub(Scope, 'get').callsArgWith(1, null, scopes)
      reqScopes  = 'a b c d e f unknown' # requested by client
      subScopes  = 'b' # explicitly permitted via role
      subject =
        authorizedScope: sinon.stub().callsArgWith(0, null, subScopes)

      Scope.determine reqScopes, subject, (error, result, results) ->
        err = error
        scp = result
        scps = results
        done()

    after ->
      Scope.get.restore()

    it 'should ignore unknown scopes', ->
      scp.should.not.contain 'unknown'

    it 'should not include unauthorized restricted scopes', ->
      scp.should.not.contain 'a'
      scp.should.not.contain 'c'

    it 'should include authorized restricted scopes', ->
      scp.should.contain 'b'

    it 'should include requested unrestricted scopes', ->
      scp.should.contain 'd'
      scp.should.contain 'e'
      scp.should.contain 'f'

    it 'should include default scopes'



