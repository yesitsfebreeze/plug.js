module.exports = function(grunt) {
  // import global settings
  // Project configuration
  var nl         = '\n  ';
  var plugbanner = '/*'+nl;
  plugbanner    += '<%= pkg.name %>.js';
  plugbanner    += nl;
  plugbanner    += 'Version: <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>';
  plugbanner    += nl;
  plugbanner    += 'http://hvlmnns.github.io/plug.js/';
  plugbanner    += nl;
  plugbanner    += 'The MIT License (MIT)';
  plugbanner    += nl;
  plugbanner    += 'Copyright (c) 2015 hvlmnns';
  plugbanner    += '\n*/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      buildUgly: {
        options: {
          sourceMap: true,
          banner: plugbanner
        },
        files: {
          'prod/plug.min.js':   'dev/plug.js',
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