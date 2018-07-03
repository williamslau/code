module.exports = (options, app) => {
    return async function (ctx, next) {
        let userAgent = ctx.get('user-agent');      //得到的就是请求头中的user-Agent
        // let ua = [/Chrome/, /Firefox/];
        let matched = options.uas.some(item => item.test(userAgent));
        if (matched) {
            ctx.status = 403;
            ctx.body = '无权访问'
        } else {
            await next();
        }
    }
}