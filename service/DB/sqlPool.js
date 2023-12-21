/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-21 09:12:37
 * @LastEditTime: 2023-12-21 09:15:36
 */
const mysql = require('mysql');//请求mysql

 function OptPool(){ 
     this.flag=true; //是否连接过 
     this.pool = mysql.createPool({     
         host: 'localhost',       //主机 
         user: 'root',               //MySQL认证用户名 
         password: 'root',        //MySQL认证用户密码 
         database: 'chat',              //数据库名称
         port: '3306'                   //端口号 
     }); 
  
     this.getPool=function(){ 
         return this.pool; 
     } 
 }; 
 module.exports = OptPool; 