/**
 * Created by ian0214 on 2017/8/8.
 */
let connectDB = require('./database');
let mongoose = require('mongoose');
let TimeUtl = require('./utls/timeUtl');

class ArticleSetModel {
    // db
    // Article

    constructor() {
        this.db = connectDB('app');

        let articleSetSchema = mongoose.Schema({
            no: Number,
            createTime: Number,
            updateTime: {
                year: Number,
                month: Number,
                date: Number,
                hour: Number,
                minute: Number,
                second: Number
            },
            name: String,
            description: String,
            articles: [{articleNo: Number}]
        });

        this.ArticleSet = this.db.model('ArticleSet', articleSetSchema, 'articleSets');
    }

    save(no, name, description, articles, createTime, saveCallback) {
        let newData = {
            name: name,
            description: description,
            updateTime: new TimeUtl().getCurrentTimeJson(),
            articles: articles
        };
        console.info("article set saving...\n" + JSON.stringify(newData));

        if (createTime) {
            newData.createTime = createTime;
        } else {
            console.info("no createTime" + createTime);
        }

        this.ArticleSet.findOneAndUpdate({no: no}, newData, {upsert: true}, function (err, doc) {
            if (err) {
                console.error(err);
            } else {
                saveCallback(new TimeUtl().getCurrentTimeString());
            }
        })
    }

    precreate(queryCallback) {
        this.ArticleSet.find({}, {no: 1}, function (err, docs) {
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

    list(queryCallback) {
        this.ArticleSet.find({}, {'_id': 0}, function (err, docs) {
            if (docs) {
                let articleSets = [];
                docs.forEach(function (doc, index, array) {
                    let timeUtl = new TimeUtl();
                    // let createAgo = timeUtl.dayToNow(doc.createTime);
                    // let updateAgo = timeUtl.dayToNow(doc.updateTime);
                    let articleSet = {
                        no: doc.no,
                        name: doc.name,
                        description: doc.description,
                        articles: doc.articles
                        // createAgo: createAgo,
                        // updateAgo: updateAgo
                    };
                    articleSets.push(articleSet);
                });
                queryCallback(articleSets);
            } else {
                queryCallback();
            }

        });
    }

    listContents(queryCallback){
        this.ArticleSet.find({}, {'_id': 0, 'no': 1, 'title': 1, 'content':1}, function (err, docs) {
            if (docs) {
                let articles = [];
                docs.forEach(function (doc, index, array) {
                    let article = {
                        no: doc.no,
                        title: doc.title,
                        content: doc.content,
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
        // this.Article.findOne({no:no}, {_id:0}, function (err, doc) {
        //     queryCallback(doc);
        // })
    }

}

module.exports = ArticleSetModel;