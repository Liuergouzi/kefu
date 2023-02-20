基于vue+node+socket+vant+mysql实现的在线客服系统，前后端分离，浏览器指纹作为访客唯一id，内置chatGPT智能回复，采用RSA加解密数据，防sql注入，xss，可发送图片表情、查询历史消息、留言、踢人等，更多功能等待后续更新。
简单快速部署，基本每隔几行我都有写备注，可读性强，目前功能不是很多，欢迎进行二次开发

-------------------------------------------------------------------------------------------------
1.实现功能;  
	（1）：懒得说，自己看  
	  在线体验地址（用户端）：http://60.205.187.0/kefu/#/  
	  在线体验地址（客服端）：http://60.205.187.0/kefu/#/  		
-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
2.实现截图;  
![客服页面1](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/1.jpg)

![首页1](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/2.jpg)

![首页2](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/3.jpg)

![留言1](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/4.jpg)

![客服聊天1](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/5.jpg)

![用户聊天2](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/6.jpg)
-------------------------------------------------------------------------------------------------


-------------------------------------------------------------------------------------------------
3.本地部署说明：  
	  环境说明：node版本最低16，有些依赖要求最低版本为16，低于16会报错  
	（1）service为node后端，socket为vue前端，后端端口号3030，前端端口号9528。  
	        数据库使用mysql，数据库名chat，先创建一个空数据库，再导入。  
	（2）找到service\DB\sqlPool.js文件，更换你自己的数据库密码  
	（3）找到socket\store\index.js、socket\vue.config.js里边的后台路径换成你自己的  
	（4）找到socket\src\main.js文件里的  
	        axios.defaults.headers={ 'content-type': 'application/json', 'Authorization': 'Bearer ' + '你的apikey' }  
	        把apikey换成你自己在chatGPt官网里边申请的apikey  
	（5）以上都修改好了之后：  
		cd 进入service文件夹：  
			安装依赖：npm install  
			运行：node service.js  
		cd进入socket文件夹：  
			安装依赖：npm install  
			运行：node run service  
			打包：npm run build  
	（6）运行起来或打包之后，用户端访问路径为：你的地址 + /index.html#/  
	        客服端访问路径为 你的地址 + /#/customerService  
-------------------------------------------------------------------------------------------------

