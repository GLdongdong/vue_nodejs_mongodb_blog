module.exports = app => {
    var ObjectID = require('mongodb').ObjectID;
    const router = require('express').Router()
    const mongoose = require('mongoose')
    // mongoose.connect('mongodb://localhost/classify', { useNewUrlParser: true })
    const Article = require('../../model/Article')
    const Classify = require('../../model/Classify')
    const Articles = mongoose.model('Article')
    const Classifys = mongoose.model('Classify')
    router.get('/news/list', async (req, res) => {
        // const cats = await Classify.find().lean() //lean()取纯粹的json数据 
        const all = await Classify.find().lean()
        // console.log(all);
        const cats = await Classify.aggregate([
            { $match: { all: all._id } },
            {
                $lookup: {
                    //关联那个表
                    from: 'articles',
                    localField: '_id', //本地键
                    foreignField: 'classifies',//对应外地键
                    as: 'newsList'
                }
            }
        ])
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '首页',
            newsList: await Article.find().where({
                classifies: {
                    $in: subCats
                }
            }).lean()
        })
        res.send(cats)
    })
    //文章详情
    router.get('/articles/:id', async (req, res) => {
        //取路由id req.params.id
        const data = res.send(await Article.findById(req.params.id))
        res.send(data)
    })
    // 分类文章
    router.get('/pages/:id', async (req, res) => {
        const cats = await Classify.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.params.id), } },
            {
                $lookup: {
                    //关联那个表
                    from: 'articles',
                    localField: '_id', //本地键
                    foreignField: 'classifies',//对应外地键
                    as: 'newsList'
                }
            },
        ])

        // console.log(cats);
        res.send(cats)
    })


    app.use('/web/api', router)
}