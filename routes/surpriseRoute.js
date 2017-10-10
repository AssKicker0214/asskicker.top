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

router.get('/ielts', function (req, res) {
    res.sendfile('views/surprise/ielts-chart.html');

});
module.exports = router;
