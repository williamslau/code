

// URI&URL
// URI是统一资源标识符 就像一个身份证号，可以准确的表示一个资源，但是不能准且的定位到这个资源
// URL是统一资源定位符 基于URI的，是URI的一部分，它可以准且的定位到一个资源

// URL的格式
// 协议类型(http/https)
// 在//后面一般用户名和密码@隔开
// 服务器地址(网址)
// 端口号(默认:80)
// 文件路径
// 在?后面是查询字符串(携带的数据)
// 片段标识符 hash 锚点(用来定位页面位置) 在服务端是拿不到的


//URL模块
let url = require('url');
let u = 'http://jiangwen:xxxx@www.baidu.com:80/abc/index.html?a=1&b=2#hash';
let urlObj = url.parse(u, true);     // 加上true可以将查询字符串转化成对象
console.log(urlObj.query);  // 查询字符串
console.log(urlObj.pathname); // 路径


// http
// http是应用层，是基于tcp的
// http特点
// 1.长连接
// 意思就是经过三次握手以后就持续的，不停的发请求和响应

// 2.管线化
// 意思就是在同一时间可以并发多个请求，如chrome浏览器就是默认并发六个,firefox是四个

// 状态码识别
// 2xx 成功状态码
// 200 成功
// 204 正常响应，没有实体
// 206 范围请求 返回部分数据（断点续传）
// 3xx 重定向（缓存）
// 301 永久重定向
// 302 临时重定向 （负载均衡，访问到其他网页上）
// 303 和302类似，但是必须用GET方法
// 304 状态未改变
// 4xx
// 400 语法错误
// 401 需要认证，有权限问题
// 403 服务器拒绝访问相对资源
// 404 无法找到资源
// 5xx
// 500 服务器故障
// 503 服务器超负荷（负载均衡超载） 或者 正在停机维护

// http模块
// 请求头示例
// POST / HTTP/1.1
// > Host: www.baidu.com
// > User-Agent: curl/7.46.0
// > Accept: */*
// > Content-Length: 11
// > Content-Type: application/x-www-form-urlencoded

let http = require('http');
// let server = http.createServer(function(req,res){

// });
// 或者
// 创建服务
let server = http.createServer();
// req是可读流
// res是可写流
// http(req)
// 监听请求的到来
server.on('request', function (req, res) {
    let contentType = req.headers['content-type'];
    let method = req.method;
    let httpVersion = req.httpVersion
    let headers = req.headers;
    // console.log(method);
    // console.log(httpVersion);
    // console.log(headers);
    let buffers = [];
    // 如果没有请求体 不会走on('data'),也会触发end事件
    req.on('data', function (data) {
        buffers.push(data);
    });
    req.on('end', function () {
        console.log(Buffer.concat(buffers).toString());
        res.write('hello');
        res.end('world');
    });
});
// 建立链接
server.on('connection', function (socket) {

});
// 关闭
server.on('close', function () {

});
// 监听错误
server.on('error', function (err) { })
server.listen(8080);



// 简单实现http(req)
let net = require('net');
let { StringDecoder } = require('string_decoder');    // 专门解决buffer乱码的模块
let { Readable } = require('stream');
class IncomingMessage extends Readable {     //自定义可读流
    _read() { }
}
function parser(socket, callback) {
    let buffers = []; // 每次读取的数据，放到数组中
    let sd = new StringDecoder();
    let im = new IncomingMessage();
    function fn() {
        let res = { write: socket.write.bind(socket), end: socket.end.bind(socket) }
        let content = socket.read();  // 默认将缓存区内容读完，读完后如果还有内容会触发readable事件
        buffers.push(content);
        let str = sd.write(Buffer.concat(buffers));
        if (str.match(/\r\n\r\n/)) {
            let result = str.split('\r\n\r\n');
            let head = parserHeader(result[0]);
            Object.assign(im, head);
            socket.removeListener('readable', fn);   // 移除监听
            socket.unshift(Buffer.from(result[1]));     // 将内容塞回流中
            if (result[1]) { // 有请求体
                socket.on('data', function (data) {
                    im.push(data);
                    im.push(null);
                    callback(im, res);
                });
            } else { // 没请求体
                im.push(null);
                callback(im, res);
            }
            //let body = result[1];
        }
    }
    socket.on('readable', fn);
}
function parserHeader(head) {
    let lines = head.split(/\r\n/);
    let start = lines.shift();
    let method = start.split(' ')[0];
    let url = start.split(' ')[1];
    let httpVersion = start.split(' ')[2].split('/')[1];
    let headers = {};
    lines.forEach(line => {
        let row = line.split(': ');
        headers[row[0]] = row[1];
    });
    return { url, method, httpVersion, headers }
}
let server = net.createServer(function (socket) {
    parser(socket, function (req, res) {
        server.emit('request', req, res);
    });
});
server.on('request', function (req, res) {
    console.log(req.url);
    console.log(req.headers);
    console.log(req.httpVersion);
    console.log(req.method);

    req.on('data', function (data) {
        console.log('ok', data.toString());
    });
    req.on('end', function () {
        res.end(`qxlltc
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 5

hello`)
    });
})
server.on('connection', function () {
    console.log('建立连接');
});
server.listen(3000);

