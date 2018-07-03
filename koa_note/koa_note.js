
// koa是一个类，类上面有两个方法，一个是use,一个是listen

// koa自己封装的require，response属性
// ctx.request
// ctx.response
// 原生的req,res属性
// ctx.req
// ctx.res
let Koa = require('koa');
let app = new Koa();
app.listen(3000);
app.use((ctx, next) => {
    ctx.res.write('hello');
    ctx.res.end('world');
});

// koa自己封装的
// koa将原生的req对象，都代理到ctx上了
// cex只是用来代理的
let Koa = require('koa');
let app = new Koa();
app.listen(3000);
app.use((ctx, next) => {
    console.log(ctx.url, ctx.request.url); // url地址   /index.html?a=1
    console.log(ctx.method, ctx.request.method); // 方法 GET/POST
    console.log(ctx.query, ctx.request.query); // 查询问号后面的值 { a: '1' } 
    console.log(ctx.path, ctx.request.path); // 路径/地址 /index.html
    console.log(ctx.querystring);           // 查询问号后面的值 a=1
    ctx.body = 'hello';         // 致以最后一次为准
});


// 自己封装koa见koa文件夹



// koa是洋葱模型，一层套一层
// 只要调用next或者异步函数的封装就加上await 就加await,防止下一个中间件中有异步
// 如果不需要继续可以return next() 这样在use中return next()下面的代码就不会执行了
let Koa = require('koa');
let app = new Koa();

app.listen(8080);
function log() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('ok');
            resolve();
        }, 3000);
    });
}
app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(6);
});
app.use(async (ctx, next) => {
    console.log(2);
    await log();
    next();
    console.log(5);
});
app.use(async (ctx, next) => {
    console.log(3);
    next();
    console.log(4);
});




// next原理 合并三个函数的方法
let fn1 = (ctx, next) => {
    console.log(1);
    next();
    console.log(6);
}
let fn2 = (ctx, next) => {
    console.log(2);
    next();
    console.log(5);
}
let fn3 = (ctx, next) => {
    console.log(3);
    next();
    console.log(4);
}
let fns = [fn1, fn2, fn3];
function dispatch(index) {
    let middle = fns[index];
    if (fns.length === index) return function () { };
    middle({}, () => dispatch(index + 1))
}
dispatch(0);

// 





// koa提交表单
// ctx.body 消息
// ctx.status 状态吗
// ctx.length 请求体长度
// ctx.set()  设置请求头


let Koa = require('koa');
let app = new Koa();
app.listen(3000);

app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'GET') {
        ctx.body = (`
            <form method="post">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <input type="submit"/>
            </form>
        `)
    } else {
        await next()
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'POST') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = await bodyParser(ctx.req)
    }
});
function bodyParser(req) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        req.on('data', function (data) {
            buffers.push(data);
        });
        req.on('end', function () {
            resolve(Buffer.concat(buffers));
        });
    });
}



// 使用koa-bodyparser
let Koa = require('koa');
let bodyparser = require('koa-bodyparser');
let app = new Koa();
app.listen(3000);

app.use(bodyparser()); // 会在request上增加一个body属性 ctx.request.body
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'GET') {
        ctx.body = (`
            <form method="post">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <input type="submit"/>
            </form>
        `)
    } else {
        await next()
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'POST') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = ctx.request.body;
    }
});


// 实现一个bodyparser
let Koa = require('koa');
let app = new Koa();
app.listen(3000);
function bodyParser(req) {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let buffers = [];
            ctx.req.on('data', function (data) {
                buffers.push(data);
            });
            ctx.req.on('end', function () {
                ctx.request.body = Buffer.concat(buffers);
                resolve()
            });
        });
        await next();
    }
}
app.use(bodyParser());
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'GET') {
        ctx.body = (`
            <form method="post">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <input type="submit"/>
            </form>
        `)
    } else {
        await next()
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'POST') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = ctx.request.body;
    }
});


// 上传文件
// v3 koa-better-body会移除
let Koa = require('koa');
let betterBody = require('koa-better-body');
let path = require('path');
let app = new Koa();
app.listen(3000);

app.use(betterBody({
    uploadDir: path.join(__dirname, 'pro')
}));
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'GET') {
        ctx.body = (`
            <form method="post" enctype="multipart/form-data">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <input type="file" name="avatar">
                <input type="submit"/>
            </form>
        `)
    } else {
        await next()
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'POST') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = ctx.request.fields;
    }
});

// 实现上传文件

let fs = require('fs');
let Koa = require('koa');
let path = require('path');
let querystring = require('querystring');
let app = new Koa();
app.listen(3000);
Buffer.prototype.split = function (sep) {
    let pos = 0;
    let len = Buffer.from(sep).length;
    let index = -1;
    let arr = [];
    while (-1 != (index = this.indexOf(sep, pos))) {
        arr.push(this.slice(pos, index));
        pos = index + len;
    }
    arr.push(this.slice(pos));
    return arr;
}
// console.log(Buffer.from('123**123**123').split('**'));
function betterBody(options = {}) {
    let { uploadDir } = options;
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let buffers = [];
            ctx.req.on('data', function (data) {
                buffers.push(data);
            });
            ctx.req.on('end', function () {
                let type = ctx.get('content-type');
                let buff = Buffer.concat(buffers);
                let fields = {};
                // console.log(type);
                // multipart/form-data; boundary=----WebKitFormBoundaryPmFY0FHz0HKmUInc
                // 取等号后面的
                if (type.includes('multipart/form-data')) {
                    // 多form-data格式
                    let sep = '--' + type.split('=')[1];
                    // console.log(sep);
                    // 自己封装的split()
                    let lines = buff.split(sep).slice(1, -1);
                    //console.log(lines.toString());
                    lines.forEach(line => {
                        let [head, content] = line.split('\r\n\r\n');
                        head = head.slice(2).toString();
                        //console.log(head);
                        //console.log(content.toString());
                        content = content.slice(0, -2);      // 截取的/r/n
                        let [, name] = head.match(/name="(.*)"/);
                        if (head.includes('filename')) {
                            // 处理文件
                            // Content-Disposition: form-data; name="avatar"; filename="xxx"
                            // 除去head的部分剩下的全是内容
                            let c = line.slice(head.length + 6);
                            let p = path.join(uploadDir, Math.random().toString());
                            fs.writeFileSync(p, c);
                            fields[name] = [{ path: p }]
                        } else if (type == 'application/x-www-form-urlencoded') {
                            fields = content.toString(buff.toString());
                            // json格式
                        } else if (type == 'application/json') {
                            fields = JSON.parse(buff.toString());
                        } else {
                            // 普通字符串
                            fields = buff.toString();
                        }
                    });
                } else {
                    // a=b&&c=d 普通的请求
                    fields = querystring.parse(buff.toString());
                }
                ctx.request.fields = fields
                resolve();
            });
        });
        await next();
    }
}
app.use(betterBody({
    uploadDir: path.join(__dirname, 'pro')
}));
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'GET') {
        ctx.body = (`
            <form method="post">
                <input type="text" name="username"/>
                <input type="text" name="password"/>
                <input type="file" name="avatar">
                <input type="submit"/>
            </form>
        `)
    } else {
        await next()
    }
});
app.use(async (ctx, next) => {
    if (ctx.path === '/user' && ctx.method === 'POST') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = ctx.request.fields;
    }
});