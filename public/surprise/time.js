/**
 * Created by ian0214 on 2017/10/2.
 */
function Time(yearId, monthId, dateId, hourId, minuteId, secondId, initTime) {
    var currentTime = new Date();
    var time = initTime || {
            year: currentTime.getFullYear(),
            month: currentTime.getMonth() + 1,
            date: currentTime.getDate(),
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            second: currentTime.getSeconds()
        }
    this.year = time.year;
    this.month = time.month;
    this.date = time.date;
    this.hour = time.hour;
    this.minute = time.minute;
    this.second = time.second;
    this.yearEle = $("#" + yearId);
    this.monthEle = $("#" + monthId);
    this.dateEle = $("#" + dateId);
    this.hourEle = $("#" + hourId);
    this.minuteEle = $("#" + minuteId);
    this.secondEle = $("#" + secondId);
    // if(yearId){
    //     this.yearModel = new Vue({
    //         el: '#'+yearId,
    //         data: {
    //             value: time.year
    //         }
    //     })
    // }
    //
    // if(monthId){
    //     this.monthModel = new Vue({
    //         el: '#'+monthId,
    //         data: {
    //             value: time.month
    //         }
    //     })
    // }
    //
    // if(dayId){
    //     this.dateModel = new Vue({
    //         el: '#'+dayId,
    //         data: {
    //             value: time.date
    //         }
    //     })
    // }
    //
    // if(hourId){
    //     this.hourModel = new Vue({
    //         el: '#'+hourId,
    //         data: {
    //             value: time.hour
    //         }
    //     })
    // }
    //
    // if(minuteId){
    //     this.minuteModel = new Vue({
    //         el: '#'+minuteId,
    //         data: {
    //             value: time.minute
    //         }
    //     })
    // }
    //
    // if(secondId){
    //     this.secondModel = new Vue({
    //         el: '#'+secondId,
    //         data: {
    //             value: time.second
    //         }
    //     })
    // }
}
Time.prototype.refresh = function () {
    this.yearEle.text(this.year);
    this.monthEle.text(this.month);
    this.dateEle.text(("0" + this.date).slice(-2));
    this.hourEle.text(("0" + this.hour).slice(-2));
    this.minuteEle.text(("0" + this.minute).slice(-2));
    this.secondEle.text(("0" + this.second).slice(-2));
};

Time.prototype.daysOfMonth = function (month) {
    var daysOfMonth = 30;
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
        daysOfMonth = 31;
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        daysOfMonth = 30;
    } else {
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
            daysOfMonth = 29;
        } else {
            daysOfMonth = 28;
        }
    }
    return daysOfMonth;
};

Time.prototype.add = function (time) {
    // var carry = 0;
    // var second = this.secondModel.value;
    // var minute = this.minuteModel.value;
    // var hour = this.hourModel.value;
    // var date = this.dateModel.value;
    // var month = this.monthModel.value;
    // var year = this.yearModel.value;

    var second = this.second;
    var minute = this.minute;
    var hour = this.hour;
    var date = this.date;
    var month = this.month;
    var year = this.year;

    second += time.second;
    var carry = second > 0 ? parseInt(second / 60, 10) : -1;
    second = second > 0 ? second % 60 : second + 60;

    minute += (time.minute + carry);
    carry = minute > 0 ? parseInt(minute / 60, 10) : -1;
    minute = minute > 0 ? minute % 60 : minute + 60;

    hour += (time.hour + carry);
    carry = hour > 0 ? parseInt(hour / 24, 10) : -1;
    hour = hour > 0 ? hour % 24 : hour + 24;

    date += (time.date + carry);

    var daysOfMonth = this.daysOfMonth(month);
    carry = date > 0 ? parseInt(date / (daysOfMonth + 1), 10) : -1;
    date = date > 0 ? date % (daysOfMonth + 1) : date + this.daysOfMonth(month-1>0?month-1:12);

    month += (time.month + carry);
    carry = month>0?parseInt(month / 13, 10):-1;
    month = month>0? month % 13:month+12;

    year += (time.year + carry);

    // this.yearModel.value = year;
    // this.monthModel.value = month;
    // this.dateModel.value = date;
    // this.hourModel.value = hour;
    // this.minuteModel.value = minute;
    // this.secondModel.value = second;
    this.year = year;
    this.month = month;
    this.date = date;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
};

Time.prototype.pass = function (velocity, stopAt, isForward, callback) {
    var self = this;
    var stopDate = new Date(stopAt.year, stopAt.month, stopAt.date, stopAt.hour, stopAt.minute, stopAt.second);
    var timerId = window.setInterval(function () {
        self.add({
            year: 0, month: 0, date: 0, hour: isForward ? 1 : -1, minute: isForward ? 1 : -1, second: isForward ? 1 : -1
        });

        var currentDate = new Date(self.year, self.month, self.date, self.hour, self.minute, self.second);
        if ((isForward && currentDate >= stopDate) || (!isForward && currentDate <= stopDate)) {
            window.clearInterval(timerId);
            console.log("interval stopped");
            self.year = stopAt.year;
            self.month = stopAt.month;
            self.date = stopAt.date;
            self.hour = stopAt.hour;
            self.minute = stopAt.minute;
            self.second = stopAt.second;
        }
        self.refresh();
        callback({
            year: self.year,
            month: self.month,
            date: self.date,
            hour: self.hour,
            minute: self.minute,
            second: self.second
        })
    }, 1000 / velocity)
}