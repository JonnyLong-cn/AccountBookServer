const query = require('../service/mysql-query').query;
class TypeService {
  async list(id) {
    const sql = `select * from type where user_id=0 or user_id=${id}`;
    try {
      const res = await query(sql);
      if (res.status === 200) {
        return res.results;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
module.exports = TypeService;