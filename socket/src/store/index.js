import { createStore } from 'vuex'
import io from "socket.io-client";
import config from '../config'
import { i18n } from '../language/index';
export default createStore({
  state: {
    userData: '',
    userId: '',
    token: '',
    //用户端的socket
    socket: io(config.apiUrl, {
      extraHeaders: {
        'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'
      }
    }),

    //客服端的socket,同一个浏览器同时用客服端和用户端会发生数据叠加，再创一个socket连接  
    serviceSocket: io(config.apiUrl, {
      extraHeaders: {
        'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'
      }
    }),

    bgColor: 'background: #30bcbc',    //全局背景样式颜色
    textColor: 'color : #30bcbc',
    robot: [
      {
        "sendType": 2,
        "sendPeople": 'other',
        "message": "您好，欢迎进入【轮子哥】在线客服咨询，请点击您需要咨询的问题我们会及时给您回复哦，谢谢！<br>",
        "problem": ["<div class='robotSend'>1.谁是轮子哥？</div>", "<div class='robotSend'>2.你会唱跳rap篮球吗？</div>"],
        "reply": ["天天造轮子的那个", "个人练习时长两年半，唱跳rap不在话下！"]
      }

    ],

  },
  getters: {
  },
  mutations: {
    //设置中英文
    setLanguageUser(state) {
      console.log(i18n)
      if (localStorage.getItem('language') && localStorage.getItem('language') == 'en-US') {
        state.socket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'zh-CN' }})
        state.serviceSocket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'zh-CN' }})
        localStorage.setItem('language','zh-CN') 
        
      } else {
        state.socket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'en-US' }})
        state.serviceSocket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'en-US' }})
        localStorage.setItem('language','en-US') 
      }
      
    },
  },
  actions: {
  },
  modules: {
  }
})
