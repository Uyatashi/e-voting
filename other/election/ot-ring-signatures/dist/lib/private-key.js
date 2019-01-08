'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _publicKey = require('./public-key.js');

var _publicKey2 = _interopRequireDefault(_publicKey);

var _signature = require('./signature.js');

var _signature2 = _interopRequireDefault(_signature);

var _bn = require('bn.js');

var _bn2 = _interopRequireDefault(_bn);

var _shuffleArray = require('shuffle-array');

var _shuffleArray2 = _interopRequireDefault(_shuffleArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PrivateKey = function () {
  function PrivateKey(value, hasher) {
    _classCallCheck(this, PrivateKey);

    this.value = new _bn2.default(value.toString(), 16);
    this.hasher = hasher;
    this.public_key = new _publicKey2.default(this.hasher.G.mul(this.value), this.hasher);
    this.key_image = this.hasher.hash_point(this.public_key.point).mul(this.value); //I = x*Hp(P)
  }

  _createClass(PrivateKey, [{
    key: 'sign',
    value: function sign(message, foreign_keys) {
      var message_digest = this.hasher.hash_string(message);
      var seed = this.hasher.hash_array([this.value, message_digest]);

      var all_keys = foreign_keys.slice();
      all_keys.push(this);
      (0, _shuffleArray2.default)(all_keys);

      var q_array = this.generate_q(all_keys, seed); // hex numbers
      var w_array = this.generate_w(all_keys, seed); // hex number + 1 BN

      var ll_array = this.generate_ll(all_keys, q_array, w_array);
      var rr_array = this.generate_rr(all_keys, q_array, w_array, this.key_image);

      var challenge_arr = [message_digest];
      challenge_arr = challenge_arr.concat(ll_array);
      challenge_arr = challenge_arr.concat(rr_array);
      var challenge = this.hasher.hash_array(challenge_arr);

      var c_array = this.generate_c(all_keys, q_array, w_array, challenge);
      var r_array = this.generate_r(all_keys, q_array, w_array, c_array, challenge);

      var public_keys = [];
      for (var i = 0; i < all_keys.length; i++) {
        if (all_keys[i] instanceof PrivateKey) {
          public_keys.push(all_keys[i].public_key);
        } else {
          public_keys.push(all_keys[i]);
        }
      }

      return new _signature2.default(this.key_image, c_array, r_array, public_keys, this.hasher);
    }
  }, {
    key: 'generate_r',
    value: function generate_r(all_keys, q_array, w_array, c_array, challenge) {
      var r_array = [];
      for (var i = 0; i < all_keys.length; i++) {
        if (all_keys[i] instanceof _publicKey2.default) {
          r_array.push(new _bn2.default(q_array[i], 16));
        } else {
          var ri = new _bn2.default(q_array[i], 16).sub(all_keys[i].value.mul(c_array[i]));
          ri = ri.umod(this.hasher.l);
          r_array.push(ri);
        }
      }
      return r_array;
    }
  }, {
    key: 'generate_c',
    value: function generate_c(all_keys, q_array, w_array, challenge) {
      var c_array = [];
      for (var i = 0; i < all_keys.length; i++) {
        if (all_keys[i] instanceof _publicKey2.default) {
          c_array.push(new _bn2.default(w_array[i], 16));
        } else {
          var chNum = new _bn2.default(challenge, 16);
          var wSum = w_array.reduce(function (acc, val) {
            return acc = acc.add(new _bn2.default(val, 16));
          }, new _bn2.default(0, 16));
          var ci = chNum.sub(wSum).umod(this.hasher.l);
          c_array.push(ci);
        }
      }
      return c_array;
    }
  }, {
    key: 'generate_rr',
    value: function generate_rr(all_keys, q_array, w_array, key_image) {
      var rr_array = [];

      for (var i = 0; i < all_keys.length; i++) {
        var rri = all_keys[i].point;
        rri = this.hasher.hash_point(rri);
        rri = rri.mul(new _bn2.default(q_array[i], 16));
        if (all_keys[i] instanceof _publicKey2.default) {
          rri = rri.add(key_image.mul(new _bn2.default(w_array[i], 16)));
        }
        rr_array.push(rri);
      }
      return rr_array;
    }
  }, {
    key: 'generate_ll',
    value: function generate_ll(all_keys, q_array, w_array) {
      var ll_array = [];
      for (var i = 0; i < all_keys.length; i++) {
        var lli = this.hasher.G.mul(new _bn2.default(q_array[i], 16));
        ll_array.push(lli);
        if (all_keys[i] instanceof _publicKey2.default) {
          ll_array[i] = ll_array[i].add(all_keys[i].point.mul(new _bn2.default(w_array[i], 16)));
        }
      }
      return ll_array;
    }
  }, {
    key: 'generate_w',
    value: function generate_w(all_keys, seed) {
      var w_array = [];
      for (var i = 0; i < all_keys.length; i++) {
        if (all_keys[i] instanceof _publicKey2.default) {
          w_array.push(this.hasher.hash_array(['w', seed, i]));
        } else {
          w_array.push(new _bn2.default(0, 16));
        }
      }
      return w_array;
    }
  }, {
    key: 'generate_q',
    value: function generate_q(all_keys, seed) {
      var q_array = [];
      for (var i = 0; i < all_keys.length; i++) {
        var qi = this.hasher.hash_array(['q', seed, i]);
        q_array.push(qi);
      }
      return q_array;
    }
  }, {
    key: 'point',
    get: function get() {
      return this.public_key.point;
    }
  }]);

  return PrivateKey;
}();

exports.default = PrivateKey;