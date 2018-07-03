

const { Controller } = require('egg');

class NewsController extends Controller {
    async index() {
        let { ctx } = this;
        // 后端渲染
        // let news = [
        //     {
        //         title: '百度',
        //         url: 'www.baidu.com'
        //     }, {
        //         title: '淘宝',
        //         url: 'www.taobao.com'
        //     }
        // ]
        // this.ctx.body = 'news';
        
        let news = await this.ctx.service.news.fetch();
        await ctx.render('news.ejs', { news });
    }
}
module.exports = NewsController;