/**
 * Created by ian0214 on 2017/7/21.
 */

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
function connectDB(dbName, optionalMsg) {
    let db = mongoose.createConnection('localhost', dbName, 11195);
    db.on('error', console.error.bind(console, '连接错误:'));
    db.once("open", function () {
        console.info("db opened. optional msg: " + (optionalMsg !== undefined ? optionalMsg : "nothing"));
    });
    return db
}

module.exports = connectDB;