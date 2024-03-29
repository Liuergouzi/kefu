var OptPool = require('./sqlPool');
/**
 * 地址：https://www.cnblogs.com/fangsmile/p/6255872.html
 * asyn库高效写代码，因为这些代码之前写的，不想改，所以asyn没有用到，但后面的增删改查建议使用asyn
*/
var async = require('async');

var optPool = new OptPool();
var pool = optPool.getPool();

//连接数据库
pool.getConnection(function (error, connection) {
    if (error) {
        console.log('【轮子哥】数据库连接失败，请检查账号密码或相应的数据库是否存在');
        connection.release();
        return;
    }
    console.log('【轮子哥】数据库连接成功');
    connection.release();
})


/**
 * 首页自定义问题查询
 * @param {*} 
 * @returns 自定义问题
 */

function selectdefaultProblem() {
    var sql = `select * from problem;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })

}


/**
 * 用户数据查询
 * @param {*} userId 用户浏览器指纹id,string
 * @returns 查询到返回用户数据json，否则返回false
 */

function selectUser(userId) {
    var sql = `select * from user where userId=${userId};`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(JSON.stringify(result[0]))
                }
            })
            connection.release();
        })
    })

}



/**
 * 用户数据插入数据库
 * @param {*} userJson 传递过来的用户json数据,形式为：{}
 * @returns 返回是否数据插入成功
 */

function insertUser(userJson) {

    var sql = `insert into user(userId,userName,ip,area,device,extend) 
    values(${userJson.userId},${userJson.userName},${userJson.ip},${userJson.area},${userJson.device},${userJson.extend});`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })
}

/**
 * 更新用户数据
 * @param {*} userJson 传递过来的用户json数据,形式为：{},id 用户id
 * @returns 返回是否数据插入成功
 */
function updateUser(userJson, id) {
    var sql = `update user set userName=${userJson.userName}, ip=${userJson.ip},area=${userJson.area},device=${userJson.device},extend=${userJson.extend} 
    where id=${"'" + id + "'"};`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })
}


/**
 * 客服登录数据查询
 * @param {*} loginJson 客服登录json数据，形式为：{}
 * @returns 查询到后，返回除了密码之外的客服json数据，否则返回false
 */

function serviceLogin(loginJson) {
    var sql = `select * from service where serviceAccount=${loginJson.serviceAccount} and servicePassword=${loginJson.servicePassword};`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    if (JSON.stringify(result[0])) {
                        let returns = result[0];
                        delete returns.serviceAccount;
                        delete returns.servicePassword;
                        resolve(JSON.stringify(returns));
                    } else {
                        resolve(JSON.stringify(result[0]))
                    }
                }
            })
            connection.release();
        })
    })

}



/**
 * 修改客服名称
 * @param serviceName 客服名称 serviceId 客服id,string,string
 * @returns 返回状态码
 */

function updateServiceName(serviceName, serviceId) {
    var sql = `update service set serviceName=${serviceName} where serviceId=${serviceId} ;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            connection.release();
        })
    })

}


/**
 * 修改客服最大接待次数
 * @param serviceMax 客服最大接待次数 serviceId 客服id,number,string
 * @returns 返回状态码
 */

function updateServiceMax(serviceMax, serviceId) {
    var sql = `update service set serviceMax=${serviceMax} where serviceId=${serviceId} ;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            connection.release();
        })
    })

}


/**
 * 修改客服接待次数
 * @param serviceId 客服id,string
 * @returns 返回状态码
 */

function updateServiceFrequency(serviceId) {
    var sql = `update service set serviceFrequency=serviceFrequency+1 where serviceId=${serviceId} ;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            connection.release();
        })
    })

}



/**
 * 聊天信息存储
 * @param {*} 聊天信息json数据，形式为：{}
 * @returns 返回id
 */

function insertMessage(messageJson) {
    if (messageJson.hasOwnProperty("userId")) {
        var sql = `insert into message(sendId,receiveId,sendMessage,sendType,sendTime) values(${messageJson.userId},${messageJson.receiveId},${messageJson.message},${messageJson.sendType},${messageJson.time});`;
    }
    if (messageJson.hasOwnProperty("serviceId")) {
        var sql = `insert into message(sendId,receiveId,sendMessage,sendType,sendTime) values(${messageJson.serviceId},${messageJson.receiveId},${messageJson.message},${messageJson.sendType},${messageJson.time});`;
    }

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(result.insertId)
                }
            })
            connection.release();
        })
    })
}

