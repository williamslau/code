let fs = require('fs');
let url = require('url');
let http = require('http');
let path = require('path');
let mime = require('mime');
let crypto = require('crypto');
let server = http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url);
    let p = path.join(__dirname, 'public', pathname);
    // 根目录为 / 是读不到文件的，小bug
    fs.stat(p, function (err, stat) {
        let md5 = crypto.createHash('md5');
        let rs = fs.createReadStream(p);
        rs.on('data', function (data) {
            md5.update(data);
        });
        rs.on('end', function () {
            let r = md5.digest('hex');
            // 下次再拿最新文件的加密值 和客户端请求来比较
            let ifNoneMatch = req.headers['if-none-match'];
            if(ifNoneMatch){
                if(ifNoneMatch === r){
                    res.statusCode = 304;
                    res.end();
                }else{
                    sendFile(req,res,p,r);
                }
            }else{
                sendFile(req,res,p,r);
            }
        });
    })
});
function sendError(res) {
    res.statusCode = 404;
    res.end();
}
function sendFile(req, res, p, r) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Etag', r);
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8')
    fs.createReadStream(p).pipe(res);
}
server.listen(8080);