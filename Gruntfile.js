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
          'prod/jquery.plug.min.js':   'dev/jquery.plug.js',
        },
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
        options: {reload: true }
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

};