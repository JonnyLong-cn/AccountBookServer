const TypeService = require('../service/type');
const config = require('../../config/config.default');
const jsonwebtoken = require('jsonwebtoken');
const typeService = new TypeService();

class TypeController{
  async list(ctx){
    const token = ctx.request.header.authorization.split(' ')[1];
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) return
      let user_id = decode.id;
      const list = await typeService.list(user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          list
        }
      }
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
}
module.exports = TypeController;