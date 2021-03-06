let express = require('express');
let router = express.Router();
let IPUtility = require('../model/utls/IPUtility');
let iputl = new IPUtility();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/welcome', function (req, res, next) {
    res.render('index/welcome', {content: "Constructing..."});
});

router.get('/test/*', function(req, res, next){
    console.log('test');
    next()
});

router.get('/test/next', function (req, res, next) {
    console.log('next');
    res.send("done");
});

router.post('/i-like-it', function (req, res) {
    if (req.cookies.liked) {
        res.json({liked: true});
    }else{
        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        iputl.like(ip, function (cnt) {
            res.cookie("liked", "true");
            res.json({'like-cnt': cnt});
        });
    }
});

router.get('/like-cnt', function (req, res) {
    iputl.countLike(function (cnt) {
        let liked = req.cookies.liked === "true";
        res.json({likeCnt: cnt, liked: liked});
    });
});

router.get('/test', function (req, res) {
    res.sendfile('public/TestNavigation.html')
});

router.get('/composeHtml', function (req, res, next) {
    res.sendfile('views/index/composeSample.html');

});

router.get('/compose', function (req, res, next) {
    res.render('index/compose');

});

module.exports = router;
