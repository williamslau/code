
// 强制缓存
// 设置两个头
// 第一次访问你走服务器，之后在一段时间内走缓存

// Expires 过期时间 http1.0 设置过期时间 （现在都http1.1了，一般不用设，为了兼容）设置的绝地时间
// Cache-Control 过期时间 设置的多少秒
let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');  // 获取文件类型的 Content-Type
let server = http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url);
    console.log(pathname);
    let p = path.join(__dirname, 'public', pathname);
    // 根目录为 / 是读不到文件的，小bug
    fs.stat(p, function (err, stat) {
        if (!err) {
            sendFile(req, res, p);
        } else {
            sendError(res);
        }
    });
});
function sendFile(req, res, p) {
    let date = new Date(Date.now() + 10 * 1000);
    res.setHeader('Expires', date.toUTCString());
    res.setHeader('Cache-Control', 'max-age=10');
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8')
    fs.createReadStream(p).pipe(res);
}
function sendError(res) {
    res.statusCode = 404;
    res.end();
}
server.listen(8080);