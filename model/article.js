/**
 * Created by ian0214 on 2017/8/8.
 */
let connectDB = require('./database');
let mongoose = require('mongoose');
let TimeUtl = require('./utls/timeUtl');

class ArticleModel {
    // db
    // Article

    constructor() {
        this.db = connectDB('app');

        let articleSchema = mongoose.Schema({
            no: Number,
            createTime: {
                year: Number,
                month: Number,
                date: Number,
                hour: Number,
                minute: Number,
                second: Number
            },
            updateTime: {
                year: Number,
                month: Number,
                date: Number,
                hour: Number,
                minute: Number,
                second: Number
            },
            title: String,
            content: String,
            keywords: [{keyword: String}]
        });

        this.Article = this.db.model('Article', articleSchema, 'articles');
    }

    save(no, title, content, keywords, createTime, saveCallback) {
        console.log("saving");
        let newData = {
            content: content,
            updateTime: new TimeUtl().getCurrentTimeJson(),
            title: title,
            keywords: keywords
        };
        console.info("saving...\n" + JSON.stringify(newData));

        if (createTime) {
            newData.createTime = JSON.parse(createTime);
        } else {
            console.info("=========no createTime" + createTime);
        }

        this.Article.findOneAndUpdate({no: no}, newData, {upsert: true}, function (err, doc) {
            if (err) {
                console.error(err);
            } else {
                saveCallback(new TimeUtl().getCurrentTimeString());
            }
        })
    }

    precreate(author, queryCallback) {
        this.Article.find({}, {no: 1}, function (err, docs) {
            let max = 0;
            if (docs) {
                docs.forEach(function (val, index, array) {
                    if (val.no > max) {
                        max = val.no;
                    }
                })
            }
            queryCallback(max + 1);
        });
    }

    list(author, queryCallback) {
        this.Article.find({}, {'_id': 0}, function (err, docs) {
            if (docs) {
                let articles = [];
                docs.forEach(function (doc, index, array) {
                    let timeUtl = new TimeUtl();
                    let createAgo = timeUtl.dayToNow(doc.createTime);
                    let updateAgo = timeUtl.dayToNow(doc.updateTime);
                    let article = {
                        no: doc.no,
                        title: doc.title,
                        content: doc.content,
                        createAgo: createAgo,
                        updateAgo: updateAgo
                    };
                    articles.push(article);
                });
                queryCallback(articles);
            } else {
                queryCallback();
            }

        });
    }

    listContents(queryCallback){
        this.Article.find({}, {'_id': 0, 'no': 1, 'title': 1, 'content':1, 'keywords': 1}, function (err, docs) {
            if (docs) {
                let articles = [];
                docs.forEach(function (doc, index, array) {
                    let article = {
                        no: doc.no,
                        title: doc.title,
                        content: doc.content,
                        keywords: doc.keywords
                    };
                    articles.push(article);
                });
                queryCallback(articles);
            } else {
                queryCallback();
            }

        });
    }

    // handleEscape: 是否将\转义
    find(no, queryCallback){
        this.Article.findOne({no:no}, {_id:0}, function (err, doc) {
            queryCallback(doc);
        })
    }

}

module.exports = ArticleModel;