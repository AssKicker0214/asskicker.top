var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/welcome', function (req, res, next) {
    res.render('index/welcome');
});

router.get('/composeHtml', function (req, res, next) {
    res.sendfile('views/index/composeSample.html');

});

router.get('/compose', function (req, res, next) {
    res.render('index/compose');

});

module.exports = router;
