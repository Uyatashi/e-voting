'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bn = require('bn.js');

var _bn2 = _interopRequireDefault(_bn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Signature = function () {
  function Signature(key_image, c_array, r_array, public_keys, hasher) {
    _classCallCheck(this, Signature);

    this.key_image = key_image;
    this.c_array = c_array;
    this.r_array = r_array;
    this.hasher = hasher;
    this.public_keys = public_keys;
  }

  _createClass(Signature, [{
    key: 'verify',
    value: function verify(message, public_keys) {
      var ll_array = [];
      var rr_array = [];

      ll_array = this.generate_ll(public_keys, this.c_array, this.r_array, this.hasher);
      rr_array = this.generate_rr(public_keys, this.c_array, this.r_array, this.hasher, this.key_image);

      var c_sum = this.c_summation(this.c_array, this.hasher);
      c_sum = c_sum.umod(this.hasher.l).toString('hex');

      var message_digest = this.hasher.hash_string(message);
      var challenge_arr = [message_digest];
      challenge_arr = challenge_arr.concat(ll_array);
      challenge_arr = challenge_arr.concat(rr_array);
      var challenge = this.hasher.hash_array(challenge_arr);
      challenge = new _bn2.default(challenge, 16).toString('hex');

      return challenge === c_sum;
    }
  }, {
    key: 'c_summation',
    value: function c_summation(c_array, hasher) {
      var summation = new _bn2.default(0, 16);
      for (var i = 0; i < c_array.length; i++) {
        summation = summation.add(c_array[i]);
      }
      return summation;
    }
  }, {
    key: 'generate_ll',
    value: function generate_ll(public_keys, c_array, r_array, hasher) {
      var ll_array = [];
      for (var i = 0; i < public_keys.length; i++) {
        var rG = hasher.G.mul(new _bn2.default(r_array[i], 16));
        var cP = public_keys[i].point.mul(new _bn2.default(c_array[i], 16));
        ll_array.push(rG.add(cP)); //L' = rG + cP
      }
      return ll_array;
    }
  }, {
    key: 'generate_rr',
    value: function generate_rr(public_keys, c_array, r_array, hasher, key_image) {
      var rr_array = [];
      for (var i = 0; i < public_keys.length; i++) {
        var cI = key_image.mul(new _bn2.default(c_array[i], 16));
        var HpP = hasher.hash_point(public_keys[i].point);
        var rHp = HpP.mul(new _bn2.default(r_array[i], 16));
        rr_array.push(cI.add(rHp));
      }
      return rr_array;
    }
  }]);

  return Signature;
}();

exports.default = Signature;