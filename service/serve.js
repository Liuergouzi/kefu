/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-25 14:42:56
 * @LastEditTime: 2023-12-25 16:00:51
 */
const express = require('express');	// 引入express

const config = require("./config.js");
const app = express();
// app.use(express.json());	//中间件，解析表单中的 JSON 格式的数据
// app.use(express.urlencoded({ extended: true }));	//解析 URL-encoded 格式的请求体数据
const bodyParser = require('body-parser');  //请求体中间件,解析表单中的 JSON 格式的数据
app.use(bodyParser.json({limit:'3mb'}));  //设置请求最大大小
app.use(bodyParser.urlencoded({ limit:'3mb', extended: true })); //设置解析请求最大大小

app.use(express.static(config.imageStaticDirectory));//将静态资源托管
const state = require('./language/i18n'); //引入全局返回状态  
const verification = require("./security/verification.js");  //引入数据校验 


/**
 * 使用http协议 ，请注意使用https就将此段代码注释
 */
const http = require('http');
const server = http.Server(app);		// 用http模块创建一个服务并把express的实例挂载上去
const io = require('socket.io')(server, { cors: true });	// 引入socket.io并立即实例化，把server挂载上去
//端口启动
server.listen(3030, function () {
    console.log('【轮子哥】服务端启动成功,端口[3030]');
});


/**
 * 使用https，请注意使用https的话就将此段代码取消注释
 */
// const fs = require('fs');
// const options = {
//   key: fs.readFileSync('./ctrlc.cc.key'),
//   cert: fs.readFileSync('./ctrlc.cc.pem'),
// };
// var https = require('https').Server(options, app);
// var io = require('socket.io')(https,{cors:true});
// //端口启动
// https.listen(3030, function () {
//     console.log('【轮子哥】服务端启动成功,端口[3030]');
// });




const cors = require("cors");
app.use(cors()); //使用cors中间件解决跨域问题


//请求前拦截
const i18nMiddleware = (req, res, next) => {
    //设置语言 获取请求头
    const language = req.headers['accept-language']
    state.setLocale(language)
    //忽略不需要校验的接口
    if (config.ignorePath.includes(req.path)) {
        next()
    }
    if (req.method == 'POST') {
        const newDataPost = verification.newData(req.body);
        if (newDataPost.code) {
            req.body = newDataPost.data
            next()
        } else {
            res.json(state.__("dataFalse"))
        }
    }
    if (req.method == 'GET') {
        const newDataGet = verification.newData(req.query);
        if (newDataGet.code) {
            req.query = newDataGet.data
            next()
        } else {
            res.json(state.__("dataFalse"))
        }
    }
}
app.use(i18nMiddleware)
//socket设置语言
io.use((socket, next) => {
    // 获取请求头
    const language = socket.request.headers['accept-language']
    state.setLocale(language)
    next()
})


const socket = require("./src/socket")
const socketClass = new socket(io)
socketClass.getSocket()

const controller = require("./src/controller")
new controller(app).getApi(socketClass)