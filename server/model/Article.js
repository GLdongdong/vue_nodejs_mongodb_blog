var mongoose = require('mongoose')

//创建规则
const article = new mongoose.Schema({
    title: { type: String },
    icon: { type: String },
    classifies: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Classify' }],
    content: { type: String }
}, {
    timestamps: true //时间戳
})
const Article = mongoose.model('Article', article)
// 导出模型
module.exports = Article