/**
 * 离线信息存储
 * @param {*} 聊天信息json数据，形式为：{}
 * @returns 返回id
 */

function insertOfflineMessage(messageJson) {
    var sql = `insert into message(sendId,receiveId,sendMessage,sendType,sendTime,isUserOffline) 
    values(${messageJson.userId},${messageJson.receiveId},${messageJson.message},${messageJson.sendType},${"'" + messageJson.time + "'"},'1');`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(result.insertId)
                }
            })
            connection.release();
        })
    })
}

/**
 * 离线信息查询
 */

function selectOfflineMessage(serviceId, page) {
    var star = (page - 1) * 20;
    var sql = `select * from message JOIN user ON message.sendId=user.userId where
    message.receiveId=${serviceId} and message.isUserOffline='1' order by sendTime desc limit ${star}, 20;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}

/**
 * 离线信息查询总数
 */

function offlineMessageCount(serviceId) {
    var sql = `select count(id) from message where receiveId=${serviceId} and isUserOffline='1'`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(result[0]['count(id)'])
                }
            })
            connection.release();
        })
    })
}

/**
 * 取消设置离线信息
 */

function resetOfflineCount(userId) {
    var sql = `update message set isUserOffline='0' where sendId=${userId} ;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })
}


/**
 * 聊天信息撤回
 * @param {*} messageId 聊天信息id
 * @returns 返回状态码
 */

function retractMessage(messageId) {

    var sql = `update message set isRetract='1' where id=${messageId} ;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            const result = connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })

}



/**
 * 客服端用户离线列表存储
 * @param {*} 离线列表信息json数据，形式为：{}
 * @returns 返回状态码
 */

function insertChatList(userJson) {
    var sql = `insert into offlinelist(userId,serviceId,userName,ip,area,device,extend,userState,isProhibit,updateTime) 
    values(${userJson.userId},${userJson.receiveId},${userJson.userName},${userJson.ip},${userJson.area},
           ${userJson.device},${userJson.extend ? userJson.extend : "''"},${userJson.userState},${userJson.isProhibit},${userJson.updateTime}) 
    ON DUPLICATE KEY UPDATE userName=${userJson.userName},ip=${userJson.ip},area=${userJson.area},device=${userJson.device},
           extend=${userJson.extend ? userJson.extend : "''"},userState=${userJson.userState},isProhibit=${userJson.isProhibit},updateTime=${userJson.updateTime};`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })

}


/**
 * 获取用户离线列表
 * @param {*} serviceId 客服ID  page 页数
 * @returns 返回最新20条离线列表
 */

function chatListSelect(serviceId, page) {
    var star = (page - 1) * 20;
    var sql = `
    select offlinelist.*,
    (
    select message.sendmessage
    from message
    where message.sendId = offlinelist.userId
    order by message.id desc
    limit 1
    ) as sendmessage,
    (
        select message.sendType
        from message
        where message.sendId = offlinelist.userId
        order by message.id desc
        limit 1
    ) as sendType
    from offlinelist  
    where offlinelist.serviceId = ${serviceId}
    order by offlinelist.updatetime desc
    limit ${star}, 20;`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })

}


/**
 * 聊天记录查询
 * @param {*} sendId 发送者id,接收者id receiveId，形式为：string,string
 * @returns 查询到后，聊天json数据，否则返回false
 */
//用户
function userHistoryMessage(sendId, receiveId) {
    var sql = `
        select 
            case when isRetract = '1' then '' else sendMessage end as sendMessage,
            id,sendId, receiveId,sendType,sendTime,isRetract
        from message 
        where 
            (sendId = ${sendId} and receiveId = ${receiveId})
            or (sendId = ${receiveId} and receiveId = ${sendId})
        order by sendTime asc`;

    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}
//客服
function serviceHistoryMessage(sendId, receiveId) {
    var sql = `select * from message where sendId=${sendId} and receiveId=${receiveId} or sendId=${receiveId} and receiveId=${sendId} order by sendTime asc;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })

}



