let config = require('./config');
let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');
let zlib = require('zlib');
let chalk = require('chalk');

let util = require('util');
let stat = util.promisify(fs.stat);
let readdir = util.promisify(fs.readdir);

let debug = require('debug')('static:app');

// 模板内容
let ejs = require('ejs');
let tmpl = fs.readFileSync(path.join(__dirname, 'tmpl.ejs'), 'utf8');

class Server {
    constructor(args) {     // 接收在www.js中new Server中传的参数
        this.config = {...config,...args};      // 使用合并覆盖config文件中的参数
        this.tmpl = tmpl;
    }
    handleRequest() {
        return async (req, res) => {
            let { pathname } = url.parse(req.url, true);
            if(pathname === '/favicon.ico') return res.end();   // 处理小图标
            let p = path.join(this.config.dir, '.' + pathname);
            debug(p);
            try {
                let statObj = await stat(p);
                if (statObj.isDirectory()) {    // 判断是不是目录（文件夹）
                    // ejs模板引擎渲染
                    let dirs = await readdir(p);
                    dirs = dirs.map(dir => ({
                        path: path.join(pathname, dir),
                        name: dir
                    }));
                    debug(dirs);
                    let content = ejs.render(this.tmpl, { dirs });
                    res.setHeader('Content-Type', 'text/html;charset=utf8');
                    res.end(content);
                } else {
                    this.sendFile(req, res, p, statObj)
                }
            } catch (e) {
                this.sendError(req, res, e);
            }
        }
    }
    catch(req, res, statObj) {
        // 以文件内容的md5判断 
        let ifNoneMatch = req.headers['if-none-match'];
        // 以文件的最新修改时间判断
        let ifModifiedSince = req.headers['if-modified-since'];
        // 服务器上的文件的最新修改时间
        let since = statObj.ctime.toUTCString();
        // 服务器文件的一个描述 ctime-size（文件最后修改时间时间戳-文件大小）
        let etag = new Date(since).getTime() + '-' + statObj.size;
        res.setHeader('Etag', etag);
        res.setHeader('Last-Modified', since);
        res.setHeader('Cache-Control', 'max-age=10');   // 强制缓存
        if (ifNoneMatch !== etag) {
            return false;
        }
        if (ifModifiedSince != since) {
            return false;
        }
        res.statusCode = 304;
        res.end();
        return true;
    }
    compress(req, res, p, statObj) {
        let header = req.headers['accept-encoding'];
        if (header) {
            if (header.match(/\bgzip\b/)) {
                res.setHeader('Content-Encoding', 'gzip');
                return zlib.createGzip();
            } else if (header.match(/\bdeflate\b/)) {
                res.setHeader('Content-Encoding', 'deflate');
                return zlib.createDeflate();
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
    range(req, res, p, statObj) {
        let range = req.headers['range'];
        let start = 0;
        let end = statObj.size;
        if (range) {
            let [, s, e] = range.match(/bytes=(\d*)-(\d*)/);
            start = s ? parseInt(s) : start;
            end = e ? parseInt(e) : end; res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Range', `bytes ${start}-${end}/${statObj.size}`)
        }
        // 客户端设置 Rang:bytes=1-100
        // 服务端返回 Accept-Renges:bytes
        //           Content-range: bytes 1-100/700
        // 第一种写法
        // return {start,end:end-1}
        return fs.createReadStream(p,{start,end:end-1});
    }
    sendFile(req, res, p, statObj) {
        // 缓存 对比缓存 强制缓存
        if (this.catch(req, res, statObj)) return;
        // 压缩
        // 客户端设置 Content-Encoding:gzip
        // 服务端返回 Accept-Encoding: gzip,deflate,br
        res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');
        let s = this.compress(req, res, p, statObj);
        // 范围请求（断点续传）
        // 客户端设置 Rang:bytes=1-100
        // 服务端返回 Accept-Renges:bytes
        // Content-range: bytes 1-100/700
        // let {start,end} = this.range(req,res,p,statObj);
        // let rs = fs.createReadStream(p,start,end);
        let rs = this.range(req, res, p, statObj);
        if (s) {
            rs.pipe(s).pipe(res);
        } else {
            rs.pipe(res);
        }
    }
    sendError(req, res, e) {
        debug(util.inspect(e).toString());      // util 模块解析错误数据
        res.statusCode = 404;
        res.end();
    }
    start() {
        let { port, hostname } = this.config;
        let server = http.createServer(this.handleRequest());
        let url = `http://${hostname}:${chalk.green(port)}`;
        debug(url);
        server.listen(port, hostname);
    }
}
// let server = new Server();
// server.start();
module.exports = Server;