const UserService = require('../service/user');
const jsonwebtoken = require('jsonwebtoken');
const defaultAvatar = "../static/images/face.jpg";
const config = require('../../config/config.default');

const userService = new UserService();
class UserController {
  async register(ctx) {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.response.body = {
        code: 500,
        msg: '账户密码不能为空',
        data: null
      }
      return;
    }
    // 这里得到的是一个数组，因为控制着用户名不重复，数组中只有一个元素
    const userInfo = (await userService.getUserByName(username))[0];
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null
      }
      return;
    }
    const result = await userService.insertUser({
      username,
      password,
      avatar: defaultAvatar,
      signature: '好好学习天天向上'
    })
    if (result) {
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: null
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null
      }
    }
  }

  async login(ctx) {
    const { username, password } = ctx.request.body;
    const userInfo = (await userService.getUserByName(username))[0];
    console.log(userInfo);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null
      }
      return;
    }
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null
      }
      return;
    }
    // 登录成功
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token: jsonwebtoken.sign({
          id: userInfo.id,
          username: userInfo.username
        }, config.jwt.secret, { expiresIn: '24h' })
      }
    };
  }

  async getUserInfo(ctx) {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decode = await jsonwebtoken.verify(token, config.jwt.secret);
    const userInfo = (await userService.getUserByName(decode.username))[0];
    console.log(userInfo);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar
      }
    }
  }

  async editUserInfo(ctx) {
    const { signature, avatar } = ctx.request.body;
    console.log(signature, avatar);
    try {
      const token = ctx.request.header.authorization.split(' ')[1];
      const decode = jsonwebtoken.verify(token, config.jwt.secret);
      const userInfo = (await userService.getUserByName(decode.username))[0];
      const result = await userService.editUserInfo({
        ...userInfo,
        signature,
        avatar
      })
      console.log(result);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: userInfo.id,
          signature: signature,
          username: userInfo.username,
          avatar: avatar
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = UserController;