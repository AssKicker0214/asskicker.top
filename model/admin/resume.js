let connectDB = require('../database');
let mongoose = require('mongoose');

class Resume{
    constructor(){
        this.db = connectDB('app', "简历数据库模块打开");

        let resumeSchema = mongoose.Schema({
            name: String,
            content: String
        });

        this.ResumeModel = this.db.model('Resume', resumeSchema, 'resumes');
    }

    save(name, content, cb){
        this.ResumeModel.findOneAndUpdate({name: name}, {content: content}, {upsert: true}, function (err, doc) {
            if (err) {
                console.error(err);
                cb(false);
            } else {
                cb(true);
            }
        })
    }

    find(name, cb){
        this.ResumeModel.findOne({name: name}, {_id: 0}, function (doc) {
            cb(doc)
        })
    }
}

module.exports = Resume;