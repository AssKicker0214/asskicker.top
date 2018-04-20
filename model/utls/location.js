let http = require('http');
const ak = "umx3dUsuAEQej37U8Zfpw5DTyczS2S47";

class Location{
    constructor(coor='gcj02'){
        this.coor = coor;
    }

    fromIP(ip, cb){
        http.get(`http://api.map.baidu.com/location/ip?ip=${ip}&ak=${ak}&coor=${this.coor}`, (req, res)=>{
            let jsonStr='';
            req.on('data',(data) => {
                jsonStr += data;
            });
            req.on('end',() => {
                let tmp = JSON.parse(jsonStr);
                let detail = tmp.content.address_detail;
                let point = tmp.content.point;
                let coor = this.coor;
                let addr = {
                    detail: detail,
                    point: point,
                    coor: coor
                };
                this.addr = addr;
                if(cb) cb(addr);
            });
        })
    }

    fromIP2(ip){
        return new Promise((resolve, reject)=>{
            http.get(`http://api.map.baidu.com/location/ip?ip=${ip}&ak=${ak}&coor=${this.coor}`, (req, res)=>{
                let jsonStr='';
                req.on('data',(data) => {
                    jsonStr += data;
                });
                req.on('end',() => {
                    let tmp = JSON.parse(jsonStr);
                    let detail = tmp.content.address_detail;
                    let point = tmp.content.point;
                    let coor = this.coor;
                    let addr = {
                        detail: detail,
                        point: point,
                        coor: coor
                    };
                    this.addr = addr;
                    resolve(addr);
                });
            });
        });
    }
}

// let l = new Location();
// l.fromIP2("221.6.40.153").then((addr)=>console.log(addr))
module.exports = Location;