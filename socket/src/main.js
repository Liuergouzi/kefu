import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import config from './config'

axios.defaults.baseURL = '/api'		//设置默认请求地址
//axios.defaults.baseURL = 'http://localhost:3030/' //打包之后路径可能1会出现错误，可能不需要代理，因此需要使用此路径
axios.defaults.headers={ 'content-type': 'application/json', 'Authorization': 'Bearer ' + config.chatGptKey }


//按需引入vant
import 'vant/lib/index.css'
import { Button } from 'vant'
import { Switch } from 'vant'
import { Icon } from 'vant'
import { NoticeBar } from 'vant'
import { Toast } from "vant"
import { Popover } from "vant"
import { Rate } from "vant"
import { Popup } from "vant"
import { Slider } from "vant"
import { Pagination } from 'vant';


/**
 * 路由拦截
 * to前往的路径，from要离开的路径，拦截之后要去的路径
 */

router.beforeEach((to, from, next) => {

	let params = { token: '' }
	//获取token
	try {
		params.token = localStorage.getItem('token');
	} catch (e) {
		params.token = '';
	}

	//客服页面拦截，没登录就返回登录界面
	if (to.path == "/customerService") {
		//token时间及正确性验证
		axios({
			method: 'post',
			url: '/verificationToken',
			data: params
		}).then((response) => {
			if (response.data[0].code) {
				next();
				return;
			} else {
				next('/customerServiceLogin');
				return;
			}
		})
	}
	//用户聊天页面拦截
	//判断数据格式是否非空，是否正确，如果此处数据被伪造那也没关系~
	else if (to.path == "/customerChat") {
		var json = store.state.userData;
		if (store.state.userData != {} && typeof (json) == "object" && Object.prototype.toString.call(json).toLowerCase() == "[object object]" && !json.length) {
			next();
			return;
		} else {
			next('/');
			return;
		}
	}
	else {
		next();
	}

})

createApp(App).use(store).use(router).use(Button).use(Switch).use(Popup).use(Slider).use(Pagination).use(Icon).use(Toast).use(NoticeBar).use(Popover).use(Rate).mount('#app')
