'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Signature = exports.Prng = exports.PublicKey = exports.PrivateKey = exports.Hasher = undefined;

var _hasher = require('./lib/hasher.js');

var _hasher2 = _interopRequireDefault(_hasher);

var _privateKey = require('./lib/private-key.js');

var _privateKey2 = _interopRequireDefault(_privateKey);

var _publicKey = require('./lib/public-key.js');

var _publicKey2 = _interopRequireDefault(_publicKey);

var _prng = require('./lib/prng.js');

var _prng2 = _interopRequireDefault(_prng);

var _signature = require('./lib/signature.js');

var _signature2 = _interopRequireDefault(_signature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const prng = new Prng();
// const hasher = new Hasher();
// const key = new PrivateKey(prng.random,hasher);
//
//
// const foreign_keys = [new PrivateKey(prng.random,hasher).public_key,
//                       new PrivateKey(prng.random,hasher).public_key,
//                       new PrivateKey(prng.random,hasher).public_key];
//
//
// const msg = 'one ring to rule them all';
// const signature = key.sign(msg,foreign_keys);
// const public_keys = signature.public_keys;
//
// console.log(msg);
// console.log(`Signature: ${signature}`);
// console.log(public_keys);
// console.log(signature.verify(msg,public_keys));

exports.Hasher = _hasher2.default;
exports.PrivateKey = _privateKey2.default;
exports.PublicKey = _publicKey2.default;
exports.Prng = _prng2.default;
exports.Signature = _signature2.default;