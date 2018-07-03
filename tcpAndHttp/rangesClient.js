let options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'get',
}

let fs = require('fs');
let path = require('path');
let http = require('http');
let ws = fs.createWriteStream('./dowinload.txt');
let pause = false;
let start = 0;
// 监控命令行的输入事件
process.stdin.on('data', function (chunk) {
    chunk = chunk.toString();
    if (chunk.includes('p')) {
        pause = true;
    } else {
        pause = false;
        download();
    }
});

// 下载 规定每次获取10个
function download() {
    options.headers = {
        Range: `bytes=${start}-${start + 10}`
    }
    start += 10;
    http.get(options, function (res) {
        // Content-Range:0-10/总大小 截取/后面的就是总大小
        let range = res.headers['content-range'];
        let total = range.split('/')[1];
        let buffers = [];
        res.on('data', function (chunk) {
            buffers.push(chunk);
        })
        res.on('end', function () {
            // 将获取的数据写入文件中
            ws.write(Buffer.concat(buffers));
            setTimeout(function () {
                if (pause === false && start < total) {
                    download();
                }
            }, 1000);
        });
    });
}
download();
