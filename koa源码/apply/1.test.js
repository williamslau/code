
// koa 核心非常小 ，中间件，http服务的封装

let Koa = require('koa');
let app = new Koa(); // app可以实现一些常用的方法listen,use
app.use((ctx, next) => {
    ctx.body = 'hello';
    console.log(ctx.req.url);
    console.log(ctx.request.url);
    console.log(ctx.request.req.url);
    console.log(ctx.url);
});

app.listen(3000);
