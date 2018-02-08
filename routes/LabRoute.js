/**
 * Created by ian0214 on 18/1/2.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("lab root");
});

router.get('/closest-pair', function (req, res) {
    res.sendfile("public/lab/ClosestPair/ClosestPair.html");
});


module.exports = router;