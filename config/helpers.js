/**
 * @author: Harris Brakmic
 */

const path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';

// Helper functions
const _root = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function hasNpmFlag(flag) {
  return EVENT.includes(flag);
}

// function root(args) {
//   args = Array.prototype.slice.call(arguments, 0);
//   return path.join.apply(path, [_root].concat(args));
// }

const root = path.join.bind(path, _root);

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}

function getAbsolutePath(relativePath) {
  var dir = path.dirname(module.parent.filename);
  return path.join(dir, relativePath);
}

function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

function prependExt(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function(memo, val) {
    return memo.concat(val, args.map(function(prefix) {
      return prefix + val;
    }));
  }, ['']);
}

function packageSort(packages) {
  // packages = ['polyfills', 'vendor', 'main']
  var len = packages.length - 1;
  var first = packages[0];
  var last = packages[len];
  return function sort(a, b) {
    // polyfills always first
    if (a.names[0] === first) {
      return -1;
    }
    // main always last
    if (a.names[0] === last) {
      return 1;
    }
    // vendor before app
    if (a.names[0] !== first && b.names[0] === last) {
      return -1;
    } else {
      return 1;
    }
  }
}

function reverse(arr) {
  return arr.reverse();
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server$/.exec(process.argv[1]));
}

exports.reverse = reverse;
exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.root = root;
exports.rootNode = rootNode;
exports.prependExt = prependExt;
exports.prepend = prependExt;
exports.packageSort = packageSort;
exports.getAbsolutePath = getAbsolutePath;
exports.isWebpackDevServer = isWebpackDevServer;
exports.checkNodeImport = checkNodeImport;
