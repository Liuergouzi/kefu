const mysql = require("./DB/mysql.js");      //引入mysql
const verification = require("./security/verification.js");  //引入数据校验
const token = require("./security/token.js");  //引入token
const RSA = require("./security/RSA/RSA.js");  //引入数据加解密
const statu = require("./statu.json");      //引入全局返回状态
const nowTime = require("./time.js");
const express = require('express');	// 引入express
const path = require("path");

const app = express();
app.use(express.json());	//中间件，解析表单中的 JSON 格式的数据
app.use(express.urlencoded({ extended: true }));	//解析 URL-encoded 格式的请求体数据

const http = require('http');
const server = http.Server(app);		// 用http模块创建一个服务并把express的实例挂载上去

const io = require('socket.io')(server, { cors: true });	// 引入socket.io并立即实例化，把server挂载上去

const cors = require("cors");
app.use(cors()); //使用cors中间件解决跨域问题
// //解决前端跨域问题
// app.all("*", function (req, res, next) {
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin", "*");
//     //允许的header类型
//     res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-type");
//     res.header("Access-Control-Allow-Credentials", true);
//     //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("Content-Type", "application/json;charset=utf-8")
//     if (req.method.toLowerCase() == 'options')
//         res.sendStatus(200);  //让options尝试请求快速结束
//     else
//         next();
// });



//记录所有加入的用户
let users = [];
//记录所有加入的客服
let services = [];

io.on('connection', socket => {

    //如果用户存在则传回用户数据，历史聊天记录，否则创建用户
    socket.on("visit", data => {
        //校验数据
        var newData = verification.newData(data)[0].data;
        if (newData) {
            mysql.selectUser(newData.userId).then((data) => {
                if (data) {
                    //传回用户数据
                    let returns = statu.filter((v) => v.type == "success");
                    returns[0].data = data;
                    socket.emit("visitReturn", returns);
                } else {
                    //进行用户注册
                    mysql.insertUser(newData);
                }
            });

        } else {
            //数据格式错误
            socket.emit("error", socket.emit("error", statu.filter((v) => v.type == "illegalData")))
        }

    })


    //返回公钥
    socket.on("getPublicKey", data => {
        socket.emit("returnPublicKey", RSA.returnPublicKey())
    })


    //客服端登录验证
    socket.on("serviceLogin", data => {
        //数据校验解密
        var Data = verification.newDataDecrypt(data);
        var newData = Data[0];
        if (newData.code) {

            mysql.serviceLogin(newData.data).then((data) => {
                if (data) {
                    //传回客服数据+token
                    let returns = statu.filter((v) => v.type == "success");
                    returns[0].token = token.createToken(data);
                    returns[0].data = data;
                    // console.log(returns[0].token)
                    socket.emit("loginReturn", returns);
                } else {
                    //登录失败
                    socket.emit("error", statu.filter((v) => v.type == "loginFalse"));
                }
            });

        } else {
            socket.emit("error", Data)
        }

    })



    //客服上线
    socket.on("serviceOnline", data => {
        //数据校验  
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            if (services.filter((v) => v.serviceId === data.serviceId).length == 0) {
                data.socketId = socket.id;
                data.userList = [];
                //存入列表
                services.push(data)
                socket.emit("success", statu.filter((v) => v.type == "OnlineSuccess"))
            } 
            // else {
            //     socket.emit("error", statu.filter((v) => v.type == "OnlineFalse"))
            // }
        } else {
            socket.emit("error", Data)
        }
    })

    //客服手动离线
    socket.on("serviceOffline", data => {
        if (services.length > 0 && services.filter(v => (v.socketId == socket.id)).length > 0) {
            //拿出离线的客服数据
            let service = services.filter(v => (v.socketId == socket.id))
            //获取跟客服连接的用户,全部通知客服下线
            for (var i = 0; i < service[0].userList.length; i++) {
                socket.to(service[0].userList[i].socketId).emit("Offline", statu.filter((v) => v.type == "Offline"))
            }
            //删除该客服
            services = services.filter(v => (v.socketId != socket.id))
            socket.emit("success", statu.filter((v) => v.type == "OfflineSuccess"))
        } else {
            socket.emit("error", statu.filter((v) => v.type == "OfflineFalse"))
        }
    })

    //客服踢出用户
    socket.on("closeSeesion", data => {
        try {
            for (var i = 0; i < services.length; i++) {
                if (services[i].socketId == socket.id) {
                    let socketId = services[i].userList.filter((v) => v.userId == data.data.userId)
                    services[i].userList = services[i].userList.filter((v) => v.userId != data.data.userId)
                    socket.to(socketId[0].socketId).emit("Offline", statu.filter((v) => v.type == "Offline"))
                }
            }
        } catch (e) {
            socket.emit("error", statu.filter((v) => v.type == "TooTast"))
        }
    })

    //用户转人工
    socket.on("toLabor", data => {
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            if (services.length > 0) {
                // let serviceTemp=services.filter((v) => v.serviceState == 0)
                // if(serviceTemp.length>0){
                //随机分配客服
                index = Math.floor(Math.random() * services.length);
                //改变客服状态
                services[index].serviceState = 1;
                services[index].serviceFrequency = services[index].serviceFrequency + 1;
                //返回用户通知
                let returns = statu.filter((v) => v.type == "joinSuccess");
                returns[0].data.serviceName = services[index].serviceName;
                returns[0].data.socketRoom = services[index].socketId;
                returns[0].data.receiveId = services[index].serviceId;
                socket.emit("linkServiceSuccess", returns);

                // }else{
                //     socket.emit("error", statu.filter((v) => v.type == "joinFalse"));
                // }
            } else {
                socket.emit("error", statu.filter((v) => v.type == "nullService"));
            }

        } else {
            socket.emit("error", Data);
        }
    })


    //让用户进入
    socket.on("userJoin", data => {
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            let socketRoom = data.socketRoom;
            let receiveId = data.userId;
            let serviceId ='';
            //把用户存入列表
            data.socketId = socket.id;
            users.push(data);
            //将用户存入客服列表
            for (var i = 0; i < services.length; i++) {
                if (services[i].socketId == socketRoom) {
                    services[i].userList.push(data);
                    serviceId=services[i].serviceId;
                }
            }
            //返回客服通知
            let user_returns = statu.filter((v) => v.type == "joinSuccess");
            let res = Object.assign({}, data)
            user_returns[0].data = res;
            user_returns[0].data.socketRoom = socket.id;
            user_returns[0].data.receiveId = receiveId;
            socket.to(socketRoom).emit("UserJoinSuccess", user_returns);

            mysql.updateServiceFrequency('666')

        } else {
            socket.emit("error", Data);
        }
    })

    //发送消息
    socket.on("sendMessage", data => {
        data.time = nowTime.getNowTime();
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            mysql.insertMessage(newData.data).then((sql_data) => {
                if (sql_data) {
                    //消息发送
                    let returns = statu.filter((v) => v.type == "success");
                    returns[0].data = data;
                    socket.to(data.socketRoom).emit("reviceMessage", returns)
                } else {
                    socket.emit("error", statu.filter((v) => v.type == "false"));
                }
            });
        } else {
            socket.emit("error", Data)
        }
    })

    socket.on("disconnect", () => {

        try {
            //用户离线
            if (users.length > 0) {
                //拿出离线的用户数据
                let user = users.filter(v => (v.socketId == socket.id))
                if (user.length > 0) {
                    //通知客服
                    let returns = statu.filter((v) => v.type == "Offline");
                    returns[0].data = { userId: user[0].userId };
                    socket.to(user[0].socketRoom).emit("Offline", returns)
                    //删除该用户
                    users = users.filter(v => (v.socketId != socket.id))
                }
            }
            //客服离线
            if (services.length > 0) {
                //拿出离线的客服数据
                let service = services.filter(v => (v.socketId == socket.id))
                if (service.length > 0) {
                    //获取跟客服连接的用户,全部通知客服下线
                    for (var i = 0; i < service[0].userList.length; i++) {
                        socket.to(service[0].userList[i].socketId).emit("Offline", statu.filter((v) => v.type == "Offline"))
                    }
                    //删除该客服
                    services = services.filter(v => (v.socketId != socket.id))
                }
            }

        } catch (e) {
            console.log("下标错误")
        }

    })


});

