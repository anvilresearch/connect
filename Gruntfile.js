module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-release')
  grunt.loadNpmTasks('grunt-conventional-changelog')

  grunt.initConfig({
    conventionalChangelog: {
      options: {
        changelogOpts: {
          // conventional-changelog options go here
          // preset: 'angular'
        },
        context: {
          // context goes here
        },
        gitRawCommitsOpts: {
          // git-raw-commits options go here
        },
        parserOpts: {
          // conventional-commits-parser options go here
        },
        writerOpts: {
          // conventional-changelog-writer options go here
        }

      },
      release: {
        src: 'CHANGELOG.md'
      }
    }
  })

  grunt.registerTask('changelog', ['conventionalChangelog'])
}
