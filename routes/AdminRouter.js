/**
 * Created by ian0214 on 17/11/14.
 */
let express = require('express');
let router = express.Router();
let ArticleSetModel = require('../model/articleSet');
let ArticleModel = require('../model/article');

// router.use(function (req, res, next) {
//     let auth = false;
//     if (!auth) {
//     next(new Error("未授权"))
//
//     }else{
//     next()
//
//     }
// });

let setModel = new ArticleSetModel();
let articleModel = new ArticleModel();
router.get('/article/set', function (req, res) {
    res.render('admin/ArticleSet', {title: "主题管理"});
});

router.get('/article/set/precreate', function (req, res) {
    setModel.precreate(function (no) {
        res.json({no: no})
    });
});

router.post('/article/set/save', function (req, res) {
    let args = req.body;
    console.log(args.articles);
    setModel.save(args.no, args.name, args.description, JSON.parse(args.articles), args.createTime,  function () {

        res.json({result: true})
    });
});

router.get('/article/data/sets', function (req, res) {
    setModel.list(function (list) {
        res.json({setList: list})
    });

});

router.get('/article/data/articles', function (req, res) {
    articleModel.list(null, function (articleList) {
        res.json({articleList: articleList});
    });
});

module.exports = router;