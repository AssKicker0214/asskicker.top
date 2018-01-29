/**
 * Created by ian0214 on 2017/8/8.
 */
class TimeUtl{
    // static unitEn = [];
    // static unitCn = ['年', '月', '日', '时', '分', '秒'];
    constructor(){
        this.currentTime = new Date();
    }

    static formatDate(splitter, timeStamp){
        let s = splitter || "/";
        let date = new Date(timeStamp);
        console.log(timeStamp);
        console.log(date.toTimeString());
        return `${date.getFullYear()}${s}${date.getMonth()+1}${s}${date.getDate()}`;
    }

    getCurrentTimeJson(){
        return {
            year: this.currentTime.getFullYear(),
            month: this.currentTime.getMonth(),
            date: this.currentTime.getDate(),

            hour: this.currentTime.getHours(),
            minute: this.currentTime.getMinutes(),
            second: this.currentTime.getSeconds()
        }
    }

    getCurrentTimeStamp(){
        return this.currentTime.getTime();
    }

    getCurrentTimeString(){
        return this.currentTime.toTimeString();
    }

    dayToNow(timeJson){
        let ms = this.currentTime - new Date(timeJson.year, timeJson.month, timeJson.date, timeJson.hour, timeJson.minute, timeJson.second);
        let s = ms/1000;
        let min = s/60;
        if(min < 1){
            return {value : '', unit: '刚刚'};
        }
        let hour = min/60;
        if(hour < 1){
            return {value: Math.round(min), unit: '分钟前'};
        }
        let day = hour/24;
        if(day < 1){
            return {value: Math.round(hour), unit: '小时前'};
        }
        let month = day/30;
        if(month < 1){
            return {value: Math.round(day), unit:'天前'};
        }
        let year = month/12;
        if(year < 1){
            return {value: Math.round(month), unit:'个月前'}
        }

        return {value: Math.round(year), unit:'年前'};
    }
}

// test
// let time1 = new TimeUtl();
// setTimeout(function () {
//     let time2 = new TimeUtl();
//     let ago = time2.dayToNow(time1.getCurrentTimeJson());
//     console.log(ago);
// }, 5000);
module.exports = TimeUtl;