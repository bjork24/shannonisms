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
        tasks: ['libsass', 'autoprefixer', 'cssmin']
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

    autoprefixer: {
      app: {
        src: 'build/app.css',
      }
    },

    open: {
      delayed: {
        path: 'http://localhost:2424',
        app: 'Google Chrome'
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
        tasks: ['connect', 'open', 'watch'],
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

grunt.registerTask('default', ['concurrent:target']);
grunt.registerTask('build', ['jshint', 'uglify', 'libsass', 'autoprefixer', 'cssmin']);

};