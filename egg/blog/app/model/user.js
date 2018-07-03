'use strict';

// mongodb和mysql不一样，不需要事先创建数据库，集合

module.exports = app => {
  // 先得到mongoose的模块，通过他可以定义骨架模型和model
  const mongoose = app.mongoose;
  // 先定义Schema 通过他可以定义集合里文档的属性名和类型
  const Schema = mongoose.Schema;
  // 用户集合的模型骨架，它不连接数据库，也不操作数据库，只是定义属性名和类型
  const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
  });
  // 返回一个数据模型，用户模型是可以对数据库进行增删改查的
  return mongoose.model('User', UserSchema);
};
