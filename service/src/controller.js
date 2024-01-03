const mysql = require("../DB/mysql.js");      //引入mysql
const token = require("../security/token.js");  //引入token
const state = require('../language/i18n.js'); //引入全局返回状态   
const nowTime = require("../utils/time.js");
const config = require("../config.js");
const fs = require("fs");  //文件写入

module.exports = class controller {
    constructor(app) {
        this.app = app;
    }

    getApi(socketClass) {

        //token校验接口
        this.app.get('/verificationToken', function (req, res) {
            res.json(token.verificationToken(req.query.token))
        })

        //首页自定义问题查询
        this.app.get('/selectdefaultProblem', function (req, res) {
            mysql.selectdefaultProblem().then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //修改客服名称接口
        this.app.post('/updateServiceName', function (req, res) {
            mysql.updateServiceName(req.body.serviceName, req.body.serviceId).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //修改最大接待次数接口
        this.app.post('/updateServiceMax', function (req, res) {
            mysql.updateServiceMax(Number(req.body.serviceMax), req.body.serviceId).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //用户历史聊天记录查询
        this.app.get('/userHistoryMessage', function (req, res) {
            mysql.userHistoryMessage(req.query.sendId, req.query.receiveId).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //客服历史聊天记录查询
        this.app.get('/serviceHistoryMessage', function (req, res) {
            mysql.serviceHistoryMessage(req.query.sendId, req.query.receiveId).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //提交留言
        this.app.post('/commentInsert', function (req, res) {
            mysql.commentInsert(req.body).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //查看自己留言
        this.app.get('/commentSelectById', function (req, res) {
            mysql.commentSelectById(req.query.commentId).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //获取最新20条离线用户列表
        this.app.get('/chatListSelect', function (req, res) {
            mysql.chatListSelect(req.query.serviceId, req.query.page.replace(/'/g, "")).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //留言分页
        this.app.get('/commentSelect', function (req, res) {
            mysql.commentSelect(req.query.page.replace(/'/g, "")).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //客服回复
        this.app.post('/commentReply', function (req, res) {
            mysql.commentReply(req.body).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //查询快捷回复
        this.app.get('/selectFast', function (req, res) {
            mysql.selectFast(req.query.serviceId).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //添加快捷回复
        this.app.post('/addFast', function (req, res) {
            mysql.addFast(req.body).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //修改快捷回复
        this.app.post('/editFast', function (req, res) {
            mysql.editFast(req.body).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //删除快捷回复
        this.app.post('/deleteFast', function (req, res) {
            mysql.deleteFast(req.body.id).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //指定连接时查询客服
        this.app.get('/selectService', function (req, res) {
            mysql.selectService(req.query.page.replace(/'/g, ""), req.query.serviceType).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    socketClass.getServices().forEach(element1 => {
                        returns.data.forEach(element2 => {
                            if (element1.serviceId == element2.serviceId) {
                                element2.isOnLine = true
                            }
                        });
                    });
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })


        //存储离线消息
        this.app.post('/insertOfflineMessage', function (req, res) {
            if (req.body.sendType == '2' && config.imageSaveLocal || req.body.sendType == '3' && config.imageSaveLocal) {
                try {
                    //过滤data:URL
                    let base64Data = req.body.message.replace(/'/g, "").replace(/^data:image\/\w+;base64,/, "");
                    let dataBuffer = new Buffer.from(base64Data, 'base64');
                    // 存储文件命名是使用当前时间，防止文件重名
                    let saveUrl = config.imageSaveUrl + '/' + (new Date()).getTime()+"0"+Math.floor(Math.random() * 100) + ".png";
                    if (base64Data.length/4*3 > 1024 * 1024 * 3) {
                        socket.emit("error", "图片不能超过3m")
                        return
                    }
                    fs.writeFileSync(config.imageStaticDirectory + saveUrl, dataBuffer);
                    req.body.message = "'" + config.imageIp + saveUrl + "'"
                } catch (err) {
                    console.log('【文件保存错误】', err);
                }
            }

            req.body.time = nowTime.getNowTime();
            mysql.insertOfflineMessage(req.body).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //查询离线消息
        this.app.get('/selectOfflineMessage', function (req, res) {
            mysql.selectOfflineMessage(req.query.serviceId, req.query.page.replace(/'/g, "")).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //查询离线消息总数
        this.app.get('/offlineMessageCount', function (req, res) {
            mysql.offlineMessageCount(req.query.serviceId).then((sql_data) => {
                let returns = state.__("success");
                returns.data = sql_data;
                res.json(returns)
            });
        })

        //取消设置离线消息
        this.app.post('/resetOfflineCount', function (req, res) {
            mysql.resetOfflineCount(req.body.userId).then((sql_data) => {
                if (sql_data) {
                    res.json(state.__("success"))
                } else {
                    res.json(state.__("false"))
                }
            });
        })

        //客服查询用户
        this.app.post('/selectUserName', function (req, res) {
            mysql.selectUserName(req.body.userName, req.body.serviceId).then((sql_data) => {
                if (sql_data) {
                    let returns = state.__("success");
                    returns.data = sql_data;
                    res.json(returns)
                } else {
                    res.json(state.__("false"))
                }
            });
        })



    }
}
