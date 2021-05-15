module.exports = app => {
    const mongoose = require("mongoose")
    mongoose.connect('mongodb://localhost/classify', { useNewUrlParser: true })
        .then(() => console.log("数据库连接成功"))
        .catch(() => console.log(err, "数据库连接失败"));
    var controllers = require('require-all')({
        dirname: __dirname + '/../model',
        // filter: /(.+Controller)\.js$/,
        // excludeDirs: /^\.(git|svn)$/,
        // recursive: true
    });

}