'use strict';
const BaseController = require('./base');
class CategoriesController extends BaseController {
  // get方法直接访问
  async index() {
    try {
      await this.getPager({ modName: 'Category', returnFields: [ 'name' ] });
    } catch (error) {
      this.error(error);
    }
  }
  // 增加文章标签
  // post方法直接访问
  async create() {
    const { ctx } = this;
    const category = ctx.request.body;
    try {
      let doc = await ctx.model.Category.findOne(category);
      if (doc) {
        this.error('此标签已经存在');
      } else {
        doc = await ctx.model.Category.create(category);
        this.success('保存分类成功');
      }
    } catch (error) {
      this.error(error);
    }
  }
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const category = ctx.request.body; // {name:new}
    try {
      await ctx.model.Category.findByIdAndUpdate(id, category);
      this.success('更新成功');
    } catch (error) {
      this.error(error);
    }
  }
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    const { ids = [] } = ctx.request.body;
    ids.push(id);
    try {
      // await ctx.model.Category.findByIdAndRemove(id);
      await ctx.model.Category.remove({ _id: { $in: ids } });
      this.success('删除成功');
    } catch (error) {
      this.error(error);
    }
  }
}
module.exports = CategoriesController;
