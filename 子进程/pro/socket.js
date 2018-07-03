process.on('message',function(msg,socket){
    if(msg === 'socket'){
        socket.write('子进程接收数据请求');
    }
});