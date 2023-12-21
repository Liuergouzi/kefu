/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-21 09:12:37
 * @LastEditTime: 2023-12-21 14:36:54
 */
const mysql = require('mysql');//请求mysql
const config = require("../config.js");

 function OptPool(){ 
     this.flag=true; //是否连接过 
     this.pool = mysql.createPool({     
         host: config.host,                 //主机 
         user: config.user,                 //MySQL认证用户名 
         password: config.password,         //MySQL认证用户密码 
         database: config.database,         //数据库名称
         port: config.port                  //端口号 
     }); 
  
     this.getPool=function(){ 
         return this.pool; 
     } 
 }; 
 module.exports = OptPool; 