let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
let Stream = require('stream');
let EventEmitter = require('events');
class Koa extends EventEmitter {
    constructor() {
        super()         // 因为继承了EventEmitter 所以要super
        // this.callbackFn;
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }
    createContext(req, res) {
        // 为了不修改原型上request.js里的内容
        // ctx.a=1;
        // 这样request.js里的内容也就改了
        // cex.__proto__=this.context;
        // 创建上下文
        let ctx = Object.create(this.context);
        // 创建request
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    // app.use() 中间件实现
    compose(ctx, middlewares) {
        function dispatch(index) {
            let middleware = middlewares[index];
            if (middlewares.length === index) return Promise.resolve();
            return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
        }
        return dispatch(0);
    }
    handleRequest() {
        return (req, res) => {
            // this.callbackFn(req, res);
            // 创建上下文对象
            res.statusCode = 404;
            let ctx = this.createContext(req, res);
            // 组合后的中间件 app.use();
            let composeMiddleWare = this.compose(ctx, this.middlewares);
            // Promise.resolve(this.callbackFn(ctx)).then(function () {
            //     // ctx.body后，执行end不让他转圈
            //     res.end(ctx.body);
            // });
            // Promise.resolve(composeMiddleWare).then(function () {
            // compose本身就是promise不需要在包一层
            composeMiddleWare.then(() => {
                // ctx.body后，执行end不让他转圈
                let body = ctx.body;
                if (body == undefined) {        // 没有传参
                    return res.end('Not Found');
                }
                if (body instanceof Stream) {   // 数据是个流
                    return body.pipe(res);
                }
                if (typeof body === 'object') { // 值不是字符串
                    return res.end(JSON.stringify(body));
                }
                res.end(body);
            }).catch(e => {
                this.emit('error', e);
                res.end('Internal Server Error');
            });;
        }
    }
    listen() {
        let server = http.createServer(this.handleRequest());
        server.listen(...arguments);
    }
    use(fn) {
        // this.callbackFn = fn;
        this.middlewares.push(fn);
    }
}

module.exports = Koa;