### 1.介绍

+	基于vue+node+socket+vant+mysql实现的在线客服系统，前后端分离，浏览器指纹作为访客唯一id，内置chatGPT智能回复，采用RSA加解密数据，
	防sql注入，xss，可发送图片表情、查询历史消息、留言、踢人、排队等待，更多功能等待后续更新。简单快速部署，基本每隔几行我都有写备注，可读性强，
	目前功能不是很多，欢迎进行二次开发

-------------------------------------------------------------------------------------------------
### 2.在线地址 
+    已经解决https跨域问题，在线访问时请使用https协议访问，在线预览的后端目前是没有配置http的。因为使用了https协议，所以首次访问会更慢一些
+	 在线体验地址（客服端）：https://ctrlc.cc/kefu/index.html#/customerService  账号密码都是666 
+	 在线体验地址（用户端）：https://ctrlc.cc/kefu/#/  		
-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
### 3.实现截图
![截图1](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/11.jpg)

![截图2](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/12.jpg)

![截图3](https://47image.oss-cn-heyuan.aliyuncs.com/github/kefu/13.jpg)

-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
### 4.实现功能 
+	 实时聊天，发送文字、图片、表情、查看历史消息
+	 留言与回复留言
+	 中英文
+    同一个浏览器多开窗口会强制另一个窗口下线
+	 用户端手机电脑布局适
+	 客服端设置昵称、设置同时最多连接人数（设置之后均需要重新刷新才生效，如果某个用户下线导致其它的被排挤掉，这是因为你用了同一个浏览器） 
+	 客服端可以快捷回复
+	 其它的就不一一描述了
-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
### 5.本地部署说明
+	环境说明：node版本最低16，有些依赖要求最低版本为16，低于16可能会报错。service为node后端，socket为vue前端，后端端口号3030，前端端口号9528。数据库使用mysql，数据库名chat，如果mysql不兼容导入错误，先创建一个空数据库，把chat.sql打开复制，在mysql可视化工具里粘贴进行sql执行。代码默认是使用http协议，如需使用https协议请看下面部署说明。
+	找到service\DB\sqlPool.js文件，更换你自己的数据库账号密码  
+	以上都修改好了之后：  
	 	cd 进入service文件夹：  安装依赖：npm install  ；运行：node service.js  
		cd进入socket文件夹：    运行：npm run serve   ；安装依赖：npm install  ；打包：npm run build 
+	运行起来或打包之后，用户端访问路径为：http://localhost:9528/#/  客服端访问路径为： http://localhost:9528/#/customerService  
-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
### 6.服务器部署说明
+	找到socket\src\config.js文件，确保environment为build，apiUrl更换为： http://xx.你的ip地址.xx:3030，一定要使用ip地址，不要使用localhost
-------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------
### 7.服务器https协议部署说明
+	找到socket\src\config.js文件，确保apiUrl的后端路径是https协议
+	找到service\service.js文件，有注释提示，将指定http那部分代码注释掉，然后取消https那部分代码的注释
+	如果有任何疑问：直接加QQ 3217454073 
-------------------------------------------------------------------------------------------------

