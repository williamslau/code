let moment=require('moment');
moment.locale('zh-cn');
exports.relative=function(time){
    return moment(time).fromNow();
}