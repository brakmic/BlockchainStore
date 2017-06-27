// Vendor scripts go here
// -----------------------
import jQuery from 'jquery';
(window as any).$ = jQuery;
(window as any).jQuery = (window as any).$;
import 'vendor/jquery-ui/development-bundle/ui/jquery-ui.custom.js';
// CryptoJS
import 'vendor/cryptojs/rollups/sha512.js';
// DOM4 Polyfills for IE
import 'platform/helpers/dom4.js';

// Hammjer.js
import 'hammerjs';

import 'vendor/jquery/jquery.hammer.js';

// Lodash
// import * as _ from 'lodash';
// Themes
import 'bootstrap-loader';
import 'font-awesome-sass-loader';

// Prevent Ghost Clicks (for Hammer.js)
import 'platform/helpers/browser-events';

// Circular JSON (for better serializing of complex objects)
import 'circular-json';

if ('production' === ENV) {
  // Production

} else {
    // Development
  Error.stackTraceLimit = Infinity;

  /* tslint:disable no-var-requires */
  require('zone.js/dist/long-stack-trace-zone');
}
