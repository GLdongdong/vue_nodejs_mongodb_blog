// const classify = require("../../model/classify")

module.exports = app => {
    const express = require("express")
    const jwt = require('jsonwebtoken')
    // npm i http - assert if判断缩写
    const assert = require('http-assert')
    const AdminUser = require('../../model/AdminUser')
    //登录验证 中间件
    const judge = async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请先登录')//请先提供 jwt token
        // verify校验id
        const { id } = jwt.verify(token, app.get('secret'))
        assert(id, 401, '请先登录')//无效 jwt token
        // 查询id用户  
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登录')
        await next()
    }
    const router = express.Router({
        //合并参数
        mergeParams: true
    })
    // const req.Model = require('../../model/req.Model')
    //创建分类
    router.post('/', async (req, res) => {
        // 创建数据               通过客户端传来的数据创建数据 
        const model = await req.Model.create(req.body)
        //发回给客户端 是否创建完成
        res.send(model)
        // console.log(req.body);
    })
    //分类列表
    router.get('/', async (req, res) => {
        const qureyOptions = {
        }
        if (req.Model.modelName === 'Classify') {
            qureyOptions.populate = 'parent'
            // qureyOptions.populate = 'classifies'
        }
        // 查找数据库里的数据并限制10条
        const items = await req.Model.find().setOptions(qureyOptions).limit(100)
        //发回给前端 
        res.send(items)
    })
    //修改分类(通过id同步修改页面的输入框名字)
    router.get('/:id', async (req, res) => {
        // 通过id查找内容
        const item = await req.Model.findById(req.params.id)
        //发回给前端 
        res.send(item)
    })
    //put请求修改内容
    router.put('/:id', async (req, res) => {
        // 通过id查找内容并更新
        const item = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        //发回给前端 
        res.send(item)
    })
    //delete删除分类
    router.delete('/:id', async (req, res) => {
        // 通过id查找内容并删除
        const item = await req.Model.findByIdAndDelete(req.params.id, req.body)
        //发回给前端 
        res.send({
            success: true
        })
    })
    // resoure 动态资源匹配
    app.use('/admin/api/rest/:resource', judge, async (req, res, next) => {
        // 把小写复数类名转换为大写单数类名 inflection
        const modelName = require('inflection').classify(req.params.resource)
        // 为了让router能够请求到Model 添加req
        req.Model = require(`../../model/${modelName}`)
        next()
    }, router)


    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../../uploads' })
    //图片的上传  npm i multer 处理上传数据   express无法获取上传数据  single 单个文件上传
    app.post('/admin/api/upload', judge, upload.single("file"), async (req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 登陆接口

    app.post('/admin/api/login', async (req, res) => {
        const { username, password } = req.body
        //1.根据用户名找用户
        // const AdminUser = require('../../model/AdminUser')
        const user = await AdminUser.findOne({
            username: username
        })
            .select('+password')
        assert(user, 433, '用户不存在')
        // if (!user) {
        //     return res.status(433).send({
        //         message: '用户不存在'
        //     })
        // }
        //2.检验密码
        const isTrue = require('bcryptjs').compareSync(password, user.password)
        assert(isTrue, 433, '密码错误')
        // if (!isTrue) {
        //     return res.status(433).send({
        //         message: '密码错误'
        //     })
        // }

        //3.返回token
        // npm i jsonwebtoken  token验证


        // const jwt = require('jsonwebtoken')
        // 生成一个token
        const token = jwt.sign({ id: user._id }, app.get('secret'))
        res.send({ token })
    })
    // 退出账号
    app.get('admin/api/quiet', async (req, res) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 422, '退出成功')
    })

    //错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}
