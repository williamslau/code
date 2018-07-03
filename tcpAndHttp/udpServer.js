let dgram = require('dgram');
let socket = dgram.createSocket('udp4');
// 监听一个端口，数据到来时可以读出内容
socket.bind(8080, 'localhost', function () {
    socket.on('message', function (data,rinfo) {
        console.log(data);
        socket.send('hello',rinfo.port);
    });
});