let Koa=require('./koa/applycation');


let app =new Koa();



app.use((ctx)=>{
    console.log(ctx.req.url);
    console.log(ctx.request.req.url);
    console.log(ctx.request.url);
    console.log(ctx.url);
    ctx.body='aaa'
});

app.listen(3000);