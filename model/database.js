/**
 * Created by ian0214 on 2017/7/21.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
function connectDB(dbName) {
    var db = mongoose.createConnection('localhost', dbName, 27017);
    db.on('error', console.error.bind(console,'连接错误:'));
    db.once("open", function () {
        console.info("db opened");
    });
    return db
}

module.exports = connectDB;