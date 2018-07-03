// 缓存的作用
// 减少了多余的数据传输，节省了网费
// 减少了服务器的负担，大大提高了网站的性能
// 加快客户端加载网页的速度

// 缓存分为两种，强制缓存，对比缓存

// 强制缓存  客户端有自己的缓存文件夹
// 如果缓存没有失效，就从缓存文件夹取
// 如果没有这个数据，会从服务端请求

// 对比缓存 服务端对比客户端缓存是否是同一个（修改时间判断，最靠谱的还是判断加密字符串）
// 如果有，返回304，走缓存
// 如果没有，返回200，返回数据

// 搭建一个简单的静态服务
let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');  // 获取文件类型的 Content-Type
let server = http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url);
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
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8');
    fs.createReadStream(p).pipe(res);
}
function sendError(res) {
    res.statusCode = 404;
    res.end();
}
server.listen(8080);

// 强制缓存见1.server.js
// 对比缓存见2.server.js
