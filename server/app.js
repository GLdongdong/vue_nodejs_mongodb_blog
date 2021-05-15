const express = require('express')


const app = express()
// 秘钥
app.set('secret', '1326asd54asah')

//跨域中间件
app.use(require('cors')(
))
// var cors = require('cors');
// app.use(cors({
//     origin: ['http://localhost:8081'],
//     methods: ['GET', 'POST'],
//     alloweHeaders: ['Conten-Type', 'Authorization']
// }));
// 请求json中间件
app.use(express.json())
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

app.use('/admin/', express.static(__dirname + '/admin'))
app.use('/', express.static(__dirname + '/web'))

app.use('/uploads', express.static(__dirname + '/uploads'))


require('./routers/admin/admin_index')(app)
require('./routers/web/index')(app)
require('./plugins/db')(app)

//添加监听端口
app.listen(3000, () => {
    console.log('http://localhost:3000');
})