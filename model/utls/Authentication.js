/**
 * Created by ian0214 on 17/12/10.
 */
let md5 = require('md5');
let fs = require('fs');
let path = require('path');
// let IP = require('IPUtility');
class Authentication{

    constructor(){
        this.passwd = fs.readFileSync(''+path.join(__dirname, "password"), 'utf-8');
        console.log("### load password file"+path.join(__dirname, "password"));
        this.blockList = {};
        this.token = null;
        this.authIp = null;
    }

    login(pswd, ip){
        if(this.blockList[ip] > 3){
            console.log(`IP ${ip} 尝试登陆的次数过多：${++this.blockList[ip]}次，已拒绝更多的登录尝试`);
            return {result: false, reason: 'locked', tried: this.blockList[ip]};
        }

        if(md5(pswd) === this.passwd){
            // 登陆成功
            if(this.blockList[ip]){
                this.blockList[ip] = 0;
            }
            return {result: true}
        }else{
            // 拒绝登录
            if(this.blockList[ip]){
                this.blockList[ip] ++;
            }else{
                this.blockList[ip] = 1;
            }
            return {result: false, reason: 'wrong', tried: this.blockList[ip]};
        }
    }

    createToken(ip){
        let token = md5(this.passwd+"令牌"+ip+new Date().getTime());
        this.authIp = ip;
        this.token = token;
        return token;
    }

    authCheck(token, ip){
        return !!(token && token === this.token && ip === this.authIp);
    }
}

module.exports = new Authentication();