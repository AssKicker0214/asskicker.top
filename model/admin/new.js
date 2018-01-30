/**
 * Created by ian0214 on 17/12/19.
 */

let connectDB = require('../database');
let mongoose = require('mongoose');
let TimeUtl = require('../utls/timeUtl');

class Piece {
    constructor() {
        this.no = null;
        this.timeStamp = new TimeUtl().getCurrentTimeStamp();
        this.title = null;
        this.abstract = null;
        this.linkNo = null;
        this.linkUrl = null;
        this.posterUrl = null;
    }

    setData(obj) {
        this.setGeneral(obj.no, obj.title, obj.abstract, obj.posterName, obj.timeStamp)
    }

    setGeneral(no, title, abstract, posterName, timeStamp) {
        this.no = no || this.no;
        this.title = title || this.title;
        this.abstract = abstract || this.abstract;
        this.posterUrl = this.getPosterUrl(posterName) || this.posterUrl;
        this.timeStamp = timeStamp || this.timeStamp;
    }

    getPosterUrl(posterName) {
        if (posterName) {
            return "/uploads/news-bg-img/" + posterName;
        } else {
            return false
        }
    }

    linkTo(linkNo) {
        console.error("function 'linkTo' is not implemented");
    }

    getType() {
        console.error("function 'getType' is not implemented");
    }

    format() {
        return {
            no: this.no,
            timeStamp: this.timeStamp,
            title: this.title,
            abstract: this.abstract,
            type: this.getType(),
            linkNo: this.linkNo,
            linkUrl: this.linkUrl,
            posterUrl: this.posterUrl
        }
    }
}

class PlainNews extends Piece {

    linkTo() {
        // nothing to link
    }

    getType() {
        return "plain"
    }

}

class ArticleNews extends Piece{
    linkTo(no){
        this.linkNo = no;
        this.linkUrl = "/article/detail?no="+(no^0)
    }

    getType(){
        return "article";
    }
}

class NewsModel {
    constructor() {
        this.db = connectDB('app', "新闻模块数据库连接打开");

        let newsSchema = mongoose.Schema({
            no: Number,
            timeStamp: Number,
            title: String,
            abstract: String,
            type: String,

            // 关联
            linkNo: Number,
            linkUrl: String,

            // 背景图片链接
            posterUrl: String
        });

        this.News = this.db.model('News', newsSchema, 'news');
    }

    list(queryCallback) {
        this.News.find({}, {'_id': 0}, function (err, docs) {
            if (docs) {
                let newsList = [];
                docs.forEach(function (doc, index, array) {
                    let timeUtl = new TimeUtl();
                    // let createAgo = timeUtl.dayToNow(doc.createTime);
                    // let updateAgo = timeUtl.dayToNow(doc.updateTime);
                    let linkToText = "不关联";
                    if(doc.type === "article"){
                        linkToText = "博客";
                    }else if(doc.type === "lab"){
                        linkToText = "实验室";
                    }

                    let newsPiece = {
                        no: doc.no,
                        title: doc.title,
                        date: {
                            timeStamp: doc.timeStamp,
                            formatted: TimeUtl.formatDate('/', doc.timeStamp)
                        },
                        abstract: doc.abstract,
                        linkTo: {
                            type: doc.type,
                            text: linkToText,
                            no: doc.linkNo
                        },
                        content: doc.abstract
                        // createAgo: createAgo,
                        // updateAgo: updateAgo
                    };
                    newsList.push(newsPiece);
                });
                queryCallback(newsList);
            } else {
                queryCallback();
            }

        });
    }

    precreate(type, queryCallback) {

    }

    remove(no, removeCallback){
        // console.log(no);
        this.News.findOneAndRemove({no: no},{}, (err, doc)=>{
            // console.log(doc);
            if(err){
                // console.log("??");
                removeCallback({result: "删除失败"});
            }else{
                removeCallback({result: "已删除no="+no});
            }
        });
    }

    save(news, saveCallback) {
        let self = this;
        // console.log("\n model");
        // console.log(news);
        let piece = null;
        switch (news.type) {
            case "plain":
                piece = new PlainNews();
                break;
            case "article":
                piece = new ArticleNews();
                break;
        }
        piece.setData(news);
        piece.linkTo(news.linkNo);
        this.News.find({}, {no: 1}, (err, docs) => {
            let max = 0;
            if (docs) {
                docs.forEach(function (val, index, array) {
                    if (val.no > max) {
                        max = val.no;
                    }
                })
            }
            piece.no = news.no || max + 1;
            let data = piece.format();
            this.News.findOneAndUpdate({no: piece.no}, data, {upsert: true}, (err, doc) => {
                if (err) {
                    console.error(err);
                } else {
                    saveCallback({result: true});
                }
            });
        });

    }
}

module.exports = NewsModel;