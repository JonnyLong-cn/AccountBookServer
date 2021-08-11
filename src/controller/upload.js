const fs = require('fs');
const moment = require('moment');
const path = require('path');

class UploadController {
  async upload(ctx) {
    let file = ctx.request.files.file;
    const f = file.name.split('.');
    let fileName = f[0], ext = f[1];
    let filePath;
    // console.log(file);
    try {
      const data = fs.readFileSync(file.path);
      // 获取当前日期，标识图片
      let day = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss');
      fileName = fileName + day.toString() + "." + ext;
      filePath = path.join(__dirname, '../static/upload', fileName);
      fs.writeFileSync(filePath, data);
    } catch (err) {
      console.log(err);
    }
    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: filePath
    }
  }
}

module.exports = UploadController;