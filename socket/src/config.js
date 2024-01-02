/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-25 09:04:55
 * @LastEditTime: 2024-01-02 14:14:12
 */
/**
 * 公共配置文件
 */
module.exports = {
    environment: "build",                      //打包部署服务器的时候，请把environment换成build
    apiUrl: "http://localhost:3030",        //打包部署服务器的时候，请把apiUrl的localhost换成你的ip,如http://12.34.56.78:3030,不要使用localhost
    aesKey: "我们只生产轮子，不是轮子的搬运工",
    aesIv: "我家门前有两个轮子，一个是轮子，另一个也是轮子"
}
