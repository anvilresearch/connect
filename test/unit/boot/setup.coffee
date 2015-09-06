# Test dependencies
cwd         = process.cwd()
fs          = require 'fs'
path        = require 'path'
chai        = require 'chai'
sinon       = require 'sinon'
sinonChai   = require 'sinon-chai'
expect      = chai.expect




# Configure Chai and Sinon
chai.use sinonChai
chai.should()




# Code under test
setup       = require path.join(cwd, 'boot/setup')
User        = require path.join(cwd, 'models/User')




describe 'Setup', ->

  describe 'out-of-box detector', ->

    describe 'with no authority users', ->

      {err,result} = {}

      before (done) ->
        sinon.stub(User, 'list').callsArgWith(1, null, [])
        setup.isOOB (error, isOOB) ->
          err = error
          result = isOOB
          done()

      after ->
        User.list.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide true', ->
        expect(result).to.equal true


    describe 'with an authority user', ->

      {err,result} = {}

      before (done) ->
        sinon.stub(User, 'list').callsArgWith(1, null, [
          User.initialize()
        ])
        setup.isOOB (error, isOOB) ->
          err = error
          result = isOOB
          done()

      after ->
        User.list.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide false', ->
        expect(result).to.equal false

  describe 'token reader/writer', ->

    describe 'with existing token file', ->

      {err,token} = {}

      before (done) ->
        sinon.stub fs, 'readFileSync', ->
          toString: ->
            '0123456789abcdef'
        sinon.stub fs, 'writeFileSync'

        setup.readSetupToken (error, setupToken) ->
          err = error
          token = setupToken
          done()

      after ->
        fs.readFileSync.restore()
        fs.writeFileSync.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide the token in the file', ->
        expect(token).to.equal '0123456789abcdef'

      it 'should not write to the token file', ->
        fs.writeFileSync.should.not.have.been.called

    describe 'with no token file', ->

      {err,token} = {}

      before (done) ->
        sinon.stub fs, 'readFileSync', ->
          throw new Error()
        sinon.stub fs, 'writeFileSync'

        setup.readSetupToken (error, setupToken) ->
          err = error
          token = setupToken
          done()

      after ->
        fs.readFileSync.restore()
        fs.writeFileSync.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide a new token', ->
        expect(token).to.be.a 'string'

      it 'should create a token file', ->
        fs.writeFileSync.should.have.been.called

    describe 'with blank token file', ->

      {err,token} = {}

      before (done) ->
        sinon.stub fs, 'readFileSync', ->
          toString: ->
            ''
        sinon.stub fs, 'writeFileSync'

        setup.readSetupToken (error, setupToken) ->
          err = error
          token = setupToken
          done()

      after ->
        fs.readFileSync.restore()
        fs.writeFileSync.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide a new token', ->
        expect(token).to.be.a 'string'

      it 'should create a token file', ->
        fs.writeFileSync.should.have.been.called

    describe 'with whitespace-filled token file', ->

      {err,token} = {}

      before (done) ->
        sinon.stub fs, 'readFileSync', ->
          toString: ->
            '        '
        sinon.stub fs, 'writeFileSync'

        setup.readSetupToken (error, setupToken) ->
          err = error
          token = setupToken
          done()

      after ->
        fs.readFileSync.restore()
        fs.writeFileSync.restore()

      it 'should not provide an error', ->
        expect(err).to.not.be.ok

      it 'should provide a new token', ->
        expect(token).to.be.a 'string'

      it 'should create a token file', ->
        fs.writeFileSync.should.have.been.called
