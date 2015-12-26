# Test dependencies
chai      = require 'chai'
cwd       = process.cwd()
expect    = chai.expect
fs        = require 'fs'
path      = require 'path'
sinon     = require 'sinon'
sinonChai = require 'sinon-chai'

# Configure Chai and Sinon
chai.use sinonChai
chai.should()

# Code under test
ensureWritableDirectory = require(path.join(cwd, 'lib/fs-utils')).ensureWritableDirectory

describe 'fs-utils', ->

  describe 'ensureWritableDirectory', ->
    target_path = 'foo/bar/baz'

    before (done) ->
      sinon.stub(console, 'error')
      sinon.stub(process, 'exit')
      done()

    beforeEach (done) ->
      sinon.stub(fs, 'access').callsArgWith(2, { code: 'EACCES' })
      console.error.reset()
      process.exit.reset()
      done()

    after ->
      console.error.restore()
      process.exit.restore()

    afterEach ->
      fs.access.restore()
      fs.stat.restore()
      fs.mkdir.restore()

    it 'should create the directory if it does not exist', ->
      sinon.stub(fs, 'mkdir')
      sinon.stub(fs, 'stat').callsArgWith(1, { code: 'ENOENT' })

      ensureWritableDirectory(target_path)

      fs.stat.should.have.been.calledWithMatch(target_path)
      fs.mkdir.should.have.been.calledWithMatch(target_path)

    it 'should error out if the directory cannot be created', ->
      sinon.stub(fs, 'mkdir').callsArgWith(1, {}) # Call callback with an error object
      sinon.stub(fs, 'stat').callsArgWith(1, { code: 'ENOENT' })

      ensureWritableDirectory(target_path)

      console.error.should.have.been.called
      process.exit.should.have.been.calledWith(1)

    it 'should error out if the target path is not a directory', ->
      sinon.stub(fs, 'mkdir')
      sinon.stub(fs, 'stat').callsArgWith(1, null, { isDirectory: -> false })

      ensureWritableDirectory(target_path)

      console.error.should.have.been.called
      process.exit.should.have.been.calledWith(1)

    it 'should error out if the target path is not writable', ->
      sinon.stub(fs, 'mkdir')
      sinon.stub(fs, 'stat').callsArgWith(1, null, { isDirectory: -> true })

      ensureWritableDirectory(target_path)

      fs.access.should.have.been.calledWith(target_path, fs.W_OK)

      console.error.should.have.been.called
      process.exit.should.have.been.calledWith(1)
