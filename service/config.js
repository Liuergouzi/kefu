/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-21 14:27:48
 * @LastEditTime: 2023-12-21 16:36:24
 */
/**
 * 公共配置文件
 */
module.exports = {
    imageSaveLocal:false,                                               //图片是否保存在指定目录，false直接存储在数据库
    imageStaticDirectory:"./public",                                    //静态托管路径，即下面保存图片目录的上级目录
    imageSaveUrl: "/upload",                                            //图片保存路径，最终路径为："./public/upload"
    imageIp: "http://localhost:3030",                                   //图片保存到数据库路径前缀，获取太麻烦了,干脆自己手动填，最终路径为："http://localhost:3030/upload/xxx.png"
    
    host: 'localhost',                                                  //MySQL主机 
    user: 'root',                                                       //MySQL认证用户名 
    password: 'root',                                                   //MySQL认证用户密码 
    database: 'chat',                                                   //MySQL数据库名称
    port: '3306'                                                        //MySQL端口号 
}
