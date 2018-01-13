/**
 * Created by ian0214 on 17/11/14.
 */
let express = require('express');
let router = express.Router();
let TopicModel = require('../model/admin/topic');
let ArticleModel = require('../model/article');
let NewsModel = require('../model/admin/new');
let auth = require('../model/utls/Authentication');
let multer = require('multer');
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

let topicModel = new TopicModel();
let articleModel = new ArticleModel();
let newsModel = new NewsModel();

let validateAuthentication = function (req, res, next) {
    let authed = false;
    if (req.cookies.AuthToken) {
        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        authed = auth.authCheck(req.cookies.AuthToken, ip);
    }

    if (authed) {
        next();
    } else {
        let target = req.originalUrl;
        res.redirect(302, '/admin/login?target=' + target);
    }
};
// 权限验证,article
router.get('/article/*', validateAuthentication);

router.get('/login', function (req, res) {
    res.render('admin/Login', {redirectUrl: req.query.target});
});

router.post('/check', function (req, res) {
    let permit = false;
    let password = req.body.password;
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    let checkResult = auth.login(password, ip);
    if (checkResult.result === true) {
        let token = auth.createToken(ip);
        res.cookie("AuthToken", token);
        res.json(checkResult);
    } else {
        res.json(checkResult);
    }
});

router.get('/article/topic', function (req, res) {
    res.render('admin/topic', {title: "主题管理"});
});

router.get('/article/topic/precreate', function (req, res) {
    topicModel.precreate(function (no) {
        res.json({no: no})
    });
});

router.post('/article/topic/save', function (req, res) {
    let args = req.body;
    // console.log(args.articles);
    topicModel.save(args.no, args.name, args.description, JSON.parse(args.articles), args.createTime, function () {

        res.json({result: true})
    });
});

router.get('/article/data/topics', function (req, res) {
    topicModel.list(function (list) {
        res.json({topicList: list})
    });

});

router.get('/article/data/articles', function (req, res) {
    articleModel.list(null, function (articleList) {
        res.json({articleList: articleList});
    });
});


router.get('/article/edit', function (req, res, next) {
    res.render('article/articleEdit', {no: req.query.no, title: '修改文章'})
});

router.get('/news', function (req, res, next) {

    res.render('admin/news', {title: "新闻管理"});
});

router.post('/news/upload-bg-img', function (req, res, next) {
    let upload = multer({
        storage: multer.diskStorage({
            //设置上传后文件路径，uploads文件夹会自动创建。
            destination: function (req, file, cb) {
                cb(null, './public/uploads/news-bg-img')
            },
            //给上传文件重命名，获取添加后缀名
            filename: function (req, file, cb) {
                let fileFormat = (file.originalname).split(".");
                cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
    }).single('bg-img');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.error(err);
            next();
        }
        // console.log(req.file);
        res.json({url: "/public/uploads/news-bg-img/" + req.file.filename});
    })

});
module.exports = router;