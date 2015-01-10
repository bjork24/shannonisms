module.exports = function (grunt) {

  'use strict';
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 2424,
          base: '.',
          livereload: true,
          keepalive: true
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        reload: true,
        forever: true
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['libsass', 'cssmin']
      },
      html: {
        files: ['**/*.html'],
        tasks: ['bytesize']
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'uglify', 'bytesize']
      }
    },

    libsass: {
      dist: {
        src: 'src/scss/app.scss',
        dest: 'build/app.css'
      }
    },

    cssmin: {
      combine: {
        files: {
          'build/app.min.css': ['build/app.css']
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['connect', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: {
        src: ['src/js/*.js', 'Gruntfile.js']
      },
      options: {
        jshintrc: true,
        force: true,
        ignores: ['public/js/vendor/*.js']
      }
    },

    bytesize: {
      all: {
        src: ['build/*']
      }
    },

    uglify: {
      target: {
        files: {
          'build/app.min.js': ['src/js/vendor/*.js', 'src/js/app.js']
        }
      }
    }

  });

grunt.registerTask('server', ['concurrent:target']);
grunt.registerTask('build', ['jshint', 'uglify', 'libsass', 'cssmin']);

};