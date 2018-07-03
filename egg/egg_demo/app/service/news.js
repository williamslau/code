const { Service } = require('egg');
const moment = require('moment');
moment.locale('zh-cn');
class NewsService extends Service {
    // eggjs 里内置了一个方法 用来读取远程接口数据
    async fetch() {
        let { data } = await this.ctx.curl(this.config.news.url);
        data = data.toString();
        let news = [];
        let reg = /<a href="(http[^"]+)".+>([^<]+?)<\/a>/g;
        // let reg = /<a href="(http[^"]+)".+>([\s\S]+?)<\/a>/g;
        data.replace(reg, (matched, url, title) => {
            if (!title.includes('img')) {
                news.push({
                    title,
                    url,
                    // time: moment(new Date()).fromNow(),
                    // time:this.ctx.helper.relative(new Date()),
                    time: new Date()
                });
            }
        });
        return news;
    }
}
module.exports = NewsService;