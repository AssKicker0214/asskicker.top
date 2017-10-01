let express = require('express');
let router = express.Router();

router.get('/bunny', function (req, res, next) {
    res.sendfile('views/surprise/start.html');
});

router.get('/bunny/main', function (req, res, next) {
    res.render('surprise/main');
});

router.get('/vdemo', function (req, res, next) {
    res.sendfile('views/surprise/CountDownDemo.html');
});

module.exports = router;
