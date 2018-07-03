// 对比缓存
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
        // 每次访问给个标识，下次访问匹配两个标识做对比，有区别就不走缓存
        // 可以根据修改时间判断
        // if-modified-since  Last-Modified
        if (!err) {
            let since = req.headers['if-modified-since'];
            if(since){
                if(since === stat.ctime.toUTCString()){
                    res.statusCode = 304;
                    res.end();
                }else{
                    sendFile(req,res,p,stat);
                }
            }else{
                sendFile(req,res,p,stat);
            }
        } else {
            sendError(res);
        }
    });
});
function sendError(res) {
    res.statusCode = 404;
    res.end();
};
function sendFile(req, res, p, stat) {
    res.setHeader('Cache-Control', 'no-cache');                         // 强制不缓存
    res.setHeader('Last-Modified', stat.ctime.toUTCString());
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8')
    fs.createReadStream(p).pipe(res);
};
server.listen(8080);