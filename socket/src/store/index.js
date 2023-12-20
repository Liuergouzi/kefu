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
    textColor: 'color : #30bcbc'
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
