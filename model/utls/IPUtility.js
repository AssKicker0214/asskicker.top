/**
 * Created by ian0214 on 17/12/4.
 */

let connectDB = require('../database');
let mongoose = require('mongoose');
let TimeUtl = require('./timeUtl');

class IPUtility {
    constructor() {
        this.db = connectDB('app', '=> ip utility online');
        let likeSchema = mongoose.Schema({
            ipv6: String,
            votes: Number,
            time: Number
        });

        this.Like = this.db.model('Like', likeSchema, 'likes')
    }

    like(ipv6, saveCallback) {
        let self = this;
        let like = new this.Like({
            ipv6: ipv6,
            time: new TimeUtl().getCurrentTimeStamp(),
            votes: 1
        });
        like.save(function (err, doc) {
            if (err) {
                console.error(err);
            } else {
                self.countLike(function (cnt) {
                    saveCallback(cnt);
                });
            }
        });
    }

    countLike(callback) {
        this.Like.count({}, function (error, cnt) {
            if (error) {
                console.error(error);
            } else {
                callback(cnt);
            }
        });

    }
}

module.exports = IPUtility;