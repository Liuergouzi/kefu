/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-25 09:04:54
 * @LastEditTime: 2024-01-03 09:57:53
 */
const jwt = require('jsonwebtoken')     //引入token依赖
const crypto = require('crypto')        //引入需要用到MD5的模块
const state = require("../language/i18n")  //引入全局返回状态
const md5 = crypto.createHash('md5')    //使用MD5
const nodeCache = require("../src/nodeCache");

let str = '潮州有一个怀揣着梦想的轮子哥相信在不断内卷中会创造出一个个惊艳绝伦的轮子';   //自定义签名字键
secret = md5.update(str).digest('hex')



/**
 * 生成token
 * @param {*} payload 需要生成token的数据对象,形式为：{}
 * @returns 返回生成的token
 */
function createToken(payload) {

    try {
        payload = JSON.parse(payload);
        payload.time = new Date().getTime() + 86400000 * 2.5;//设置过期时长两天半
        let token = jwt.sign(payload, secret);
        let returns = state.__("createTokenSuccess");
        returns.data = token;
        if(payload.serviceId){
            nodeCache.setCache(payload.serviceId, payload.serviceId)
        }
        return returns;
    } catch (e) {
        return state.__("createTokenError");
    }
}
//防止伪造，用户只能添加用户缓存
function createTokenUser(payload) {
    try {
        payload = JSON.parse(payload);
        payload.time = new Date().getTime() + 86400000 * 2.5;//设置过期时长两天半
        let token = jwt.sign(payload, secret);
        let returns = state.__("createTokenSuccess");
        returns.data = token;
        if(payload.userId){
            nodeCache.setCache(payload.userId, payload.userId)
        }
        return returns;
    } catch (e) {
        return state.__("createTokenError");
    }
}



/**
 * 校验token,
 * @param {*} token 需要校验的token，string类型
 * @returns 返回token校验结果
 */

function verificationToken(token) {
    try {
        let json = jwt.verify(token, secret)
        let flag=false
        let returns = state.__("verificationTokenSuccess");
        if(json.serviceId){
            flag=nodeCache.getCache(json.serviceId)
            returns.isService = true
        }
        if(json.userId){
            flag=nodeCache.getCache(json.userId)
            returns.isService = false
        }
        if (json.time > new Date().getTime() && flag ) {
            return returns;
        } else {
            return state.__("verificationTokenTimeOut");
        }
    } catch (err) {
        return state.__("decryptTokenError");
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
        let returns = state.__("decryptTokenSuccess");
        returns.data = json;
        return returns;
    } catch (err) {
        return state.__("decryptTokenError");
    }
}



//暴露方法
module.exports = {
    createToken,
    createTokenUser,
    decryptToken,
    verificationToken
}