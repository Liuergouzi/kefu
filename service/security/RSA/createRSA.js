//生成公钥私钥存文档，给之后加密解密使用
//命令窗口cd到此目录，node createRSA独立运行
const NodeRSA = require('node-rsa');
let key = new NodeRSA({b:1024});
var publicDer = key.exportKey('public');
var privateDer = key.exportKey('private');
console.log('公钥:',publicDer);
console.log('私钥:',privateDer);
