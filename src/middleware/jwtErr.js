const jsonwebtoken = require('jsonwebtoken');

// token验证功能
module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    let token = ctx.request.header.authorization;
    let decode;
    if (token !== null && token) {
      try {
        token = token.split(' ')[1];
        decode = jsonwebtoken.verify(token, secret);
        await next();
      } catch (error) {
        console.log('error', error)
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期，请重新登录',
          code: 401,
          data:{
            res:decode
          }
        }
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  }
}