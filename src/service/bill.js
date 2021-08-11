const query = require('./mysql-query').query;
const moment = require('moment')
class BillService{
  async list(user_id){
    const sql = `select * from bill where user_id=${user_id}`;
    try{
      const res = await query(sql);
      if(res.status===200){
        return res.results;
      }else{
        return null;
      }
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async detail(id,user_id){
    const sql = `select * from bill where id=${id} and user_id=${user_id}`;
    try{
      const res = await query(sql);
      if(res.status===200){
        return res.results;
      }else{
        return null;
      }
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async add(params){
    const sql = "insert into bill(pay_type,amount,date,type_id,type_name,user_id,remark) values(?,?,?,?,?,?,?)";
    try{
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const arr = [params.pay_type,params.amount,currentTime,params.type_id,params.type_name,params.user_id,params.remark];
      let res = await query(sql,arr);
      return res;
    }catch(err){
      console.log(err);
      return null;
    }
  }

  async update(params){
    const sql = 'update bill set pay_type=?,amount=?,date=?,type_id=?,type_name=?,user_id=?,remark=? where id=?';
    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const arr = [params.pay_type,params.amount,currentTime,params.type_id,params.type_name,params.user_id,params.remark,params.id];
      let res = await query(sql,arr);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async delete(id,user_id){
    const sql = `delete from bill where id=${id} and user_id=${user_id}`;
    try {
      const result = await query(sql);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = BillService;