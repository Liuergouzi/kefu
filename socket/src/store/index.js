import { createStore } from 'vuex'
import io from "socket.io-client";
export default createStore({
  state: {
    userData:'', 
    userId:'',
    token:'',
    socket:io("http://xxx.xxx.xxx.xxx:3030"),
    //全局背景样式颜色
    bgColor:'background: #30bcbc',
    textColor:'color : #30bcbc',
    robot: [
        {
        "sendType" :2,
        "sendPeople" : 'other',
        "message" : "您好，欢迎进入【轮子哥】在线客服咨询，请点击您需要咨询的问题我们会及时给您回复哦，谢谢！<br>",
        "problem" :["<div class='robotSend'>1.谁是轮子哥？</div>","<div class='robotSend'>2.你会唱跳rap篮球吗？</div>"],
        "reply":["天天造轮子的那个","个人练习时长两年半，唱跳rap不在话下！"]
        }
    
    ],
    
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
