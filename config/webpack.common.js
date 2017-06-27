/**
 * @author: Harris Brakmic
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const resolveNgRoute = require('@angularclass/resolve-angular-routes');
const ngcWebpack = require('ngc-webpack');
const WatchIgnorePlugin = require('webpack/lib/WatchIgnorePlugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const AOT = helpers.hasNpmFlag('aot');

const METADATA = {
  port: 3000,
  host: 'localhost',
  title: 'BlockchainStore',
  urlPrefix: '',
  baseUrl: 'app',
  isDevServer: helpers.isWebpackDevServer()
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
 var isProd = options.env === 'production';
 return {

   /*
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {

    'polyfills': './src/init/polyfills.browser.ts',
    'bcs': AOT ? './src/init/bcs.browser.aot.ts' :
                    './src/init/bcs.browser.ts',
    'main':      AOT ? './src/init/main.browser.aot.ts' :
                  './src/init/main.browser.ts'

  },

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['.ts', '.js', '.json', '.css', '.scss', ],

    // An array of directory names to be resolved to the current directory
    modules: [
        helpers.root('src'),
        helpers.root('src/app'),
        helpers.root('node_modules')
    ],
    alias: {
      'request-frame': helpers.root('src/platform/polyfills/request-frame.js'),
      'lodash': helpers.root('node_modules/lodash/index.js'),
      'config.json': helpers.root('src/config.json'),
      'bows': helpers.root('src/platform/helpers/bows-alt.js')
    },

  },

  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    /*
     * An array of automatically applied loaders.
     *
     * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
     * This means they are not resolved relative to the configuration file.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-loaders
     */
    rules: [
      /*
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
     /*
         * Typescript loader support for .ts
         *
         * Component Template/Style integration using `angular2-template-loader`
         * Angular 2 lazy loading (async routes) via `ng-router-loader`
         *
         * `ng-router-loader` expects vanilla JavaScript code, not TypeScript code. This is why the
         * order of the loader matter.
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         * See: https://github.com/shlomiassaf/ng-router-loader
         */
        {
          test: /\.ts$/,
          use: [
            {
              loader: '@angularclass/hmr-loader',
              options: {
                pretty: !isProd,
                prod: isProd
              }
            },
            { // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
              loader: 'ng-router-loader',
              options: {
                loader: 'async-import',
                genDir: 'compiled',
                aot: AOT
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.webpack.json'
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
      /*
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        use: 'json-loader'
      },

      /*
       * Raw loader support for *.css files
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.css$/,
        use: ['to-string-loader', 'raw-loader', 'css-loader'],
        exclude: [helpers.root('src', 'themes/default')]
        //use: ['raw-loader']
      },
      /*
      * Load Sass Styles
      * See: See: https://github.com/jtangelder/sass-loader
      */
      {
        test: /\.scss$/,
        use: ['to-string-loader','raw-loader','css-loader','sass-loader'],
        exclude: [helpers.root('src', 'assets/styles/default')]
        // use: ['raw-loader', 'sass-loader']
      },
      {
        test: /initial\.scss$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: 'css-loader!sass-loader?sourceMap'
          })
      },
      {
        test: /\.woff(2)?(\?v=.+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=.+)?$/,
        use: 'file-loader'
      },
      /* Raw loader support for *.html
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },

      /* File loader for supporting images, for example, in CSS files.
      */
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: 'file-loader'
      },

    ]

  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [

    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new CheckerPlugin(),

      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */

      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),

       // Specify the correct order the scripts will be injected in
      new CommonsChunkPlugin({
        name: ['vendor','bcs','polyfills']
      }),


      new ContextReplacementPlugin(
         /**
         * The (\\|\/) piece accounts for path separators in *nix and Windows
         */
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('src'), // location of your src
        {
          /**
           * Your Angular Async Route paths relative to this root directory
           */
        }
      ),


    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
        {
          from: 'src/assets',
          to: 'assets'
        },
        {
          from: 'src/vendor',
          to: 'vendor'
        },
        {
          from: 'src/favicon.ico'
        },
        {
          from: 'src/bcs.png'
        },
        {
          from: 'src/manifest.webapp'
        },
        // {
        //   from: 'src/app/sw/default/default.sw.js'
        // },
        // {
        //   from: 'src/app/sw/default/default.sw.map'
        // },
        {
          from: 'src/assets/robots.txt'
        },
        {
          from: 'src/assets/humans.txt'
        },
        {
          from: 'src/config.json'
        }
        ], {
          ignore: [
            'humans.txt',
            'robots.txt'
        ]
      }),


      /*
      * Plugin: HtmlWebpackPlugin
      * Description: Simplifies creation of HTML files to serve your webpack bundles.
      * This is especially useful for webpack bundles that include a hash in the filename
      * which changes every compilation.
      *
      * See: https://github.com/ampedandwired/html-webpack-plugin
      */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        isDevServer: METADATA.isDevServer,
        favicon: 'src/favicon.ico',
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'body'
      }),

      /*
      * Plugin: ScriptExtHtmlWebpackPlugin
      * Description: Enhances html-webpack-plugin functionality
      * with different deployment options for your scripts including:
      *
      * See: https://github.com/numical/script-ext-html-webpack-plugin
      */
      new ScriptExtHtmlWebpackPlugin({
        sync: /main|bcs|polyfills/,
        defaultAttribute: 'async',
        preload: [/polyfills|bcs|main/],
        prefetch: [/chunk/]
      }),

      /*
      * Plugin: HtmlHeadConfigPlugin
      * Description: Generate html tags based on javascript maps.
      *
      * If a publicPath is set in the webpack output configuration, it will be automatically added to
      * href attributes, you can disable that by adding a "=href": false property.
      * You can also enable it to other attribute by settings "=attName": true.
      *
      * The configuration supplied is map between a location (key) and an element definition object (value)
      * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
      *
      * Example:
      *  Adding this plugin configuration
      *  new HtmlElementsPlugin({
      *    headTags: { ... }
      *  })
      *
      *  Means we can use it in the template like this:
      *  <%= webpackConfig.htmlElements.headTags %>
      *
      * Dependencies: HtmlWebpackPlugin
      */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

       /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({}),

      new ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),

      new ExtractTextPlugin({ filename: 'initial.css', allChunks: true }),

      new DashboardPlugin(),

      // Fix Angular 2
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)async/,
        helpers.root('node_modules/@angular/core/src/facade/async.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)collection/,
        helpers.root('node_modules/@angular/core/src/facade/collection.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)errors/,
        helpers.root('node_modules/@angular/core/src/facade/errors.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)lang/,
        helpers.root('node_modules/@angular/core/src/facade/lang.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)math/,
        helpers.root('node_modules/@angular/core/src/facade/math.js')
      ),

      new ngcWebpack.NgcWebpackPlugin({
        /**
         * If false the plugin is a ghost, it will not perform any action.
         * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
         *
         * The state can not change after initializing the plugin.
         * @default true
         */
        disabled: !AOT,
        tsConfig: helpers.root('tsconfig.webpack.json'),
        /**
         * A path to a file (resource) that will replace all resource referenced in @Components.
         * For each `@Component` the AOT compiler compiles it creates new representation for the templates (html, styles)
         * of that `@Components`. It means that there is no need for the source templates, they take a lot of
         * space and they will be replaced by the content of this resource.
         *
         * To leave the template as is set to a falsy value (the default).
         *
         * TIP: Use an empty file as an overriding resource. It is recommended to use a ".js" file which
         * usually has small amount of loaders hence less performance impact.
         *
         * > This feature is doing NormalModuleReplacementPlugin for AOT compiled resources.
         *
         * ### resourceOverride and assets
         * If you reference assets in your styles/html that are not inlined and you expect a loader (e.g. url-loader)
         * to copy them, don't use the `resourceOverride` feature as it does not support this feature at the moment.
         * With `resourceOverride` the end result is that webpack will replace the asset with an href to the public
         * assets folder but it will not copy the files. This happens because the replacement is done in the AOT compilation
         * phase but in the bundling it won't happen (it's being replaced with and empty file...)
         *
         * @default undefined
         */
      }),

       /**
       * Plugin: InlineManifestWebpackPlugin
       * Inline Webpack's manifest.js in index.html
       *
       * https://github.com/szrenwei/inline-manifest-webpack-plugin
       */
      new InlineManifestWebpackPlugin(),

  ],

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

 };
};
