'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bn = require('bn.js');

var _bn2 = _interopRequireDefault(_bn);

var _keccak = require('keccak');

var _keccak2 = _interopRequireDefault(_keccak);

var _elliptic = require('elliptic');

var _publicKey = require('./public-key.js');

var _publicKey2 = _interopRequireDefault(_publicKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hasher = function () {
  function Hasher() {
    _classCallCheck(this, Hasher);

    this.ec = new _elliptic.eddsa('ed25519');
  }

  _createClass(Hasher, [{
    key: 'hash_string',
    value: function hash_string(message) {
      var msgHash = (0, _keccak2.default)('keccak256').update(message).digest('hex');
      msgHash = new _bn2.default(msgHash.toString(), 16);
      msgHash = msgHash.mod(this.l);
      msgHash = msgHash.toString(16);

      return msgHash;
    }
  }, {
    key: 'hash_point',
    value: function hash_point(point) {
      var pointArr = [point.x, point.y];
      return this.G.mul(new _bn2.default(this.hash_array(pointArr), 16));
    }
  }, {
    key: 'hash_array',
    value: function hash_array(array) {
      var hash_array = [];

      for (var i = 0; i < array.length; i++) {
        if (array[i].isArray != undefined && array[i].isArray()) {
          hash_array.push(this.hash_array(array[i]));
        } else if (array[i] instanceof _publicKey2.default) {
          hash_array.push(this.hash_point(array[i].point));
        } else if (array[i] instanceof _bn2.default) {
          var hash_i = array[i].toString(16);
          hash_i = this.hash_string(hash_i);
          hash_array.push(hash_i);
        } else if (typeof array[i] === 'string') {
          hash_array.push(this.hash_string(array[i]));
        } else if (typeof array[i] === 'number') {
          hash_array.push(this.hash_string(array[i].toString()));
        } else if (array[i].x !== undefined && array[i].y !== undefined) {
          hash_array.push(this.hash_string(array[i].encode('hex').toString()));
        } else {
          console.log(array[i]);
          throw 'hash_array() case not implemented';
        }
      }
      var concat = hash_array.reduce(function (acc, val) {
        return acc += val.toString();
      });

      return this.hash_string(concat);
    }
  }, {
    key: 'G',
    get: function get() {
      return this.ec.g;
    }
  }, {
    key: 'l',
    get: function get() {
      return this.ec.curve.n;
    }
  }]);

  return Hasher;
}();

exports.default = Hasher;