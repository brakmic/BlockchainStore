/**
 * @author: Harris Brakmic
 */
require('ts-node/register');
var helpers = require('./helpers');
exports.config = {
    baseUrl: 'http://localhost:3000/',
    // use `npm run e2e`
    specs: [
        helpers.root('src/e2e-tests/app/**/**.e2e.ts'),
        helpers.root('src/e2e-tests/app/**/*.e2e.ts')
    ],
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine2',
    allScriptsTimeout: 110000,
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    directConnect: false,
    multiCapabilities: [
      {
        'browserName': 'internet explorer',
        'platform': 'ANY',
        'version': '11'
      },
      {
        'browserName': 'firefox'
      },
      {
        browserName: 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
      }
    ],
    onPrepare: function() {
        browser.ignoreSynchronization = true;
        require(helpers.root('node_modules/zone.js/dist/zone-node'));
    },
    // A callback function called once tests are finished.
    // onComplete can optionally return a promise, which Protractor will wait for
    // before shutting down webdriver.
    onComplete: function() {
      // At this point, tests will be done but global objects will still be
      // available.
    },
    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on
     * the page instead of just the one matching
     * `rootEl`
     */
    useAllAngular2AppRoots: true
};