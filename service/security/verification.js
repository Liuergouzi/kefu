const mysql = require('mysql');      //请求mysql
const xss = require('xss');      //引入xss防止xss攻击
const RSA = require("./RSA/RSA.js");     //引入数据加解密
const state = require("../i18n");      //引入全局返回状态



/**
 * 传递数据校验，mysql.js中使用了mysql.escape语法，前端传递过来的值必须经过此方法处理，否则mysql方法体中将一概返回false并打印【SQL语法错误】
 * mysql.escape()防止sql注入
 * xss()防止xss攻击
 * @param {*} json 传递的Json数据,形式为：{}
 * @returns 返回经过处理后的Json数据
 */

function newData(json) {

    try {
        //判断是否为json
        if (typeof (json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length) {
            var newJson = {};
            var keys = Object.keys(json);
            var values = Object.values(json);
            for (var i = 0; i < keys.length; i++) {
                newJson[keys[i]] = xss(mysql.escape(values[i]));
            }
            let returns = state.__("dataVerificationSuccess");
            returns.data = newJson;
            return returns;
        } else {
            return state.__("dataFalse");
        }
    } catch (e) {
        return state.__("illegalData");
    }

}





/**
 * 此方法在上面的方法中增加了解密
 * @param {*} json 传递的Json数据，形式为：{}
 * @returns 返回经过处理后的Json数据
 */

function newDataDecrypt(json) {

    try {
        //判断是否为json
        if (typeof (json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length) {
            var newJson = {};
            var keys = Object.keys(json);
            var values = Object.values(json);
            for (var i = 0; i < keys.length; i++) {
                newJson[keys[i]] = xss(mysql.escape(RSA.Decrypt(values[i]).data));
            }
            let returns = state.__("dataVerificationDecryptSuccess");
            returns.data = newJson;
            return returns;
        } else {
            return state.__("dataFalse");
        }
    } catch (e) {
        return state.__("illegalData");
    }

}



//暴露方法
module.exports = {
    newData,
    newDataDecrypt
}