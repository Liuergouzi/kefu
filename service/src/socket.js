const UAParser = require('ua-parser-js');
const fs = require("fs");  //文件写入
const getIpArea = require("../utils/getIpArea")  //引入获取ip和地区工具
const mysql = require("../DB/mysql.js");      //引入mysql
const verification = require("../security/verification.js");  //引入数据校验
const token = require("../security/token.js");  //引入token
const RSA = require("../security/RSA/RSA.js");  //引入数据加解密
const state = require('../language/i18n'); //引入全局返回状态     
const nowTime = require("../utils/time.js");
const config = require("../config.js");

module.exports = class controller {

    constructor(io) {
        this.io = io;
        this.services = [];//记录所有加入的客服
        this.users = [];//记录所有加入的用户
        this.waitUsers = []//记录排队等待的用户
    }
    getServices() {
        return this.services
    }

    getSocket() {
        this.io.on('connection', socket => {

            //如果用户存在则传回用户数据，历史聊天记录，否则创建用户
            socket.on("visit", datas => {

                const clientIp = socket.handshake.address;
                const userAgent = socket.handshake.headers['user-agent'];
                const parser = new UAParser();
                parser.setUA(userAgent);
                datas.ip = clientIp.split(":").pop()
                datas.area = getIpArea.getArea(clientIp)
                datas.device = parser.getResult().os.name
                if (parser.getResult().device.model != undefined) {
                    datas.device = parser.getResult().os.name + '-' + parser.getResult().device.model
                }
                //校验数据
                var newData = verification.newData(datas).data;

                if (newData) {
                    mysql.selectUser(newData.userId).then((data) => {
                        if (data) {
                            //更新用户
                            mysql.updateUser(newData, JSON.parse(data).id);
                            //传回用户数据
                            let returns = state.__("success");
                            returns.data = data;
                            returns.token = token.createTokenUser(data);
                            socket.emit("visitReturn", returns);
                            delete returns.token;
                        } else {
                            //进行用户注册
                            mysql.insertUser(newData);
                            let returns = state.__("success");
                            returns.data = datas;
                            returns.token = token.createTokenUser(data);
                            socket.emit("visitInsertReturn", returns);
                            delete returns.token;
                        }
                    });

                } else {
                    //数据格式错误
                    socket.emit("error", socket.emit("error", state.__("illegalData")))
                }

            })


            //返回公钥
            socket.on("getPublicKey", data => {
                socket.emit("returnPublicKey", RSA.returnPublicKey())
            })


            //客服端登录验证
            socket.on("serviceLogin", data => {
                //数据校验解密
                var newData = verification.newDataDecrypt(data);
                if (newData.code) {

                    mysql.serviceLogin(newData.data).then((data) => {
                        if (data) {
                            //传回客服数据+token
                            let returns = state.__("success");
                            returns.token = token.createToken(data);
                            returns.data = data;
                            socket.emit("loginReturn", returns);
                            delete returns.token;
                        } else {
                            //登录失败
                            socket.emit("error", state.__("loginFalse"));
                        }
                    });

                } else {
                    socket.emit("error", newData)
                }

            })



            //客服上线
            socket.on("serviceOnline", data => {
                //数据校验  
                var newData = verification.newData(data);
                if (newData.code) {
                    if (this.services.filter((v) => v.serviceId === data.serviceId).length == 0) {
                        data.socketId = socket.id;
                        data.userList = [];
                        //存入列表
                        this.services.push(data)
                        socket.emit("success", state.__("OnlineSuccess"))
                    }
                    // else {
                    //     socket.emit("error", state.__("OnlineFalse"))
                    // }
                } else {
                    socket.emit("error", newData)
                }
            })

            //客服手动离线
            socket.on("serviceOffline", data => {

                if (this.services.length > 0 && this.services.filter(v => (v.socketId == socket.id)).length > 0) {
                    //拿出离线的客服数据
                    let service = this.services.filter(v => (v.socketId == socket.id))
                    //获取跟客服连接的用户,全部通知客服下线
                    for (var i = 0; i < service[0].userList.length; i++) {
                        socket.to(service[0].userList[i].socketId).emit("Offline", state.__("Offline"))
                    }

                    //如果此客服有排队咨询的用户，全部通知全部排队的用户客服已离线，并删除排队用户
                    let waitUserTemp = this.waitUsers.filter((v) => v.serviceSocketId == socket.id)
                    if (waitUserTemp.length > 0) {
                        waitUserTemp.forEach(element => {
                            socket.to(element.userSocketId).emit("WaitServiceOffline", state.__("WaitServiceOffline"))
                        });
                        this.waitUsers = this.waitUsers.filter((v) => v.serviceSocketId != socket.id)
                    }
                    //删除该客服
                    this.services = this.services.filter(v => (v.socketId != socket.id))
                    socket.emit("success", state.__("OfflineSuccess"))
                } else {
                    socket.emit("error", state.__("OfflineFalse"))
                }
            })

            //客服踢出用户
            socket.on("closeSeesion", data => {

                try {
                    //通知用户
                    for (var i = 0; i < this.services.length; i++) {
                        if (this.services[i].socketId == socket.id) {
                            let socketId = this.services[i].userList.filter((v) => v.userId == data.data.userId)
                            this.services[i].userList = this.services[i].userList.filter((v) => v.userId != data.data.userId)
                            socket.to(socketId[0].socketId).emit("Offline", state.__("KickOut"))
                        }
                    }
                } catch (e) {
                    socket.emit("error", state.__("TooTast"))
                }
            })

            //客服同意排队用户进入
            // socket.on("agreeWait", data => {
            //     let waitUserTemp = this.waitUsers.filter((v) => v.userSocketId == data.data.userSocketId)
            //     if (waitUserTemp.length > 0) {
            //         socket.to(waitUserTemp[0].userSocketId).emit("WaitSuccess")
            //     }
            // })

            //用户转人工
            socket.on("toLabor", data => {

                var newData = verification.newData(data);
                if (newData.code) {
                    if (this.services.length > 0) {
                        //随机分配客服
                        let index = Math.floor(Math.random() * this.services.length);
                        //判断是否超出最大同时可接待人数
                        if (this.services[index].userList.length < this.services[index].serviceMax) {
                            //防止同个用户同个浏览器多开窗口连接到同一个客服
                            let userList = this.services[index].userList.filter((v) => v.userId == data.userId)
                            if (userList.length == 0) {
                                //改变客服接待次数
                                this.services[index].serviceFrequency = this.services[index].serviceFrequency + 1;
                                //返回用户通知
                                let returns = state.__("joinSuccess");
                                returns.data.serviceName = this.services[index].serviceName;
                                returns.data.serviceHead = this.services[index].serviceHead;
                                returns.data.socketRoom = this.services[index].socketId;
                                returns.data.receiveId = this.services[index].serviceId;
                                socket.emit("linkServiceSuccess", returns);
                            } else {
                                //让另一个窗口下线
                                socket.to(userList[0].socketId).emit("Offline", state.__("DuplicateConnection"))
                            }
                        } else if (this.waitUsers.filter((v) => v.userSocketId == socket.id).length == 0) {
                            //把等待的用户的socketId存进来
                            let waitUserTemp = { serviceSocketId: this.services[index].socketId, userSocketId: socket.id }
                            this.waitUsers.push(waitUserTemp)
                            //客服最大连接人数已满，返回通知用户进行排队
                            let returns = state.__("ServiceFull");
                            returns.data.waitCount = this.waitUsers.length;
                            returns.data.serviceName = this.services[index].serviceName;
                            returns.data.socketRoom = this.services[index].socketId;
                            returns.data.receiveId = this.services[index].serviceId;
                            socket.emit("ServiceFull", returns);
                        }

                    } else {
                        socket.emit("error", state.__("nullService"));
                    }

                } else {
                    socket.emit("error", newData);
                }
            })

            //用户指定连接某个客服
            socket.on("specifyConnection", data => {
                var newData = verification.newData(data);
                if (newData.code) {
                    let index = this.services.findIndex(v => v.serviceId === data.serviceId);
                    //客服在线
                    if (index >= 0) {
                        //判断是否超出最大同时可接待人数
                        if (this.services[index].userList.length < this.services[index].serviceMax) {
                            //防止同个用户同个浏览器多开窗口连接到同一个客服
                            let userList = this.services[index].userList.filter((v) => v.userId == data.userId)
                            if (userList.length == 0) {
                                //改变客服接待次数
                                this.services[index].serviceFrequency = this.services[index].serviceFrequency + 1;
                                //返回用户通知
                                let returns = state.__("joinSuccess");
                                returns.data.serviceName = this.services[index].serviceName;
                                returns.data.serviceHead = this.services[index].serviceHead;
                                returns.data.socketRoom = this.services[index].socketId;
                                returns.data.receiveId = this.services[index].serviceId;
                                socket.emit("linkServiceSuccess", returns);
                            } else {
                                //让另一个窗口下线
                                socket.to(userList[0].socketId).emit("Offline", state.__("DuplicateConnection"))
                            }
                        } else if (this.waitUsers.filter((v) => v.userSocketId == socket.id).length == 0) {
                            //把等待的用户的socketId存进来
                            let waitUserTemp = { serviceSocketId: this.services[index].socketId, userSocketId: socket.id }
                            this.waitUsers.push(waitUserTemp)
                            //客服最大连接人数已满，返回通知用户进行排队
                            let returns = state.__("ServiceFull");
                            returns.data.waitCount = this.waitUsers.length;
                            returns.data.serviceName = this.services[index].serviceName;
                            returns.data.socketRoom = this.services[index].socketId;
                            returns.data.receiveId = this.services[index].serviceId;
                            socket.emit("ServiceFull", returns);
                        }
                    }
                    //客服不在线,返回标识，让用户进入离线会话
                    if (index < 0) {
                        let returns = state.__("nullSpecifyService");
                        returns.data.serviceName = data.serviceName;
                        returns.data.receiveId = data.serviceId;
                        returns.data.serviceHead = data.serviceHead
                        socket.emit("nullSpecifyService", state.__("nullSpecifyService"));
                    }
                } else {
                    socket.emit("error", newData);
                }
            })

            //取消排队
            socket.on("waitCancel", data => {

                const waitUserTemp = this.waitUsers.filter((v) => v.userSocketId == socket.id)
                const waitUserTempIndex = this.waitUsers.findIndex((v) => v.userSocketId == socket.id)
                if (waitUserTemp.length > 0) {
                    const serviceIndex = this.services.findIndex((v) => v.socketId == waitUserTemp[0].serviceSocketId)
                    if (serviceIndex >= 0) {
                        if (waitUserTempIndex >= 0) {
                            //通知排在后面的用户排队次序-1
                            let waitUserTemp2 = this.waitUsers.filter((v) => v.serviceSocketId == this.services[serviceIndex].socketId).slice(waitUserTempIndex,)
                            if (waitUserTemp2.length > 0) {
                                waitUserTemp2.forEach(element => {
                                    socket.to(element.userSocketId).emit("WaitCountState")
                                });
                            }
                        }
                        //删除等待用户
                        this.waitUsers = this.waitUsers.filter((v) => v.userSocketId != socket.id)
                    }
                }
            })

            //排队成功时删除掉排队的用户
            socket.on("waitSuccess", data => {

                const waitUserTemp = this.waitUsers.filter((v) => v.userSocketId == socket.id)
                if (waitUserTemp.length > 0) {
                    const serviceIndex = this.services.findIndex((v) => v.socketId == waitUserTemp[0].serviceSocketId)
                    if (serviceIndex >= 0) {
                        //删除等待用户
                        this.waitUsers = this.waitUsers.filter((v) => v.userSocketId != socket.id)
                    }
                }
            })

            //客服修改名称
            socket.on("updateServiceName", data => {
                var newData = verification.newData(data);
                if (newData.code) {
                    const index = this.services.findIndex((v) => v.serviceId === data.serviceId)
                    if (index < 0) return
                    this.services[index].serviceName=data.serviceName
                }
            })

            //客服修改最大接待次数
            socket.on("updateServiceMax", data => {
                var newData = verification.newData(data);
                if (newData.code) {
                    const index = this.services.findIndex((v) => v.serviceId === data.serviceId)
                    if (index < 0) return
                    this.services[index].serviceMax=data.serviceMax
                }
            })

            //让用户进入
            socket.on("userJoin", data => {

                var newData = verification.newData(data);
                if (newData.code) {
                    let socketRoom = data.socketRoom;
                    let receiveId = data.userId;
                    data.socketId = socket.id;
                    //将用户存入客服列表
                    for (var i = 0; i < this.services.length; i++) {
                        if (this.services[i].socketId == socketRoom) {
                            //把用户存入列表
                            this.users.push(data);
                            //存入客服的用户列表
                            this.services[i].userList.push(data);
                        }
                    }
                    //返回客服通知
                    let user_returns = state.__("joinSuccess");
                    let res = Object.assign({}, data)
                    user_returns.data = res;
                    user_returns.data.socketRoom = socket.id;
                    user_returns.data.receiveId = receiveId;
                    socket.to(socketRoom).emit("UserJoinSuccess", user_returns);
                    mysql.updateServiceFrequency(data.receiveId)
                } else {
                    socket.emit("error", newData);
                }
            })

            //发送消息
            socket.on("sendMessage", data => {

                if (data.sendType == 2 && config.imageSaveLocal || data.sendType == 3 && config.imageSaveLocal) {
                    try {
                        //过滤data:URL
                        let base64Data = data.message.replace(/^data:image\/\w+;base64,/, "");
                        let dataBuffer = new Buffer.from(base64Data, 'base64');
                        if (base64Data.length / 4 * 3 > 1024 * 1024 * 3) {
                            socket.emit("error", "图片不能超过3m")
                            return
                        }
                        // 存储文件命名是使用当前时间，防止文件重名
                        let saveUrl = config.imageSaveUrl + '/' + (new Date()).getTime() + "0" + Math.floor(Math.random() * 100) + ".png";
                        fs.writeFileSync(config.imageStaticDirectory + saveUrl, dataBuffer);
                        data.message = config.imageIp + saveUrl
                    } catch (err) {
                        console.log('【文件保存错误】', err);
                    }
                }

                data.time = nowTime.getNowTime();
                var newData = verification.newData(data);
                if (newData.code) {
                    mysql.insertMessage(newData.data).then((sql_data) => {
                        if (sql_data) {
                            //消息发送
                            let returns = state.__("success");
                            returns.data = data;
                            returns.data.messageId = sql_data
                            socket.to(data.socketRoom).emit("reviceMessage", returns)
                            let returnsId = state.__("success");
                            returnsId.data = { id: sql_data }
                            socket.emit("sendMessageid", returnsId)
                        } else {
                            socket.emit("error", state.__("false"));
                        }
                    });
                } else {
                    socket.emit("error", newData)
                }
            })

            //撤回消息
            socket.on("retractMessage", data => {
                var newData = verification.newData(data);
                if (newData.code) {
                    mysql.retractMessage(newData.data.messageId).then((sql_data) => {
                        if (sql_data) {
                            let returns = state.__("OtherRetract")
                            returns.data = data;
                            socket.to(data.socketRoom).emit("otherRetract", returns)
                            //返回撤回成功
                            socket.emit("retractSuccess", state.__("RetractSuccess"))
                        } else {
                            socket.emit("error", state.__("false"));
                        }
                    });
                } else {
                    socket.emit("error", newData)
                }
            })

            //离线处理
            socket.on("disconnect", () => {
                try {

                    //连接客服时用户刷新或意外离线
                    if (this.users.length > 0) {
                        //拿出离线的用户数据
                        let user = this.users.filter(v => (v.socketId == socket.id))

                        if (user.length > 0) {
                            //设置更新离线列表
                            let insertData = user[0]
                            insertData.updateTime = nowTime.getNowTime()
                            mysql.insertChatList(verification.newData(user[0]).data)
                            //通知客服
                            let returns = state.__("Offline");
                            returns.data = { userId: user[0].userId };
                            socket.to(user[0].socketRoom).emit("Offline", returns)
                            //删除该用户
                            this.users = this.users.filter(v => (v.socketId != socket.id))
                            //删除客服列表里的用户
                            for (var i = 0; i < this.services.length; i++) {
                                if (this.services[i].socketId == user[0].socketRoom) {
                                    this.services[i].userList = this.services[i].userList.filter((v) => (v.userId != user[0].userId))
                                }
                            }
                            //假如连接客服时被踢了，或主动离开
                            const serviceIndex = this.services.findIndex((v) => v.socketId == user[0].socketRoom)
                            if (this.services.length > 0 && serviceIndex >= 0) {
                                //如果此客服有排队咨询的用户，进行通知排队次序减-1
                                let waitUserTemp = this.waitUsers.filter((v) => v.serviceSocketId == this.services[serviceIndex].socketId)
                                if (waitUserTemp.length > 0) {
                                    waitUserTemp.forEach(element => {
                                        socket.to(element.userSocketId).emit("WaitCountState")
                                    });
                                }
                            }
                        }
                    }

                    //假如用户排队时刷新或意外离线了
                    const waitUserTemp = this.waitUsers.filter((v) => v.userSocketId == socket.id)
                    if (waitUserTemp.length > 0) {
                        const waitUserTempIndex = this.waitUsers.findIndex((v) => v.userSocketId == socket.id)
                        const serviceIndex = this.services.findIndex((v) => v.socketId == waitUserTemp[0].serviceSocketId)
                        if (serviceIndex >= 0 && waitUserTempIndex >= 0) {
                            //通知排在后面的用户排队次序-1
                            let waitUserTemp2 = this.waitUsers.filter((v) => v.serviceSocketId == this.services[serviceIndex].socketId).slice(waitUserTempIndex,)
                            if (waitUserTemp2.length > 0) {
                                waitUserTemp2.forEach(element => {
                                    socket.to(element.userSocketId).emit("WaitCountState")
                                });
                            }
                            //删除等待用户
                            this.waitUsers = this.waitUsers.filter((v) => v.userSocketId != socket.id)
                        }
                    }

                    //客服离线
                    if (this.services.length > 0) {
                        //拿出离线的客服数据
                        let service = this.services.filter(v => (v.socketId == socket.id))
                        if (service.length > 0) {
                            //获取跟客服连接的用户,全部通知客服下线
                            for (var i = 0; i < service[0].userList.length; i++) {
                                socket.to(service[0].userList[i].socketId).emit("Offline", state.__("Offline"))
                            }
                            //如果此客服有排队咨询的用户，全部通知全部排队的用户客服已离线，并删除排队用户
                            let waitUserTemp = this.waitUsers.filter((v) => v.serviceSocketId == socket.id)
                            if (waitUserTemp.length > 0) {
                                waitUserTemp.forEach(element => {
                                    socket.to(element.userSocketId).emit("WaitServiceOffline", state.__("WaitServiceOffline"))
                                });
                                this.waitUsers = this.waitUsers.filter((v) => v.serviceSocketId != socket.id)
                            }
                            //删除该客服
                            this.services = this.services.filter(v => (v.socketId != socket.id))
                        }
                    }

                } catch (e) {
                    console.log("下标错误")
                }

            })
        });
    }

}

