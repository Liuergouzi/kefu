/*
 * @轮子的作者: 轮子哥
 * @Date: 2023-12-21 09:12:37
 * @LastEditTime: 2023-12-21 16:50:33
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {verificationToken} from "./http/api"


//按需引入vant
import 'vant/lib/index.css'
import { Button,Switch,Icon,NoticeBar,Toast,Popover,Rate,Popup,Slider,Pagination,Dialog,List,Field,ActionSheet  } from 'vant'

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
		verificationToken(params).then(() => {
			next();
			return;
		}).catch(()=>{
			next('/customerServiceLogin');
			return;
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

createApp(App).use(Button).use(Switch).use(Popup).use(Slider)
.use(Pagination).use(Icon).use(Toast).use(NoticeBar).use(Popover).use(Dialog).use(Rate).use(List)
.use(Field).use(ActionSheet).use(store).use(router).use(i18n).mount('#app')
