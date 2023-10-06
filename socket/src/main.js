import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import config from './config'

if (config.environment == 'dev') {
	axios.defaults.baseURL = '/api'		//设置默认请求地址
} else if (config.environment == 'build') {
	axios.defaults.baseURL = config.apiUrl  //设置默认请求地址
}

axios.defaults.headers = { 'content-type': 'application/json'}

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
import { Dialog } from 'vant';
import { List  } from 'vant';

/**
 * 中英文
 */
import { createI18n } from "vue-i18n";
import ZH from './language/zh-CN'
import EN from './language/en-US'
const i18n = createI18n({
	legacy: false,
	locale: localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN',
	globalInjection: true,
	messages: {
		"zh-CN": {
			text: ZH
		},
		"en-US": {
			text: EN
		}
	}
});


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
			if (response.data.code) {
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
			next(localStorage.getItem("extendRouter"));
			return;
		}
	}
	else {
		next();
	}

})

createApp(App).use(store).use(router).use(i18n).use(Button).use(Switch).use(Popup).use(Slider)
.use(Pagination).use(Icon).use(Toast).use(NoticeBar).use(Popover).use(Dialog).use(Rate).use(List).mount('#app')
