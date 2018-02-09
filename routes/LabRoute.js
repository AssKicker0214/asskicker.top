/**
 * Created by ian0214 on 18/1/2.
 */
var express = require('express');
var router = express.Router();
let request = require('request');
let fs = require('fs');
let pdf = require('html-pdf');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("lab root");
});

router.get('/closest-pair', function (req, res) {
    res.sendfile("public/lab/ClosestPair/ClosestPair.html");
});

router.post('/resumark/convert2pdf', function (req, res) {
    let option = {
        url: "https://url-to-pdf-api.herokuapp.com/api/render",
        method: "POST",
        body: JSON.stringify({html: "<h1>test</h1>"}),
        // body: {html: "<html><head><meta charset='utf-8'></head><body><h1>test</h1></body></html>"},
        // json: true,
        headers: {
            "Content-type": "application/json"
        }
    };
    request(option, function (error, response, body) {
        // console.log(arguments);
        console.log(body);
        fs.writeFile("./test.pdf", body, function () {
            
        });
        res.json({res: body});
    });
});

router.post('/resumark/html-pdf', function (req, res) {
    let html = req.body.html;
    let conf = {
        format: 'A4',

    };
    fs.unlinkSync("./demo.pdf");
    pdf.create(html, conf).toFile("./demo.pdf", function(err, response){
        console.log(response.filename);
        res.send("ok");
    });
    // pdf.create(html).toBuffer(function (err, buffer) {
    //     if(err) console.error(err);
    //     res.send(buffer);
    // })
});

module.exports = router;