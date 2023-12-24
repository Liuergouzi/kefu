const NodeRSA = require('node-rsa');    //引入rsa
const fs = require('fs');   //引入文件操作
const path = require("path");
const state = require("../../language/i18n")  //引入全局返回状态
// const { publicDecrypt } = require('crypto');

const privateKey = fs.readFileSync(path.join(__dirname, './private.pem'));   //读取私钥
const key = new NodeRSA(privateKey);
key.setOptions({ encryptionScheme: 'pkcs1' }); // node-rsa 跟jsecrypt 协议不一样



/**
 * 读取public.pem文件中的公钥
 * @returns 返回公钥
 */

function returnPublicKey() {
    publicKey = fs.readFileSync(path.join(__dirname, './public.pem'), 'utf8');
    let returns = state.__("returnPublicKeySuccess");
    returns.data = publicKey;
    return returns;
}



/**
 * 数据解密
 * @param {*} value string 单个值解密
 * @returns 解密后的数据
 */

function Decrypt(value) {
    try {
        let returns = state.__("decryptDataSuccess");
        returns.data=key.decrypt(value.toString(), 'utf8');
        return returns;
    } catch (e) {
        return state.__("illegalData");
    }
}


module.exports = {
    returnPublicKey,
    Decrypt
}
