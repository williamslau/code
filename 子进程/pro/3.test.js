let fs = require('fs');
let ws = fs.createWriteStream('./aaaaa.txt');
process.stdout.on('data', function (data) {
    ws.write(data);
});
setTimeout(function(){
    process.exit();
},1000);