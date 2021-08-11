const Router = require('koa-router');
const UserController = require('../controller/user');
const BillController = require('../controller/bill');
const TypeController = require('../controller/type');
const UploadController = require('../controller/upload');
const config = require('../../config/config.default');
const jwtErr = require('../middleware/jwtErr');
// 导入Controller
const userController = new UserController();
const billController = new BillController();
const typeController = new TypeController();
const uploadController = new UploadController();
// 定义路由
const indexRouter = new Router();

const _jwt = jwtErr(config.jwt.secret);

indexRouter.post("/user/register", userController.register);
indexRouter.post("/user/login", userController.login);
// 获取用户信息
indexRouter.get("/user/get_userinfo", _jwt, userController.getUserInfo);
// 修改用户信息
indexRouter.post("/user/edit_userinfo", _jwt, userController.editUserInfo);
// 获取账单列表
indexRouter.get("/bill/list",_jwt,billController.list);
// 账单详情
indexRouter.get("/bill/detail",_jwt,billController.detail);
// 添加账单
indexRouter.post("/bill/add",_jwt,billController.add);
// 更新账单
indexRouter.post("/bill/update",_jwt,billController.update);
// 删除账单
indexRouter.post("/bill/delete",_jwt,billController.delete);
// 获取数据
indexRouter.get("/bill/data",_jwt,billController.data);
// 获取消费类型列表
indexRouter.get("/type/list",_jwt,typeController.list);
// 文件上传
indexRouter.post("/upload",_jwt,uploadController.upload);
module.exports = indexRouter;