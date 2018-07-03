let net = require('net');

let socket = net.createConnection({ port: 8888 }, function () {
    socket.write('hello');
    socket.on('data',function(data){
        console.log(data.toString());
    });
});