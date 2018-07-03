'use strict';
const BaseController = require('./base');
class ClassifiesController extends BaseController {
    // get方法直接访问
    async index() {
        try {
            await this.getPager({ modName: 'Classify', returnFields: [ 'name' ] });
        } catch (error) {
            this.error(error);
        }
    }
    // 增加文章标签
    // post方法直接访问
    async create() {
        const { ctx } = this;
        const classify = ctx.request.body;
        try {
            let doc = await ctx.model.Classify.findOne(classify);
            if (doc) {
                this.error('此标签已经存在');
            } else {
                doc = await ctx.model.Classify.create(classify);
                this.success('保存分类成功');
            }
        } catch (error) {
            this.error(error);
        }
    }
    async update() {
        const { ctx } = this;
        const id = ctx.params.id;
        const classify = ctx.request.body; // {name:new}
        try {
            await ctx.model.Classify.findByIdAndUpdate(id, classify);
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
            // await ctx.model.Classify.findByIdAndRemove(id);
            await ctx.model.Classify.remove({ _id: { $in: ids } });
            this.success('删除成功');
        } catch (error) {
            this.error(error);
        }
    }
}
module.exports = ClassifiesController;
