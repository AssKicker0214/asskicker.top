/**
 * Created by ian0214 on 2017/7/21.
 */
var connectDB = require('./database');
var mongoose = require('mongoose');

var db = connectDB('test');
var userSchema = mongoose.Schema({
    name: String
});

userSchema.statics.findAll = function (cb) {
    var rs = this.find({});
    console.log(rs);
};

var User = db.model('User', userSchema, 'User');
function UserData() {

    this.save = function (info) {
        var user = new User(info);
        console.log(user.name);
        user.save(function (err, self) {
            if(err){
                console.error(err);
            }
            console.log('saved');
        });
    };

    this.findAll = function () {
        User.findAll();
    };
}

module.exports = UserData;