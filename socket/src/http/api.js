import request from "./request.js";

//校验token
export function verificationToken(params) {
    return request({
        url: "/verificationToken",
        method: "get",
        params: params
    });
}

//查询首页展示的问题和回答
export function selectdefaultProblem(params) {
    return request({
        url: "/selectdefaultProblem",
        method: "get",
        params: params
    });
}

//首页查询加载客服列表数据
export function selectService(params) {
    return request({
        url: "/selectService",
        method: "get",
        params: params
    });
}

//查询自己的留言记录
export function commentSelectById(params) {
    return request({
        url: "/commentSelectById",
        method: "get",
        params: params
    });
}

//留言评论
export function commentInsert(data) {
    return request({
        url: "/commentInsert",
        method: "post",
        data: data
    });
}

//客服查询离线用户列表
export function chatListSelect(params) {
    return request({
        url: "/chatListSelect",
        method: "get",
        params: params
    });
}

//客服查询离线消息列表
export function selectOfflineMessage(params) {
    return request({
        url: "/selectOfflineMessage",
        method: "get",
        params: params
    });
}

//客服查询离线消息总数
export function offlineMessageCount(params) {
    return request({
        url: "/offlineMessageCount",
        method: "get",
        params: params
    });
}

//取消离线消息红点
export function resetOfflineCount(data) {
    return request({
        url: "/resetOfflineCount",
        method: "post",
        data: data
    });
}

//用户发送离线客服存储离线消息
export function insertOfflineMessage(data) {
    return request({
        url: "/insertOfflineMessage",
        method: "post",
        data: data
    });
}

//查询历史聊天记录
export function selectMessage(params) {
    return request({
        url: "/selectMessage",
        method: "get",
        params: params
    });
}

//客服查询留言记录
export function commentSelect(params) {
    return request({
        url: "/commentSelect",
        method: "get",
        params: params
    });
}

//客服留言回复
export function commentReply(data) {
    return request({
        url: "/commentReply",
        method: "post",
        data: data
    });
}

//客服更改名字
export function updateServiceName(data) {
    return request({
        url: "/updateServiceName",
        method: "post",
        data: data
    });
}

//客服更改最大接待次数
export function updateServiceMax(data) {
    return request({
        url: "/updateServiceMax",
        method: "post",
        data: data
    });
}

//客服查询快捷回复
export function selectFast(params) {
    return request({
        url: "/selectFast",
        method: "get",
        params: params
    });
}

//客服添加快捷回复
export function addFast(data) {
    return request({
        url: "/addFast",
        method: "post",
        data: data
    });
}

//客服修改快捷回复
export function editFast(data) {
    return request({
        url: "/editFast",
        method: "post",
        data: data
    });
}

//客服删除快捷回复
export function deleteFast(data) {
    return request({
        url: "/deleteFast",
        method: "post",
        data: data
    });
}