'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1528191835773_5576';

  // add your config here
  config.middleware = [];

  // 配置mongoose
  // mongoose是node里面操作mongodb数据库的一个模块
  // 它可以以对象的形式操作数据库
  config.mongoose = {
    client: {
      url: 'mongodb://localhost/users',
    },
  };
  // 关闭csrf安全防护
  config.security = {
    csrf: false,
    domainWhiteList: ['http://localhost','http://192.168.1.116:3000','http://localhost:3001']
  };
  config.cors = {
    credentials: true
  };
  return config;
};
