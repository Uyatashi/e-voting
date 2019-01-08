'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bn = require('bn.js');

var _bn2 = _interopRequireDefault(_bn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PublicKey = function PublicKey(point, hasher) {
  _classCallCheck(this, PublicKey);

  this.point = point;
  this.hasher = hasher;
};

exports.default = PublicKey;