// http(res)
let http = require('http');
let server = http.createServer(function (req, res) {
    // res.write()
    // res.end()
    // write方法不能再end之后调用
    // 响应可以设置响应头


    // 不会真正的把响应头写给客户端 你只要调用write或者end才会吧响应头写进去
    // res.writeHead(200,{'Content-Type':'text/plain'}); 会真正的写进去 之后就不能再setHeader 这两个方法冲突
    // res.statusCode = 200;     // 默认情况下返回给客户端内容 200
    // res.setHeader('Content-Type','text/plain');   // 调用write之前才能调用setHeader方法
    // res.setHeader('name','aaaa');             // 自定义的头部

    // console.log(res.getHeader('name'));      //获取相应头
    // console.log(res.removeHeader('name'));   // 删除响应头
    res.sendDate = false;      //是否发送日期
    // Content-Length:2     // 发送的数据长度
    res.end('ok');      // 最后调用end结束
});

// 多语言 vue-i18n国际化的包
// 可以支持语言的切换

// 这个可以客户端设置，也可以服务端设置
// 现在要说的就是服务端如何设置多语言
// Accept-Language: zh;q=0.9,en;fr-FR,q=0.7  逗号前面是语言，后面是权重，最大是1

let pack = {
    'zh-CN': { content: '你好' },
    'en': { content: 'hello' },
    'fr-FR': { content: 'Bonjour' }
};
let http = require('http');
let server = http.createServer();
server.on('request', function (req, res) {
    let lan = 'en';     // 设置默认语言
    let language = req.headers['accept-language'];
    let arrs = [];
    if (language) {
        arrs = language.split(',').map(l => {
            l = l.split(';');
            return {
                name: l[0],
                q: l[1] ? Number(l[1].split('=')[1]) : 1
            }
        }).sort((lang1, lang2) => lang2.q - lang1.q);
        console.log(arrs);
    }
    res.setHeader('Content-Type', 'text/plain;charset=utf8');
    for (let i = 0; i < arrs.length; i++) {
        let name = arrs[i].name;
        if (pack[name]) {
            res.end(pack[name].content);
            break;
        }
    }
    res.end(pack[lan].content);
}).listen(8888);


// 防盗链
let fs = require('fs');
let path = require('path');
let http = require('http');
let url = require('url');
let getHostName = (str) => {
    let { hostname } = url.path(str, true);
    return hostname;
}
let server = http.createServer(function (req, res) {
    let refer = req.headers['referer'] || req.headers['referrer'];
    // 先看一下啊refer的值 ，还要看图片的请求路径
    // 要读取文件 返回给客户端
    let { pathname } = url.parse(req.url, true);
    let p = path.join(__dirname, 'public', '.' + pathname);
    fs.stat(p, function (err) {
        if (!err) {
            if (refer) {
                let referHostName = getHostName(refer);
                let host = req.headers['host'].split(':')[0];
                if (referHostName != host && !whitList.includes(referHostName)) {
                    // 防盗链
                    fs.createReadStream(path.join(__dirname, 'public', './2.jpg')).pipe(res);
                } else {
                    // 正常显示
                    fs.createReadStream(p).pipe(res);
                }
            } else {
                // 正常显示
                fs.createReadStream(p).pipe(res);
            }
        } else {
            res.end();
        }
    });
});
server.listen(9999);

