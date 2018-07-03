'use strict';

// had enabled by egg
// exports.static = true;

// 启用mongoose
exports.mongoose = {
  enabled: true,
  package: 'egg-mongoose',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};