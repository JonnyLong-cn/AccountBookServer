const query = require('./mysql-query').query;
const moment = require('moment')
class UserService{
  /**
   * 根据username查询user
   * @param {*} username 
   * @returns user
   */
  async getUserByName(username){
    const sql = `select * from user where username = "${username}";`;
    try{
      let res = await query(sql);
      return res.results;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  /**
   * 注册，即插入数据
   * @param {*} params 数组，长度为5，字段依次为
   *    username,password,ctime,avatar,signature
   *    插入到数据库中id会自增
   * @returns 
   */
  async insertUser(params){
    const sql = "insert into user(username,password,ctime,avatar,signature) values(?,?,?,?,?)";
    try{
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const arr = [params.username,params.password,currentTime,params.avatar,params.signature];
      let res = await query(sql,arr);
      return res;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async editUserInfo(params){
    const sql = 'update user set ctime=?,avatar=?,signature=? where id=?;';
    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const arr = [currentTime,params.avatar,params.signature,params.id];
      let res = await query(sql,arr);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = UserService;