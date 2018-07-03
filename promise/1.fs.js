
//截取BOM头

let fs = require('fs');
let path = require('path');

function stripBOM(content){
    if(content.charCodeAt(0) === 0xfff){
        content = content.slice(1);
    }
    return content;
}

let reslue=fs.readFileSync(path.join(__dirname,'./1.txt'),'utf8');
console.log(reslue);