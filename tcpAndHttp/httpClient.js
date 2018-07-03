let http = require('http');
let options = {
    hostname: 'localhost',
    port: 4000,
    path: '/',   // 所有的路径都以/开头，首页就是/
    method: 'get',
    // 告诉服务端我当前要给你发什么样的数据
    // headers: {     // 普通json数据
    //     'Content-Type': 'application/json',
    //     'Content-Length': 15,     // 传输数据的长度（buffer的长度）
    // },
    headers:{         // 表单数据格式
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':15,
    },
}

let req = http.request(options);
req.on('response',function(res){    // 拿到客户端的数据
    res.on('data',function(chunk){
        console.log(chunk.toString());
    });
});
// req.end('{"name":"zfpx"}');     // 普通json数据
req.end('name=zfpx&age=9');       // 表单数据格式