// 压缩头部

// 服务端设置 Content_Encoding
// 客户端会有 Accept-Encoding
// 写个demo创建一个大点的文件
let fs = require('fs');
let path = require('path');
for (let i = 0; i < 10000; i++) {
    fs.appendFileSync(path.join(__dirname, 'pro', '1.txt'), 'williamlau');
}

// 压缩
let fs = require('fs');
let zlib = require('zlib');
let path = require('path');
function zip(src) {
    // 创建一个转化流 转化流是可读可写的
    let gzip = zlib.createGzip();
    fs.createReadStream(src).pipe(gzip).pipe(fs.createWriteStream(src + '.gz'));
}
zip(path.join(__dirname, 'pro', './1.txt'));

//解压
let fs = require('fs');
let zlib = require('zlib');
let path = require('path');
function unzip(src) {
    let gunzip = zlib.createGunzip();
    fs.createReadStream(src)
        .pipe(gunzip)
        .pipe(fs.createWriteStream(path.join(__dirname, 'pro', path.basename(src, '.gz') + '.txt')));
}
unzip(path.join(__dirname, 'pro', './1.txt.gz'));

// 客户端使用
let http = require('http');
let path = require('path');
let fs = require('fs');
let zlib = require('zlib');
let server = http.createServer(function (req, res) {
    let p = path.join(__dirname, 'pro', './1.txt');
    let header = req.headers['accept-encoding'];
    res.setHeader('Context-Type', 'text/html;charset-utf8');
    if (header) {
        if (header.match(/\bgzip\b/)) {
            let gzip = zlib.createGzip();
            res.setHeader('Content-Encoding', 'gzip');
            fs.createReadStream(p).pipe(gzip).pipe(res);
        } else if (header.match(/\bdeflate\b/)) {
            let deflate = zlib.createDeflate();
            res.setHeader('Content-Encoding', 'deflate');
            fs.createReadStream(p).pipe(deflate).pipe(res);
        } else {
            fs.createReadStream(p).pipe(res);
        }
    } else {
        fs.createReadStream(p).pipe(res);
    }
}).listen(8080);





