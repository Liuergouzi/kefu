const mysql = require("../DB/mysql.js");      //引入mysql
const token = require("../security/token.js");  //引入token
const state = require('../language/i18n'); //引入全局返回状态   
const nowTime = require("../utils/time.js");

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

        //修改名称接口
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

        //历史聊天记录查询
        this.app.get('/selectMessage', function (req, res) {
            mysql.selectMessage(req.query.sendId, req.query.receiveId, req.query.isService).then((sql_data) => {
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
            mysql.chatListSelect(req.query.serviceId, req.query.page.replace(/'/g,"")).then((sql_data) => {
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
            mysql.commentSelect(req.query.page.replace(/'/g,"")).then((sql_data) => {
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
            mysql.selectOfflineMessage(req.query.serviceId, req.query.page.replace(/'/g,"")).then((sql_data) => {
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



    }
}
