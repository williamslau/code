'use strict';
const BaseController = require('./base');

class ArticlesController extends BaseController {
    // 查询分类
    async index() {
        try {
            // await this.getPager('Article', [ 'title', 'content' ]);
            await this.getPager({
                modName: 'Article',
                returnFields: ['title', 'content'],
                populateFields: ['category', 'classify', 'user', 'comments.user']
            })
        } catch (error) {
            this.error(error);
        }
    }

    async create() {
        const {ctx} = this;
        const article = ctx.request.body;
        article.user = this.user;
        try {
            await ctx.model.Article.create(article);
            this.success('文章发表成功');
        } catch (error) {
            this.error(error);
        }
    }

    async update() {
        const {ctx} = this;
        const id = ctx.params.id;
        const argicle = ctx.request.body;
        try {
            await ctx.model.Article.findByIdAndUpdate(id, argicle);
            this.success('更新文章成功');
        } catch (error) {
            this.error(error);
        }
    }

    async destroy() {
        const {ctx} = this;
        const id = ctx.params.id;
        const {ids = []} = ctx.request.body;
        ids.push(id);
        try {
            // await ctx.model.Article.findByIdAndRemove(id);
            await ctx.model.Article.remove({_id: {$in: ids}});
            this.success('删除成功');
        } catch (error) {
            this.error(error);
        }
    }

    async addPv() {
        const {ctx} = this;
        const id = ctx.params.id;
        try {
            await ctx.model.Article.findByIdAndUpdate(id, {$inc: {pv: 1}});
            this.success('修改pv成功');
        } catch (error) {
            this.error(error);
        }
    }

    async addComment() {
        const {ctx} = this;
        const id = ctx.params.id;
        const comment = ctx.request.body;
        comment.user = this.user;
        try {
            await ctx.model.Article.findByIdAndUpdate(id, {$push: {comments: comment}});
            this.success('评论成功');
        } catch (error) {
            this.error(error);
        }
    }

    async removeComment() {
        const {ctx} = this;
        const {article_id, comment_id} = ctx.params;
        try {
            await ctx.model.Article.findByIdAndUpdate(article_id, {$pull: {comments: {_id: comment_id}}});
            this.success('刪除评论成功');
        } catch (error) {
            this.error(error);
        }
    }

    async getArticles(){
        const {ctx} =this;
        const id = ctx.params.id;
        try{
            let article=await ctx.model.Article.findOne({_id:id})
                .populate('category')
                .populate('classify');
            this.success(article);
        }catch(error){
            this.error(error);
        }
    }
}

module.exports = ArticlesController;
