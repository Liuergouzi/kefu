import { createStore } from 'vuex'
import io from "socket.io-client";
import config from '../config'
export default createStore({
  state: {
    userData: '',
    userId: '',
    token: '',
    //定义通信socket
    socket: io(config.apiUrl, {
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
      if (localStorage.getItem('language') && localStorage.getItem('language') == 'en-US') {
        state.socket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'zh-CN' }})
        localStorage.setItem('language','zh-CN') 
        
      } else {
        state.socket=io(config.apiUrl, {extraHeaders: {'Accept-Language': 'en-US' }})
        localStorage.setItem('language','en-US') 
      }
      
    },
  },
  actions: {
  },
  modules: {
  }
})
