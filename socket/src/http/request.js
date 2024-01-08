import axios from 'axios'
import { translate as $t } from "../language/index"
import { Toast } from 'vant';
import config from '../config';
import router from '@/router';
//创建axios
const instance = axios.create({
    baseURL: config.environment == 'dev' ? '/api' : config.environment == 'build' ? config.apiUrl : process.env.BASE_API,
    timeout: 10000
})
//节流
let lastTime = new Date().getTime()
//防抖
const debounceTokenCancel = new Map()
let res
//请求前拦截
instance.interceptors.request.use(config => {

    const token = localStorage.getItem('token');
    config.headers = {
        //配置token
        'Content-Type': 'application/json',
        'T-Authorization': token,
        //中英文标识
        'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'
    }

    //请求接口进行标识
    const tokenKey = `${config.method}-${config.url}`
    //存在可以防抖的情况，取消请求
    const cancel = debounceTokenCancel.get(tokenKey)
    if (cancel) {
        cancel()
    }

    return new Promise((resolve, reject) => {
        let timer
        if (config.method == 'get') {
            //放行get请求
            resolve(config)
        } else if (config.method == 'post') {
            //开始节流
            const nowTime = new Date().getTime()
            if (nowTime - lastTime < 1000) {
                Toast($t('text.Common.t1'));
                //return Promise.reject(new Error('节流处理中，稍后再试'))
                return reject(false)
            } else {
                //开始防抖
                lastTime = nowTime
                timer = setTimeout(() => {
                    clearTimeout(timer)
                    resolve(config)
                }, 10)
                //发生重复请求，进行取消
                debounceTokenCancel.set(tokenKey, () => {
                    clearTimeout(timer)
                    resolve(new Error('取消请求'))
                })
            }
        }
    })
}, error => {
    console.log(error)
    return Promise.reject(error)
})


// let showError = false; // 新增一个变量来控制是否已经显示错误消息
// let timerError = null; // 新增一个计时器

//响应后拦截
instance.interceptors.response.use(response => {
    if (response.data.code) {
        return response.data.data
    } else if (response.data.type=="accessDenied") { 
        res = response
        showErrorMsg()
        router.go(0)
        return Promise.reject(response.data)
    } else {
        res = response
        showErrorMsg()
        return Promise.reject(response.data)
    }
}, error => {
    if (error)
        showErrorMsg2()
    return Promise.reject(error)
})

// 定义防抖函数
function debounce(func, delay) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// 使用防抖包裹错误提示
const showErrorMsg = debounce(() => {
    Toast(res.data.message);
}, 200)

// 使用防抖包裹错误提示
const showErrorMsg2 = debounce(() => {
    Toast($t('text.Common.t2'));
}, 200)

export default instance