// 范围请求（分段请求，断点续传）
// 请求头部加 Accept-Ranges:bytes
// 见rangesServer.js和rangesClient.js
// 使用新方法 http.get(options,function(res){});
// 客户端见rangesClient.js
// 服务端见rangesServer.js

// 加密 crypto模块
// 加密算法，加密完可以解迷
// md5并不是加密算法，因为他是不可你的，属于摘要
// md5的特点 1 不可逆 2 不同的内容输出的结果不同 3 相同的内容输出的一定一样 4 最终加密的结果长度一样
let crypto = require('crypto');
let md5 = crypto.createHash('md5');
md5.update('williamlau');
let result = md5.digest('hex'); // hex是16进制 还有base64,latin1, 一般都用hex
console.log(result);

// md5 加密一个很大的文件
let crypto = require('crypto');
let md5 = crypto.createHash('md5');
let path = require('path');
let fs = require('fs');
let rs = fs.createReadStream(path.join(__dirname, './5.txt'), { highWaterMark: 2 });
rs.on('data', function (chunk) {
    md5.update(chunk);
});
rs.on('end', function () {
    let result = md5.digest('hex');
    console.log(result);
});
// 等价于
let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let md5 = crypto.createHash('md5');
let content = fs.readFileSync(path.join(__dirname, './5.txt'));
md5.update(content);
let result = md5.digest('hex');
console.log(result);

// Hmac 加盐算法(摘要) 可以根据一个所谓的密钥进行加密
let crypto = require('crypto');
let m = crypto.createHmac('sha1', 'key');
m.update('williamlau');
console.log(m.digest('hex'));

// 加盐算法可以通过命令行生成一个key
// 生成公钥
// openssl genrsa -out rsa_private.key 1024
let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let m = crypto.createHmac('sha1', fs.readFileSync(path.join(__dirname, 'rsa_private.key')));
m.update('williamlau');
console.log(m.digest('hex'));

// 对称加密 用一把钥匙可以加密，也可以解密
var fs = require('fs');
let path = require('path');
var crypto = require('crypto');
let str = 'williamlau';
let private = fs.readFileSync(path.join(__dirname, 'rsa_private.key'));
let cipher = crypto.createCipher('blowfish', private);
let encry = cipher.update(str, 'utf8', 'hex');
encry += cipher.final('hex');
console.log(encry);

let deciper = crypto.createDecipher('blowfish', private);
let deEncry = deciper.update(encry, 'hex', 'utf8');
deEncry += deciper.final('utf8');
console.log(deEncry);

// 非对称加密 用两把加密解密 ，公钥加密，私钥解密
// 生成私钥
// openssl rsa -in rsa_private.key -pubout -out rsa_public.key
var fs = require('fs');
let path = require('path');
var crypto = require('crypto');
let cert = fs.readFileSync(path.join(__dirname, 'rsa_public.key')); // 公钥
let key = fs.readFileSync(path.join(__dirname, 'rsa_private.key')); // 私钥
let public = crypto.publicEncrypt(cert, Buffer('williamlau'));    //公钥加密
console.log(public.toString());
let private = crypto.privateDecrypt(key, public);   //私钥解密
console.log(private.toString());

// 签名 是传输数据判断服务端和客户端是不是同一个
// 甲 用RSA-SHA256 加密 createSign出一个签名,'字符串' 发给乙方
// 乙方用这个签名，和公钥进行验证 还有内容 看是不是同一个东西
// 为了鉴别甲方和乙方的数据是相同的
let fs = require('fs');
let path = require('path');
let crypto = require('crypto');
let public = fs.readFileSync(path.join(__dirname,'./rsa_public.key'))
let private = fs.readFileSync(path.join(__dirname,'./rsa_private.key'))
let s  = crypto.createSign('RSA-SHA256');
s.update('williamlau');
let signed = s.sign(private,'hex')
let v = crypto.createVerify('RSA-SHA256');
v.update('williamlau');

console.log(v.verify(public, signed, 'hex'));