/**
 * 留言提交
 * @param {*} commentJson 提交的json数据，形式为：{}
 * @returns 返回状态码
 */
function commentInsert(commentJson) {
    var sql = `insert into comment(commentId,commentContent,commentGrade,commentTime) values(${commentJson.commentId},${commentJson.commentContent},${commentJson.commentGrade},${commentJson.commentTime});`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })

}


/**
 * 更据用户id留言查询
 * @param {*} commentId 提交的用户id，形式为：String
 * @returns 返回留言
 */
function commentSelectById(commentId) {
    var sql = `select * from comment where commentId=${commentId}  order by id desc;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })

}



/**
 * 获取留言
 * @param {*} page 页数
 * @returns 返回最新10条留言
 */
function commentSelect(page) {
    var star = (page - 1) * 10;
    var sql = `select * from comment  order by id desc limit ${star}, 10;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })

}


/**
 * 客服回复
 * @param {*} replyJson 客服回复数据，形式为：{}
 * @returns 返回状态码
 */
function commentReply(replyJson) {
    var sql = `update comment set commentState='1' , commentService=${replyJson.commentService} , commentReply=${replyJson.commentReply} where id=${replyJson.id} ;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })

}


/**
 * 查询快捷回复
 * @param {*} serviceId 客服id
 * @returns 返回快捷回复数据
 */
function selectFast(serviceId) {
    var sql = `select * from fast where serviceId=${serviceId} and isDelete !='1';`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}

/**
 * 添加快捷回复
 * @param {*} fastJson 修改数据
 * @returns 返回快捷回复数据
 */
function addFast(fastJson) {
    var sql = `insert into fast(serviceId,parentId,title) values(${fastJson.serviceId},${fastJson.parentId},${fastJson.title});`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}

/**
 * 修改快捷回复
 * @param {*} fastJson 修改数据
 * @returns 返回快捷回复数据
 */
function editFast(fastJson) {
    var sql = `update fast set title=${fastJson.title} where id=${fastJson.id} ;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}

/**
 * 删除快捷回复
 * @param {*} id 快捷回复主键
 * @returns 返回快捷回复数据
 */
function deleteFast(id) {
    var sql = `update fast set isDelete='1' where id=${id} ;`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(true)
                }
            })
            connection.release();
        })
    })
}


/**
 * 查询客服
 * @param {*} page 页数
 * @returns 返回10条客服数据列表
 */
function selectService(page, serviceType) {
    var star = (page - 1) * 10;
    if (serviceType) {
        var sql = `select serviceId,serviceName,serviceMax,serviceHead from service where serviceType=${serviceType} limit ${star}, 10;`;
    } else {
        var sql = `select serviceId,serviceName,serviceMax,serviceHead from service limit ${star}, 10;`;
    }
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}


/**
 * 客服查询用户
 * @param {*} userName 用户名称，serviceId 客服id
 * @returns 返回离线数据列表
 */
function selectUserName(userName, serviceId) {
    var sql = `select * from offlinelist where userName rlike ${userName} and serviceId=${serviceId};`;
    return new Promise((resolve, reject) => {
        pool.getConnection(function (error, connection) {
            connection.query(sql, (error, result) => {
                if (error) {
                    console.log('【SQL语法错误】', error.message);
                    resolve(false);
                } else {
                    resolve(result)
                }
            })
            connection.release();
        })
    })
}

//暴露方法
module.exports = {
    selectdefaultProblem,
    selectUser,
    insertUser,
    updateUser,
    serviceLogin,
    updateServiceName,
    updateServiceMax,
    updateServiceFrequency,
    insertMessage,
    retractMessage,
    userHistoryMessage,
    serviceHistoryMessage,
    commentInsert,
    commentSelectById,
    commentSelect,
    insertChatList,
    chatListSelect,
    commentReply,
    selectFast,
    addFast,
    editFast,
    deleteFast,
    selectService,
    insertOfflineMessage,
    selectOfflineMessage,
    offlineMessageCount,
    resetOfflineCount,
    selectUserName
}


