var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var UserData = require('../model/user.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('register', {title: '注册'});
});

router.get('/signup', function (req, res, next) {
    var u = new UserData();
    u.save({name: req.query.name});
    res.end('ok')
    // u.save()
});

// router.get('/find', function (req, res, next) {
//    var u = new UserData();
//    u.findAll();
//    res.end('query');
// });
module.exports = router;
