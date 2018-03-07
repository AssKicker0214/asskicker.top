/**
 * Created by ian0214 on 18/1/2.
 */
let express = require('express');
let router = express.Router();
// let request = require('request');
let fs = require('fs');
let pdf = require('html-pdf');
let ResumeModel = require('../model/admin/resume');
let iputl = require('../model/utls/IPUtility');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send("lab root");
});

router.get('/closest-pair', function (req, res) {
    res.sendfile("public/lab/ClosestPair/ClosestPair.html");
});

// router.post('/resumark/convert2pdf', function (req, res) {
//     let option = {
//         url: "https://url-to-pdf-api.herokuapp.com/api/render",
//         method: "POST",
//         body: JSON.stringify({html: "<h1>test</h1>"}),
//         // body: {html: "<html><head><meta charset='utf-8'></head><body><h1>test</h1></body></html>"},
//         // json: true,
//         headers: {
//             "Content-type": "application/json"
//         }
//     };
//     request(option, function (error, response, body) {
//         // console.log(arguments);
//         console.log(body);
//         fs.writeFile("./test.pdf", body, function () {
//         });
//         res.json({res: body});
//     });
// });

let resumeModel = new ResumeModel();
router.post('/resumark/html-pdf', function (req, res) {
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    let html = req.body.html;
    let conf = {
        format: 'A4',
        border: '0'
    };
    let pdfName = (req.body.name || "ip"+ip.replace(/:/g,"-"))+".pdf";
    let pdfPath = __dirname+"/../public/downloads/resumark/"+pdfName;

    // extremely ugly
    if(fs.existsSync(pdfPath)){
        fs.unlink(pdfPath, function () {
            pdf.create(html, conf).toFile(pdfPath, function(err, response){
                // console.log(response);
                if(err) res.json({error: err});
                else res.json({url: "/downloads/resumark/"+pdfName});
            });
        })
    }else{
        pdf.create(html, conf).toFile(pdfPath, function(err, response){
            // console.log(response);
            if(err) res.json({error: err});
            else res.json({url: "/downloads/resumark/"+pdfName});
        });
    }
    // if(fs.existsSync(pdfPath)){
    //     fs.unlinkSync(pdfPath);
    // }

    // pdf.create(html).toBuffer(function (err, buffer) {
    //     if(err) console.error(err);
    //     res.send(buffer);
    // })
});

router.post('/resumark/save', function (req, res) {
    let args = req.body;
    resumeModel.save(args.name, args.content, function (success) {
        res.json({success: success})
    });
});

router.get('/resumark/fetch', function (req, res) {
    let special = req.query.special;
    resumeModel.find(special, function (doc) {
        res.json(doc);
    });
});

module.exports = router;