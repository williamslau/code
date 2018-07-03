'use strict';

// const { Controller } = require('egg');
const BaseController = require('./base');
class UsersController extends BaseController {
  async signup() {
    // 1.得到请求体
    const { ctx } = this;
    // ctx.body已经代理到ctx.response.body了
    // 所以想得到请求体就必须用ctx.require。body了
    let user = ctx.request.body;
    try {
      // 保存数据库
      console.log(ctx.request);
      user = await ctx.model.User.create(user);
      // ctx.body = {
      //   code: 0,
      //   data: { user },
      // };
      this.success({ user });
    } catch (error) {

      // ctx.body = {
      //   code: 1,
      //   data: error,
      // };
      this.error(error);
    }
  }
  async signin() {
    const { ctx } = this;
    let user = ctx.request.body;
    try {
      user = await ctx.model.User.findOne(user);
      if (user) {
        // 如果登陆成功了，则需要写入session会话
        // 可以通过ctx.session.user是否为null来判断用户是否登陆
        ctx.session.user = user;
        this.success({ user });
      } else {
        this.error('用户名或密码错误');
      }
    } catch (error) {
      this.error(error);
    }
  }
  async signout() {
    this.ctx.session.user = null;
    this.success('退出成功');
  }
}

module.exports = UsersController;
