/**
 * @author: Harris Brakmic
 */
var helpers = require('./helpers');
module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js')({env: 'test'});

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: [
      'jasmine'
    ],

    // list of files to exclude
    exclude: [ ],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      { pattern: './config/spec-bundle.js', watched: false },
      { pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false }
    ],

     /*
     * By default all assets are served at http://localhost:[PORT]/base/
     */
    proxies: {
      "/assets/": "/base/src/assets/"
    },
    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    },

    mochaReporter: {
        showDiff: true,
        colors: {
          success: 'green',
          info: 'blue',
          warning: 'cyan',
          error: 'red'
        },
        symbols: {
          success: '+',
          info: '#',
          warning: '!',
          error: 'x'
        }
     },

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: { stats: 'errors-only'},

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: [ 'mocha', 'coverage', 'remap-coverage' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'Chrome'
    ],

    customLaunchers: {
      // ChromeTravisCi: {
      //   base: 'Chrome',
      //   flags: ['--no-sandbox']
      // }
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      },
    },

    plugins: [
              'karma-coverage',
              'karma-remap-coverage',
              'karma-mocha-reporter',
              'karma-webpack',
              'karma-chrome-launcher',
              'karma-jasmine',
              'karma-sourcemap-loader',
              'karma-mocha-reporter',
              'karma-phantomjs-launcher'
    ],

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true
  };

  if (process.env.TRAVIS){
    configuration.browsers = [
      // 'ChromeTravisCi',
      'PhantomJS'
    ];
  }

  config.set(configuration);
};
