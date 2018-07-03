
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
class Koa {
    constructor() {
        this.callbackFn;
        this.context = context;
        this.request = request;
        this.response = response;
    }
    use(cb) {
        this.callbackFn = cb;
    }
    createContext(req, res) {
        // Object.create()
        let ctx = Object.create(this.context); // 希望ctx可以拿到context的属性，但是不修改context
        ctx.request = Object.create(this.request);
        ctx.req = ctx.request.req = req;
        ctx.response = Object.create(this.response);
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    handleRequest(req, res) {
        let ctx = this.createContext(req, res);
        this.callbackFn(ctx);
        let body = ctx.body;
        if (typeof body != 'undefined') {
            res.end(`Not Found`);
        }else if(typeof body === 'String'){
            res.end('body');
        }
    }
    listen() {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...arguments);
    }
}

module.exports = Koa;