'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateKeyPairs = generateKeyPairs;

var _hasher = require('./lib/hasher.js');

var _hasher2 = _interopRequireDefault(_hasher);

var _prng = require('./lib/prng.js');

var _prng2 = _interopRequireDefault(_prng);

var _privateKey = require('./lib/private-key.js');

var _privateKey2 = _interopRequireDefault(_privateKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateKeyPairs(num) {
  var hasher = new _hasher2.default();
  var prng = new _prng2.default();

  var keyPairs = [];
  for (var i = 0; i < num; i++) {
    keyPairs.push(new _privateKey2.default(prng.random, hasher));
  }
  console.log(num + ' key pairs generated successfully.');
  return keyPairs;
};