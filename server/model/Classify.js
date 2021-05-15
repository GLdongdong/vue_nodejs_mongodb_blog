var mongoose = require('mongoose')

//创建规则
const classify = new mongoose.Schema({
    name: {
        type: String,
    },
    parent: {
        //表示类型是数据库里的ObjectId 关联的模型classify
        type: mongoose.SchemaTypes.ObjectId, ref: 'Classify'
    },
    article: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'Article'
    }
})

// 导出模型
module.exports = mongoose.model('Classify', classify)
