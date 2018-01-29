/**
 * Created by ian0214 on 17/11/14.
 */
let express = require('express');
let router = express.Router();
let NewsModel = require('../model/admin/new');

let newsModel = new NewsModel();

router.get('/list', function (req, res) {
   newsModel.list(function (newsList) {
       res.json({list: newsList});
   })
});
module.exports = router;