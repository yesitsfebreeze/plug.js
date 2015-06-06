module.exports = function(grunt) {
  // import global settings
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      buildUgly: {
        options: {
          sourceMap: true
        },
        files: {
          'lib/plug.min.js':   'dev/plug.js',
          'lib/jquery.latest.min.js': 'dev/jquery.latest.js',
          'lib/hyphenator.min.js': 'dev/hyphenator.js',
          'lib/page.min.js': 'dev/page.js',
        },
      }
    },
    stylus: {
      compile: {
        options: {
          sourceMap: true
        },
        files: {
          'lib/style.css': 'dev/styles.styl'
        },
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "index.html": ["dev/jade/index.jade"]
        }
      }
    },
    watch: {
      gruntchange: {
        files: ['Gruntfile.js'],
        options: {reload: true }
      },
      js: {
        files: ['dev/**/*.js'],
        tasks: ['uglify'],
      },
      jade: {
        files: ['dev/jade/**/*.jade','dev/jade/**/*.js'],
        tasks: ['jade'],
      },
      styl: {
        files: ['dev/**/*.styl'],
        tasks: ['stylus'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

};