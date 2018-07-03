
// 静态服务器中间件
// static

// let Koa = require('koa');
// let static = require('koa-static');
// let path = require('path');
// let app = new Koa();
// app.listen(3000);
// app.use(static(path.join(__dirname, 'public')));
// app.use(async (ctx, next) => {
//     ctx.body = 'not-found';
// });

// 实现原理
let fs = require('fs');
let Koa = require('koa');
let path = require('path');
let util = require('util');
let stat = util.promisify(fs.stat);
let app = new Koa();
function static(p) {
    return async (ctx, next) => {
        try {
            let p2 = path.join(p,'.'+ctx.path);
            let stateObj = await stat(p2);
            // e:\demo\koa_note\public\index.js
            console.log(p2);
            if (stateObj.isDirectory()) {

            } else {
                ctx.set('Content-Type', 'text/html;charset=utf8');
                ctx.body = fs.createReadStream(p2);
            }
        } catch (e) {
            await next();
        }
    }
}
app.use(static(path.join(__dirname, 'public')));
app.use(async (ctx, next) => {
    ctx.body = 'not-found';
});
app.listen(8000);