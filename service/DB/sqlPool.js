const mysql = require('mysql');//请求mysql

 function OptPool(){ 
     this.flag=true; //是否连接过 
     this.pool = mysql.createPool({     
         host: 'localhost',       //主机 
         user: 'root',               //MySQL认证用户名 
         password: 'xxxxxxxxx',        //MySQL认证用户密码 
         database: 'chat',              //数据库名称
         port: '3306'                   //端口号 
     }); 
  
     this.getPool=function(){ 
         return this.pool; 
     } 
 }; 
 module.exports = OptPool; 