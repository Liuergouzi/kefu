const jwt = require('jsonwebtoken')     //引入token依赖
const crypto = require('crypto')        //引入需要用到MD5的模块
const statu = require("../statu.json")  //引入全局返回状态
const md5 = crypto.createHash('md5')    //使用MD5


let str = '潮州有一个怀揣着梦想的轮子哥相信在广应科的学习中会创造出一个个惊艳绝伦的轮子';   //自定义签名字键
secret = md5.update(str).digest('hex')



/**
 * 生成token
 * @param {*} payload 需要生成token的数据对象,形式为：{}
 * @returns 返回生成的token
 */
function createToken(payload) {

    try {
        payload=JSON.parse(payload);
        payload.time = new Date().getTime() + 86400000;//设置时效一天
        let token = jwt.sign(payload, secret);
        let returns=statu.filter((v) => v.type == "createTokenSuccess");
        returns[0].data=token;
        return returns;
    } catch (e) {
        // console.log("【轮子哥】生成token失败")
        return statu.filter((v) => v.type == "createTokenError");
    }

}



/**
 * 校验token,
 * 此方法不安全，仅做了时间验证，实际上需要将token放入缓存中，再跟缓存对比，或者将token解密后将值与数据库进行匹配
 * 这里考虑到此方法常调用，过多的安全验证势必会以丢失性能为代价，根据个人需求随缘来做吧，这里我就懒得去实现了，有时间再扩展完善
 * @param {*} token 需要校验的token，string类型
 * @returns 返回token校验结果
 */

function verificationToken(token) {
    try {
        let json = jwt.verify(token, secret)
        if (json.time > new Date().getTime()) {
            return statu.filter((v) => v.type == "verificationTokenSuccess");
        } else {
            return statu.filter((v) => v.type == "verificationTokenTimeOut");
        }
    } catch (err) {
        return statu.filter((v) => v.type == "decryptTokenError");
    }
}



/**
 * token
 * @param {*} token 需要解密的token，string类型
 * @returns 返回解密后的数据对象
 */

function decryptToken(token) {
    try {
        let json = jwt.verify(token, secret);
        let returns=statu.filter((v) => v.type == "decryptTokenSuccess");
        returns[0].data=json;
        return returns;
    } catch (err) {
        return statu.filter((v) => v.type == "decryptTokenError");
    }
}



//暴露方法
module.exports = {
    createToken,
    decryptToken,
    verificationToken
}