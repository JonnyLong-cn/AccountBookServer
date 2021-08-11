const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const logger = require('koa-logger');
const moment = require('moment');
const static = require('koa-static');
const onerror = require('koa-onerror');
const json = require('koa-json');
const koajwt = require('koa-jwt');
// 比koa-bodyparser更强大，有文件上传功能，注意两者不兼容
const koaBody = require('koa-body');  
const cors = require('koa2-cors'); //跨域处理
// 配置文件
const config = require('../config/config.default');

const indexRouter = require('./route/router');

const app = new Koa();
// error handler
onerror(app);
// logger
app.use(logger());
app.use(async (ctx, next) => {
  const start = new Date();
  console.log(start);
  await next();
  const ms = new Date() - start;
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms 当前时间:${currentTime}`);
})
// cors，跨域
app.use(
  cors({
      origin: "http://127.0.0.1:5500",
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  })
);
// jwt
// token错误处理
app.use(koajwt({
  secret: config.jwt.secret
}).unless({
  // 登录接口不需要验证
  path: [/\/api\/user\/register/,/\/api\/user\/login/,/\/api\/upload/]
}));
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: err.message
      }
    } else {
      throw err;
    }
  })
});
// static
app.use(static(path.join(__dirname, '/src/static/upload')));
// json
app.use(json());
// koaBody
app.use(koaBody({
  multipart:true,
  formidable:{
    maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认20M
  }
}))

// 装载子路由
const router = new Router();
router.use("/api", indexRouter.routes(), indexRouter.allowedMethods());
//加载路由中间件
app
  .use(router.routes())
  .use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

let server = app.listen(7001, () => {
  console.log('[demo] server is starting at port 7001');
})
// 设置请求最长时间为5s
server.timeout=5000;