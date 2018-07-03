let http = require('http');
let queryString = require('querystring');   // 专门解析form表单格式的模块
let server = http.createServer(function (req, res) {
    let contentType = req.headers['content-type'];
    let buffers = [];
    req.on('data', function (chunk) {       // 拿到客户端的数据
        buffers.push(chunk);
    });
    req.on('end', function () {
        let content = Buffer.concat(buffers).toString()
        if(contentType === 'application/json'){
            console.log(JSON.parse(content))
        }else if(contentType === 'application/x-www-form-urlencoded'){
            console.log(queryString.parse(content))
        }
        res.end('hello');
    });
});
server.listen(4000);