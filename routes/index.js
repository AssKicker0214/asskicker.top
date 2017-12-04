let express = require('express');
let router = express.Router();
let IPUtility = require('../model/utls/IPUtility');
let iputl = new IPUtility();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/welcome', function (req, res, next) {
    res.render('index/welcome', {content: "Welcome"});
});

router.post('/i-like-it', function (req, res) {
    if (req.cookie) {

    }
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    iputl.like(ip, function (cnt) {
        console.log(req.ip);
        res.json({'like-cnt': cnt});
    });
});

router.get('/like-cnt', function (req, res) {
    iputl.countLike(function (cnt) {
        res.json({likeCnt: cnt})
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
