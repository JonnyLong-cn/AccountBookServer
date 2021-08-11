const UserService = require('../src/service/user');
const userService = new UserService();

test('register',()=>{
  let res = userService.getUserByName("Alice");
  expect(typeof res === 'object').toBe(true);
})