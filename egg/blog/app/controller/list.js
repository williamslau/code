'use strict';

const BaseController = require('./base');

class ListController extends BaseController {
    async getList() {
        const {ctx} = this;
        let {pageNum = 1, pageSize = 5, keyword = '', link = '', category = ''} = ctx.query;
        pageNum = isNaN(pageNum) ? 1 : parseInt(pageNum);
        pageSize = isNaN(pageSize) ? 5 : parseInt(pageSize);
        try {
            let query = {$or: [{title: new RegExp(keyword)}]};
            if (link) query.classify = link;
            if (category) query.category = category;
            let items = await ctx.model.Article.find(query, {comments: 0, user: 0})
                .sort({_id: -1})
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .populate('category')
                .populate('classify');
            let total = await ctx.model.Article.count(query);
            this.success({
                pageNum,
                pageSize,
                items,
                total
            });
        } catch (error) {
            this.error(error);
        }
    }

    async getNewList() {
        const {ctx} = this;
        try {
            let items = await ctx.model.Article.find({}, {_id: 1, title: 1})
                .sort({_id: -1});
            this.success({
                items,
            });
        } catch (error) {
            this.error(error);
        }
    }

    async getCategory() {
        const {ctx} = this;
        try {
            let items = await ctx.model.Category.find().sort({_id: -1});
            this.success({
                items,
            });
        } catch (e) {
            this.error(e);
        }
    }
}

module.exports = ListController;
