module.exports = grunt => {

  const isDev = process.env.NODE_ENV === 'production'
    ? true
    : false

  const files = {
    js: [
      [ 'client/js/**/*.js', 'common/js/**/*.js' ],
      'client/_build/bundle.js'
    ],
    css: [
      [ 'client/css/**/*.css' ],
      'client/_build/bundle.min.css'
    ]
  }

  grunt.initConfig({
    watch: {
      css: {
        files: files.css[0],
        tasks: ['postcss']
      },
      js: {
        files: files.js[0],
        tasks: ['browserify']
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        options: {
          transform: [
            [ 'babelify', { presets: 'es2015' } ],
          ],
          browserifyOptions: {
            debug: isDev
          }
        },
        files: {
          [ files.js[1] ]: files.js[0]
        }
      }
    },

    postcss: {
      options: {
        map: isDev,
        processors: [
          require('level4')(),
          require('postcss-import')(),
          require('autoprefixer')(),
          require('cssnano')()
        ]
      },
      dist: {
        files: {
          [ files.css[1] ]: files.css[0]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['postcss', 'browserify']);
}

