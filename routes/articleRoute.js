let express = require('express');
let router = express.Router();
let ArticleModel = require('../model/article');
let NLP = require("../model/nlp");
// let n = require('natural');
let articleModel = new ArticleModel();
let nlp = new NLP();
/* GET home page. */
router.post('/save', function(req, res, next) {
    let args = req.body;
    console.log(args);
    let keywords = {};
    if(args.keywords){
        keywords = JSON.parse(args.keywords);
    }
    articleModel.save(args.no, args.title, args.content, keywords, args.createTime, function (saveTime) {
      res.send("saved");
  });
});

router.get('/create', function (req, res, next) {
    articleModel.precreate(null, function (no) {
        res.render('index/compose', {no: no});
    });
});

router.get('/edit', function (req, res, next) {
    res.render('index/articleEdit', {no: req.query.no, title: '修改文章'})
});

router.get('/list', function (req, res, next) {
    articleModel.list(null, function (list) {
        if(list){
            // res.send(JSON.stringify(list));
            res.render("index/articleList", {list: list});
        }else{
            console.info("")
        }
    })
});

router.get('/detail', function (req, res, next) {
    res.render("index/articleDetail", {no: req.query.no})

});

router.get('/find', function (req, res, next) {
    let no = req.query.no;
    articleModel.find(no, function (doc) {
        if(doc){
            res.json(doc);
        }else{
            res.json(404, {msg: "没有找到文章，序号", no : no});
        }
    })
});

router.get('/nlp/tfidf', function (req, res) {
    let targetNo = req.query.no;
    // console.log(targetNo);
    let segmentsArray = [];

    let targetIndex = 0;
    articleModel.listContents(function (docs) {
        for(let i=0;i<docs.length;i++){
            let doc = docs[i];
            let segments = nlp.segment(doc.content);
            // console.log(segments);
            // console.log(doc.no+"--"+targetNo);
            if(doc.no === parseInt(targetNo, 10)){
                targetIndex = i;
            }
            segmentsArray.push(segments);
        }

        let tfidfs = [];
        if(targetIndex !== 0){
            tfidfs = nlp.getTfidf(targetIndex, segmentsArray);
        }
        res.send(tfidfs);
    });
});


module.exports = router;