//token校验接口
app.post('/verificationToken', function (req, res) {
    res.json(token.verificationToken(req.body.token))
})


//修改名称接口
app.post('/updateServiceName', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.updateServiceName(newData.data.serviceName, newData.data.serviceId).then((sql_data) => {
            if (sql_data) {
                res.json(statu.filter((v) => v.type == "success"))
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})


//历史聊天记录查询
app.post('/selectMessage', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.selectMessage(newData.data.sendId, newData.data.receiveId).then((sql_data) => {
            if (sql_data) {
                let returns = statu.filter((v) => v.type == "success");
                returns[0].data = sql_data;
                res.json(returns)
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})

//提交留言
app.post('/commentInsert', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.commentInsert(newData.data).then((sql_data) => {
            if (sql_data) {
                res.json(statu.filter((v) => v.type == "success"))
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})

//查看自己留言
app.post('/commentSelectById', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.commentSelectById(newData.data.commentId).then((sql_data) => {
            if (sql_data) {
                let returns = statu.filter((v) => v.type == "success");
                returns[0].data = sql_data;
                res.json(returns)
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})

//查看最新10条留言
app.post('/commentSelect', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.commentSelect(newData.data.page).then((sql_data) => {
            if (sql_data) {
                let returns = statu.filter((v) => v.type == "success");
                returns[0].data = sql_data;
                res.json(returns)
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})

//客服回复
app.post('/commentReply', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.commentReply(newData.data).then((sql_data) => {
            if (sql_data) {
                res.json(statu.filter((v) => v.type == "success"))
            } else {
                res.json(statu.filter((v) => v.type == "false"))
            }
        });
    } else {
        res.json(statu.filter((v) => v.type == "dataFalse"))
    }
})

//端口启动
server.listen(3030, function () {
    console.log('【轮子哥】服务端启动成功,端口[3030]');
});