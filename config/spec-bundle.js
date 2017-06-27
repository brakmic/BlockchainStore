/**
 * @author: Harris Brakmic
 */
/*
 * When testing with webpack and ES6, we have to do some extra
 * things to get testing to work right. Because we are gonna write tests
 * in ES6 too, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it will compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */
Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy'); // since zone.js 0.6.15
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch'); // put here since zone.js 0.6.14
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('hammerjs');

// RxJS
require('rxjs/Rx');
require('../src/platform/helpers/bows-alt');
window.jQuery = window.$ = require('../src/vendor/jquery/jquery-2.2.3.min');
require('../src/vendor/cldrjs/dist/node_main');
window.Globalize = require('../src/vendor/globalize/dist/node-main');
require('../src/vendor/bcs-dx');

const likelySubtags = {
    supplemental: {
        version: {
            _cldrVersion: '28',
            _unicodeVersion: '8.0.0',
            _number: '$Revision: 11965 $'
        },
        likelySubtags: {
            en: 'en-Latn-US',
            de: 'de-Latn-DE',
            fr: 'fr-Latn-FR',
            es: 'es-Latn-ES',
            it: 'it-Latn-IT',
            pt: 'pt-Latn-PT',
            ru: 'ru-Cyrl-RU',
            ja: 'ja-Jpan-JP'
        }
    }
};


window.Globalize.load(likelySubtags);
window.Globalize.locale('en-US');

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.resetTestEnvironment();
testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);

/*
 * Ok, this is kinda crazy. We can use the context method on
 * require that webpack created in order to tell webpack
 * what files we actually want to require or import.
 * Below, context will be a function/object with file names as keys.
 * Using that regex we are saying look in ../src then find
 * any file that ends with spec.ts and get its path. By passing in true
 * we say do this recursively
 */
var testContext = require.context('../src', true, /\.spec\.ts/);

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
var modules = requireAll(testContext);
