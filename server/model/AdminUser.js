var mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//创建规则
const adminuser = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        // 编辑的时候不会显示密码
        select: false,
        set(val) {
            // npm i bcryptjs 密码加密  hashSync散列值
            return require('bcryptjs').hashSync(val, 10)
        }

    },
})
// 导出模型
module.exports = mongoose.model('AdminUser', adminuser)
