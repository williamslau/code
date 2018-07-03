let dgram = require('dgram');
let socket = dgram.createSocket('udp4');
// 监听一个端口，数据到来时可以读出内容
socket.send('william',8080,function(){
    console.log('成功');
});
socket.on('message', function (data,rinfo) {
    console.log(data.toString());
});