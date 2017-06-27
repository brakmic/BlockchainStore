// CoreJS
// import 'core-js/es6';
// import 'core-js/es7';
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es6/typed';
import 'core-js/es6/reflect';
// import 'core-js/es6/promise';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

// Apple Safari `requestAnimationFrame` polyfills
import requestFrame from 'platform/polyfills/request-frame-alt';
requestFrame('native');
