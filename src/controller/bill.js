const BillService = require('../service/bill');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config/config.default');

const billService = new BillService();
class BillController {
  // 列举所有账单
  async list(ctx) {
    const { date, page, page_size = 5, type_id = 'all' } = ctx.query
    // 获取token正文
    const token = ctx.request.header.authorization.split(' ')[1];
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      const billList = await billService.list(decode.id);
      const _billList = billList.filter(item => {
        if (type_id !== 'all') {
          return moment(new Date(item.date)).format('YYYY-MM') === date && type_id == item.type_id;
        }
        return moment(new Date(item.date)).format('YYYY-MM') === date;
      })

      // 格式化，将账单按照日期分类
      let listMap = _billList.reduce((prev, cur, index, array) => {
        // 当前位置的时间
        const date = moment(new Date(cur.date)).format('YYYY-MM-DD');
        // 找当前时间在累加数组中相同日期的位置
        const currentIndex = prev.findIndex(item => item.date === date);
        // 找到了就将加入到那个数组中
        if (currentIndex > -1) {
          const index = currentIndex;
          prev[index].bills.push(cur);
        }
        // 没找到就创建新数组项
        if (currentIndex === -1) {
          prev.push({
            date,
            bills: [cur]
          });
        }
        return prev;
      }, []).sort((a, b) => { return b.date - a.date });

      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
      let __list = billList.filter(item => moment(new Date(item.date)).format('YYYY-MM') === date);
      // 计算总收入和总支出，1为收入，2为支出
      let totalIncome = __list.reduce((prev, cur) => {
        if (cur.pay_type === 1) {
          prev += Number(cur.amount);
          return prev;
        }
        return prev;
      }, 0);
      let totalExpense = __list.reduce((prev, cur) => {
        if (cur.pay_type == 2) {
          prev += Number(cur.amount)
          return prev;
        }
        return prev;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || []
        }
      }
    } catch (err) {
      console.log(err);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        date: null
      }
    }
  }

  // 添加账单
  async add(ctx) {
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 获取token正文
    const token = ctx.request.header.authorization.split(' ')[1];
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) {
        return;
      }
      let user_id = decode.id;
      const res = await billService.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
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

  // 账单详情
  async detail(ctx) {
    const { id = '' } = ctx.query;
    // 获取token正文
    const token = ctx.request.header.authorization.split(' ')[1];
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) return;
      if (!id) {
        ctx.body = {
          code: 500,
          msg: '订单id不能为空',
          data: null
        }
        return
      }
      let user_id = decode.id;
      const detail = await billService.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail
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

  // 账单更新
  async update(ctx) {
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    const token = ctx.request.header.authorization.split(' ')[1];
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) return;
      let user_id = decode.id;
      const result = await billService.update({
        id,
        amount,
        type_id,
        type_name,
        pay_type,
        remark,
        user_id
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
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

  // 删除账单
  async delete(ctx) {
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }
    const token = ctx.request.header.authorization.split(' ')[1];
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) return;
      let user_id = decode.id;
      const res = await billService.delete(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
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

  async data(ctx) {
    const { date = '' } = ctx.query;
    const token = ctx.request.header.authorization.split(' ')[1];
    try {
      const decode = await jsonwebtoken.verify(token, config.jwt.secret);
      if (!decode) return;
      let user_id = decode.id;
      if (!date) {
        ctx.body = {
          code: 400,
          msg: '参数错误',
          data: null
        }
        return;
      }
      const result = await billService.list(user_id);
      // 起止时间
      const start = moment(date).startOf('month'); // 选择月份，月初时间
      const end = moment(date).endOf('month'); // 选择月份，月末时间
      const _data = result.filter(item => {
        const itemDate = new Date(item.date);
        if (itemDate > start && itemDate < end) {
          return item;
        }
      });
      // 总收入
      const total_income = _data.reduce((prev, cur) => {
        if (cur.pay_type === 1) {
          prev += Number(cur.amount);
        }
        return prev;
      }, 0)
      // 总支出
      const total_expense = _data.reduce((prev, cur) => {
        if (cur.pay_type === 2) {
          prev += Number(cur.amount);
        }
        return prev;
      }, 0);

      // 获取收支构成
      let total_data = _data.reduce((prev, cur) => {
        const index = prev.findIndex(item => item.type_id == cur.type_id)
        if (index == -1) {
          prev.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount)
          });
        }
        if (index > -1) {
          prev[index].number += Number(cur.amount);
        }
        return prev;
      }, []);

      total_data = total_data.map(item => {
        item.number = Number(Number(item.number).toFixed(2))
        return item
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          // 保留两位小数
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
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
module.exports = BillController;