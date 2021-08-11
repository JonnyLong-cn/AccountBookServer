# 账本项目后台
接口：
```js
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
// 获取用户信息
router.get("/user/get_userinfo", _jwt, userController.getUserInfo);
// 修改用户信息
router.post("/user/edit_userinfo", _jwt, userController.editUserInfo);
// 获取账单列表
router.get("/bill/list",_jwt,billController.list);
// 账单详情
router.get("/bill/detail",_jwt,billController.detail);
// 添加账单
router.post("/bill/add",_jwt,billController.add);
// 更新账单
router.post("/bill/update",_jwt,billController.update);
// 删除账单
router.post("/bill/delete",_jwt,billController.delete);
// 获取数据
router.get("/bill/data",_jwt,billController.data);
// 获取消费类型列表
router.get("/type/list",_jwt,typeController.list);
// 文件上传
router.post("/upload",_jwt,uploadController.upload);
```
项目依赖：
```yaml
specifiers:
  jest: ^27.0.6
  jsonwebtoken: ^8.5.1
  koa: ^2.13.1
  koa-body: ^4.2.0
  koa-json: ^2.0.2
  koa-jwt: ^4.0.1
  koa-logger: ^3.2.1
  koa-onerror: ^4.1.0
  koa-router: ^10.0.0
  koa-static: ^5.0.0
  koa2-cors: ^2.0.6
  moment: ^2.29.1
  mysql2: ^2.2.5
```