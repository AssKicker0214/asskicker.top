var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demo' });
});

router.get('/welcome', function (req, res, next) {
    // res.render('index/welcome');
});

module.exports = router;
