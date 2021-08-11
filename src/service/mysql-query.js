const mysql = require('mysql2');
const config = require('../../config/config.default.js');

// 创建连接池
const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
})

const query = function(sql,values){
  return new Promise((resolve,reject)=>{
    pool.getConnection((err,connection)=>{
      if(err){
        reject(err);
        console.log("[demo] 数据库连接失败");
        resolve({
          status:500
        });
      }else{
        console.log("[demo] 数据库连接成功");
        connection.query(sql,values,(err,results)=>{
          if(err){
            reject(err);
            resolve({
              status:400
            });
          }else{
            // 释放连接池
            connection.release();
            resolve({
              status:200,
              results
            })
          }
        })
      }
    })
  })
}

module.exports = {
  query
};