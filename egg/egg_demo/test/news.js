let str = `
<a href="http://society.people.com.cn/n1/2018/0515/c1008-29990019.html" target="_blank" class="a3" mon="ct=1&a=1&c=top&pn=2">十年援建情 家园气象新</a><i style="font-size: 12px">&nbsp;</i><a href="http://news.cctv.com/2018/05/14/ARTIGCP6YYw9hyv7ZbPcxUiK180514.shtml" target="_blank" class="a3" mon="ct=1&a=1&c=top&pn=2">震后延续的爱</a>
`;

let reg = /<a href="(http[^"]+)".+>([^<]+?)<\/a>/;
let result=str.match(reg);
console.log(result);