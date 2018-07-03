let net = require('net');
let server = net.createServer(function (socket) {  // socket是双工流，可读可写
    socket.setEncoding('utf8');
    socket.on('data', function (data) {
        console.log(data);
        socket.write('你好');
    });
});
server.on('connection', function () {  // 建立链接的事件
    console.log('客户端建立链接');
});
server.listen(8888);