/*
 * @轮子的作者: 轮子哥
 * @Date: 2024-01-02 16:37:56
 * @LastEditTime: 2024-01-02 17:05:52
 */
const NodeCache = require('node-cache');
const config = require('../config')
// 创建一个新的缓存实例  
const myCache = new NodeCache({ stdTTL: config.cacheTime }); // stdTTL缓存时间，单位秒。  

// 设置缓存
function setCache(key, params) {
    myCache.set(key, params);
}

//获取缓存
function getCache(key) {
    // 获取缓存的键值对  
    const value = myCache.get(key);
    if (value){
        return value
    }else{
        return false
    }
}

//删除指定缓存缓存
function delCache(key) {
    myCache.del(key);
}

//清空所有缓存
function clearCache() {
    myCache.clear();
}

module.exports = {
    setCache,
    getCache,
    delCache,
    clearCache
}