/**
 * Created by ian0214 on 17/12/19.
 */

let connectDB = require('../database');
let mongoose = require('mongoose');
let TimeUtl = require('../utls/timeUtl');

class Piece{
    constructor(){
        this.no = null;
        this.time = new TimeUtl().getCurrentTimeStamp();
        this.title = null;
        this.abstract = null;
        this.linkNo = null;
        this.linkUrl = null;
        this.posterUrl = null;
    }

    linkTo(linkNo){
        console.error("function 'linkTo' is not implemented");
    }

    getType(){
        console.error("function 'getType' is not implemented");
    }

    format(){
        return {
            no: this.no,
            time: this.time,
            title: this.title,
            abstract: this.abstract,
            type: this.getType(),
            linkNo: this.linkNo,
            linkUrl: this.linkUrl,
            posterUrl: this.posterUrl
        }
    }
}

class PlainNews extends Piece{


    linkTo(){
        // nothing to link
    }

    set(no, title, abstract, posterUrl){
        this.no = no || this.no;
        this.title = title || this.title;
        this.abstract = abstract || this.abstract;
        this.posterUrl = posterUrl || this.posterUrl;
    }

    getType(){
        return "plain"
    }

}

class News{
    constructor() {
        this.db = connectDB('app');

        let articleSchema = mongoose.Schema({
            no: Number,
            time: Number,
            title: String,
            abstract: String,
            type: String,
            linkNo: Number,
            linkUrl: String,
            posterUrl: String
        });

        this.News = this.db.News('News', articleSchema, 'news');
    }

    list(){

    }

    precreate(type, queryCallback) {
        let piece = null;
        switch (type){
            case "plain": piece=new PlainNews(); break;
        }
        this.News.find({}, {no: 1}, function (err, docs) {
            let max = 0;
            if (docs) {
                docs.forEach(function (val, index, array) {
                    if (val.no > max) {
                        max = val.no;
                    }
                })
            }
            piece.no = max+1;
            queryCallback(max + 1);
        });
    }

    save(news, saveCallback){
        let data = news.format();
        this.News.findOneAndUpdate({no: no}, data, {upsert: true}, function (err, doc) {
            if (err) {
                console.error(err);
            } else {
                saveCallback(new TimeUtl().getCurrentTimeString());
            }
        })
    }
}

module.exports = News;