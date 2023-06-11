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
//记录排队等待的用户
let waitUsers = [];

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

            //如果此客服有排队咨询的用户，全部通知全部排队的用户客服已离线，并删除排队用户
            let waitUserTemp = waitUsers.filter((v) => v.serviceSocketId == socket.id)
            if (waitUserTemp.length > 0) {
                waitUserTemp.forEach(element => {
                    socket.to(element.userSocketId).emit("WaitServiceOffline", statu.filter((v) => v.type == "WaitServiceOffline"))
                });
                waitUsers = waitUsers.filter((v) => v.serviceSocketId != socket.id)
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
            //通知用户
            for (var i = 0; i < services.length; i++) {
                if (services[i].socketId == socket.id) {
                    let socketId = services[i].userList.filter((v) => v.userId == data.data.userId)
                    services[i].userList = services[i].userList.filter((v) => v.userId != data.data.userId)
                    // users = users.filter(v => (v.socketId != data.data.userId))
                    socket.to(socketId[0].socketId).emit("Offline", statu.filter((v) => v.type == "KickOut"))
                }
            }
        } catch (e) {
            socket.emit("error", statu.filter((v) => v.type == "TooTast"))
        }
    })

    //客服同意排队用户进入
    // socket.on("agreeWait", data => {
    //     let waitUserTemp = waitUsers.filter((v) => v.userSocketId == data.data.userSocketId)
    //     if (waitUserTemp.length > 0) {
    //         socket.to(waitUserTemp[0].userSocketId).emit("WaitSuccess")
    //     }
    // })

    //用户转人工
    socket.on("toLabor", data => {
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            if (services.length > 0) {
                //随机分配客服
                index = Math.floor(Math.random() * services.length);
                //判断是否超出最大同时可接待人数
                if (services[index].serviceState < services[index].serviceMax) {
                    //防止同个用户同个浏览器多开窗口连接到同一个客服
                    let userList = services[index].userList.filter((v) => v.userId == data.userId)
                    if (userList.length == 0) {
                        //改变客服接待人数状态和接待次数
                        services[index].serviceState = services[index].serviceState + 1;
                        services[index].serviceFrequency = services[index].serviceFrequency + 1;
                        //返回用户通知
                        let returns = statu.filter((v) => v.type == "joinSuccess");
                        returns[0].data.serviceName = services[index].serviceName;
                        returns[0].data.socketRoom = services[index].socketId;
                        returns[0].data.receiveId = services[index].serviceId;
                        socket.emit("linkServiceSuccess", returns);
                    } else {
                        //让另一个窗口下线
                        socket.to(userList[0].socketId).emit("Offline", statu.filter((v) => v.type == "DuplicateConnection"))
                    }
                } else if (waitUsers.filter((v) => v.userSocketId == socket.id).length == 0) {
                    //客服最大连接人数已满，返回通知用户进行排队
                    services[index].serviceState = services[index].serviceState + 1;
                    let returns = statu.filter((v) => v.type == "ServiceFull");
                    returns[0].data.waitCount = services[index].serviceState - services[index].serviceMax;
                    returns[0].data.serviceName = services[index].serviceName;
                    returns[0].data.socketRoom = services[index].socketId;
                    returns[0].data.receiveId = services[index].serviceId;
                    socket.emit("ServiceFull", returns);
                    //把等待的用户的socketId存进来
                    let waitUserTemp = { serviceSocketId: services[index].socketId, userSocketId: socket.id }
                    waitUsers.push(waitUserTemp)
                }

            } else {
                socket.emit("error", statu.filter((v) => v.type == "nullService"));
            }

        } else {
            socket.emit("error", Data);
        }
    })

    //删除排队的用户
    socket.on("waitCancel", data => {
        const waitUserTemp = waitUsers.filter((v) => v.userSocketId == socket.id)
        const waitUserTempIndex = waitUsers.findIndex((v) => v.userSocketId == socket.id)
        if (waitUserTemp.length > 0) {
            //客服状态-1
            const serviceIndex = services.findIndex((v) => v.socketId == waitUserTemp[0].serviceSocketId)
            if (serviceIndex >= 0) {
                if (waitUserTempIndex >= 0) {
                    //通知排在后面的用户排队次序-1
                    let waitUserTemp2 = waitUsers.filter((v) => v.serviceSocketId == services[serviceIndex].socketId).slice(waitUserTempIndex,)
                    if (waitUserTemp2.length > 0) {
                        waitUserTemp2.forEach(element => {
                            socket.to(element.userSocketId).emit("WaitCountState")
                        });
                    }
                }
                services[serviceIndex].serviceState = services[serviceIndex].serviceState - 1
                //删除等待用户
                waitUsers = waitUsers.filter((v) => v.userSocketId != socket.id)
            }
        }
    })

    //让用户进入
    socket.on("userJoin", data => {
        var Data = verification.newData(data);
        var newData = Data[0];
        if (newData.code) {
            let socketRoom = data.socketRoom;
            let receiveId = data.userId;
            data.socketId = socket.id;
            //将用户存入客服列表
            for (var i = 0; i < services.length; i++) {
                if (services[i].socketId == socketRoom) {
                    //把用户存入列表
                    users.push(data);
                    //存入客服的用户列表
                    services[i].userList.push(data);
                }
            }
            //返回客服通知
            let user_returns = statu.filter((v) => v.type == "joinSuccess");
            let res = Object.assign({}, data)
            user_returns[0].data = res;
            user_returns[0].data.socketRoom = socket.id;
            user_returns[0].data.receiveId = receiveId;
            socket.to(socketRoom).emit("UserJoinSuccess", user_returns);
            mysql.updateServiceFrequency(data.receiveId)
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


    //离线处理
    socket.on("disconnect", () => {
        try {

            //连接客服时用户刷新或意外离线
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
                    //删除客服列表里的用户
                    for (var i = 0; i < services.length; i++) {
                        if (services[i].socketId == user[0].socketRoom) {
                            services[i].userList = services[i].userList.filter((v) => (v.userId != user[0].userId))
                        }
                    }
                    //假如连接客服时被踢了，或主动离开
                    const serviceIndex = services.findIndex((v) => v.socketId == user[0].socketRoom)
                    if (services.length > 0 && serviceIndex >= 0) {
                        //客服在线状态（连接人数减-1）
                        services[serviceIndex].serviceState = services[serviceIndex].serviceState - 1
                        //如果此客服有排队咨询的用户，进行通知排队次序减-1
                        let waitUserTemp = waitUsers.filter((v) => v.serviceSocketId == services[serviceIndex].socketId)
                        if (waitUserTemp.length > 0) {
                            waitUserTemp.forEach(element => {
                                socket.to(element.userSocketId).emit("WaitCountState")
                            });
                        }
                    }
                }
            }

            //假如用户排队时刷新或意外离线了
            const waitUserTemp = waitUsers.filter((v) => v.userSocketId == socket.id)
            if (waitUserTemp.length > 0) {
                const waitUserTempIndex = waitUsers.findIndex((v) => v.userSocketId == socket.id)
                const serviceIndex = services.findIndex((v) => v.socketId == waitUserTemp[0].serviceSocketId)
                if (serviceIndex >= 0 && waitUserTempIndex >= 0) {
                    //通知排在后面的用户排队次序-1
                    services[serviceIndex].serviceState = services[serviceIndex].serviceState - 1
                    let waitUserTemp2 = waitUsers.filter((v) => v.serviceSocketId == services[serviceIndex].socketId).slice(waitUserTempIndex,)
                    if (waitUserTemp2.length > 0) {
                        waitUserTemp2.forEach(element => {
                            socket.to(element.userSocketId).emit("WaitCountState")
                        });
                    }
                    //删除等待用户
                    waitUsers = waitUsers.filter((v) => v.userSocketId != socket.id)
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
                    //如果此客服有排队咨询的用户，全部通知全部排队的用户客服已离线，并删除排队用户
                    let waitUserTemp = waitUsers.filter((v) => v.serviceSocketId == socket.id)
                    if (waitUserTemp.length > 0) {
                        waitUserTemp.forEach(element => {
                            socket.to(element.userSocketId).emit("WaitServiceOffline", statu.filter((v) => v.type == "WaitServiceOffline"))
                        });
                        waitUsers = waitUsers.filter((v) => v.serviceSocketId != socket.id)
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


//修改最大接待次数接口
app.post('/updateServiceMax', function (req, res) {
    var Data = verification.newData(req.body);
    var newData = Data[0];
    if (newData.code) {
        mysql.updateServiceMax(Number(newData.data.serviceMax), newData.data.serviceId).then((sql_data) => {
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