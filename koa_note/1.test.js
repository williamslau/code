let Koa = require('./koa/application');
let fs = require('fs');
let app = new Koa();
app.listen(3000);
// app.use((req, res) => {
//     res.end('hello');
// });
// app.use((ctx) => {
//     ctx.response.body = '1';
//     ctx.body = '1';
//     console.log(ctx.request.query);
//     console.log(ctx.query);         // 用contex.js做代理 代理request和reponse
//     console.log(ctx.response.body);
//     console.log(ctx.body);
// });
app.use(async (ctx, next) => {
    // 读取流
    ctx.body = fs.createReadStream('./package.json');
    throw Error('123123123');   // 抛出一个错误
    console.log(1);
    await next();
    console.log(2);
});
app.use(async (ctx, next) => {
    console.log(3);
    await next();
    console.log(4);
});
app.on('error',function(err){   // 可以监控错误
    console.log('e',err)
})