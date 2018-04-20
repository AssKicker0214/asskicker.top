/**
 * Created by ian0214 on 17/12/4.
 */

let connectDB = require('../database');
let mongoose = require('mongoose');
let TimeUtl = require('./timeUtl');
let Location = require('./location');

function ipv6toipv4(ipv6) {
    return ipv6.split(":").pop();
}

class IPUtility {
    constructor() {
        this.db = connectDB('app', '=> ip utility online');
        let likeSchema = mongoose.Schema({
            ipv6: String,
            votes: Number,
            time: Number,
            addr: {
                detail: {
                    province: String,
                    city: String,
                    district: String,
                    street: String,
                    street_number: String,
                    city_code: Number
                },
                point:{
                    y: String,
                    x: String
                },
                coor: String
            }
        });

        this.Like = this.db.model('Like', likeSchema, 'likes')
    }


    like(ipv6, saveCallback) {
        let self = this;

        let location = new Location();
        location.fromIP2(ipv6toipv4(ipv6)).then((addr)=>{
            let like = new this.Like({
                ipv6: ipv6,
                time: new TimeUtl().getCurrentTimeStamp(),
                votes: 1,
                addr: addr
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