<template>
    <div class="serviceBody">
        <!--头部-->
        <div class="serviceHead" :style="this.$store.state.bgColor">

            <!--左-->
            <div class="serviceHeadLeft">
                <div class="serviceHeadImg">
                    <img src="../assets/images/service_head.png" />
                </div>
                <div v-if="!changeServiceName" class="serviceHeadName" v-on:mouseenter="changeServiceName = true">
                    {{ service.serviceName }}
                </div>
                <MyInput v-else style="margin-top: 14px" v-on:mouseleave="changeServiceName = false" :line="'1'" :serviceId="service.serviceId" @changeValue1="changeValue"></MyInput>
                <div class="serviceHeadNameNone" style="margin-left:10px;margin-right:10px">接待次数：{{ service.serviceFrequency }}</div>
                <div style="margin-top: 13px; margin-left: 5px">
                    <van-switch v-model="statechange" size="24px" v-on:click="changeOnLine">
                        <template #node>
                            <div class="icon-wrapper">
                                <van-icon :name="statechange ? 'success' : 'cross'"></van-icon>
                            </div>
                        </template>
                    </van-switch>
                </div>
                <div class="serviceStateDiv">
                    <div :class="statechange ? 'serviceStateGreenDot' : 'serviceStateRedDot'"></div>
                    {{ statechange ? "在线" : "离线" }}
                </div>

            </div>

            <!--中-->
            <div class="serviceHeadCenter">
                <van-notice-bar v-if="showNoticeBar" left-icon="volume-o" delay="0" scrollable
                    text="【轮子哥在线客服客服端】您有一位新的小黑子访问" mode="closeable">
                </van-notice-bar>
            </div>

            <!--右-->
            <div class="serviceHeadRight">
                <div style="margin-top:5px">
                    <van-popover v-model:show="isPopover" :actions="actions" @select="onSelect()">
                        <template #reference>
                            <van-button type="primary"><img src="../assets/images/setting.png"></van-button>
                        </template>
                    </van-popover>
                </div>

            </div>

        </div>
        <!--主内容-->
        <div class="context">
            <!--左边内容-->
            <div class="conLeft">
                <ul>
                    <div v-show="onlineUsers.length > 0" class="conLeftTop" v-on:click="onlineShow = !onlineShow">
                        <span v-show="onlineShow">▼</span>
                        <span v-show="!onlineShow">▲</span>
                        在线会话
                    </div>
                    <!--显示在线连接列表-->
                    <li v-show="onlineShow" :key="index" v-for="(item, index) in onlineUsers" style="cursor: pointer"
                        v-on:click="selectSession(item)" :class="{ isSelect: item.data.isSelectSession }"
                        v-on:mouseenter="item.CloseSession = true" v-on:mouseleave="item.CloseSession = false">
                        <div class="liLeft">
                            <img src="../assets/images/visitor.png" />
                        </div>
                        <div class="liRight">
                            <!--显示用户名-->
                            <span class="intername">{{ item.data.userName }}</span>
                            <!--显示最新一条消息-->
                            <span class="infor">{{ item.data.message }}</span>
                            <!--显示小红点-->
                            <div v-show="item.data.UnRead > 0" class="un_read">
                                {{ item.data.UnRead > 99 ? "99+" : item.data.UnRead }}
                            </div>
                            <span class="closeSession" v-show="item.CloseSession" v-on:click.stop="closeSeesion(item)">
                                <img src="../assets/images/closeSeesion.png" style="width:12px;height:12px">
                                踢出会话
                            </span>
                        </div>
                    </li>
                </ul>
                <!--在线连接列表为空-->
                <div v-show="onlineUsers.length < 1" class="noPeople">
                    <img src="../assets/images/noPeple.png" />
                    <div style="text-align: center">正等待被撩...</div>
                </div>
            </div>
            <!--左部->中间内容-->
            <!--没有用户连接-->
            <div v-if="onlineUsers.length < 1" class="conRight">
                <div class="layout-empty">
                    <div class="layout-empty-conatiner">
                        <img style="width: 100px; height: auto" src="../assets/images/noPeple.png" />
                        <span>没有会话内容</span>
                        <span style="color: #bdc3d1">当客户接入后，从左侧客户列表中选择客户开始会话</span>
                    </div>
                </div>
            </div>
            <!--有用户连接，但没有点击-->
            <div v-else-if="isSelectShow" class="conRight">
                <div class="layout-empty">
                    <div class="layout-empty-conatiner">
                        <span>道友</span>
                        <span style="color: #bdc3d1">点击右侧列表开始你的表演吧！</span>
                    </div>
                </div>
            </div>
            <!--会话窗口-->
            <div v-show="isSelectSession" class="conRight">
                <!--会话头部-->
                <div class="Righthead">
                    <div class="headName">{{ selectUsers.data.userName }}</div>
                </div>
                <!--聊天内容-->
                <MessageWindow v-if="isSelectSession" id="RightCont" :messageList="selectUsers.data.messageList"
                    :sendId="service.serviceId" :receiveId="selectUsers.data.receiveId" :isService="'true'">
                </MessageWindow>
                <!--聊天框底部-->
                <div class="RightFoot">
                    <div v-show="!allowSession" class="notAllowSeesion"></div>
                    <div class="sendContent">
                        <!--表情包-->
                        <SendEmote v-show="expressionShow" @sendMessage="sendMessage"></SendEmote>
                        <!--工具栏-->
                        <div class="footTop">
                            <ul>
                                <li v-on:click="expressionShow = !expressionShow">
                                    <img src="../assets/images/expression.png" />
                                </li>
                                <li v-on:click="expressionShow = false" class="ExP" style="position: relative">
                                    <img src="../assets/images/imageFile.png" />
                                    <SendImage @sendMessage="sendMessage"></SendImage>
                                </li>
                            </ul>
                        </div>
                        <!--发送内容-->
                        <div style="height: calc(100% - 70px)">
                            <textarea v-on:focus="expressionShow = false" id="dope" v-model="sendData" class="textBox"
                                :placeholder="
                                    allowSession ? '请输入会话内容' : '当前会员已下线'
                                " v-on:keyup.enter="enterSend"></textarea>
                            <button class="sendBtn" id="serviceSendBtn" v-on:click="sendMessage(sendData, 1)">
                                发送(s)
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <!--右边内容-->
            <ServiceRightPage v-if="isSelectSession" @submit="selectReplay($event)" :user="selectUsers"></ServiceRightPage>
            <CommentReply v-if="!isSelectSession" ></CommentReply>
        </div>
    </div>
</template>

<script>
    // import { ref } from 'vue';
    import MyInput from '@/components/MyInput.vue';
    import MessageWindow from '@/components/MessageWindow.vue';
    import SendEmote from '@/components/SendEmote.vue';
    import SendImage from '@/components/SendImage.vue';
    import ServiceRightPage from '@/components/ServiceRightPage.vue';
    import CommentReply from '@/components/CommentReply.vue';
    export default {

        components: {
            MyInput,
            MessageWindow,
            SendEmote,
            SendImage,
            ServiceRightPage,
            CommentReply
        },

        data() {
            return {
                socket: this.$store.state.socket,
                service: {
                    serviceId: '',
                    serviceName: '',
                    serviceState: 0,
                    serviceFrequency: 0
                },
                onlineUsers: [],
                selectUsers: {
                    data: {
                        userId: '',
                        userName: '',
                        userState: '',
                        isProhibit: '',
                        messageList: []
                    }
                },
                actions: [
                    { text: '退出登录' }
                ],
                isPopover: false,
                sendData: '',
                reviceMessage: '',
                changeServiceName: false,
                statechange: false,
                showNoticeBar: false,
                onlineShow: true,
                isSelectSession: false,
                isSelectShow:true,
                allowSession: true,
                expressionShow: false,
            }
        },

        mounted() {
            //初始化
            this.initialization();

            //用户连接成功通知
            this.socket.on("UserJoinSuccess", (data) => {
                data[0].data.UnRead = 1
                data[0].data.message = "加入了会话"
                data[0].data.messageList = []
                data[0].data.isSelectSession = false
                this.onlineUsers.push(data[0])
                this.showNoticeBar = !this.showNoticeBar
                this.allowSession = true;
                this.service.serviceFrequency=this.service.serviceFrequency+1;
                //设置3分钟后自动取消通知条
                setTimeout(this.showNotice, 180000);
            });

            //接收消息
            this.socket.on("reviceMessage", (data) => {
                for (var i = 0; i < this.onlineUsers.length; i++) {
                    if (this.onlineUsers[i].data.userId == data[0].data.userId) {
                        //添加红点
                        this.onlineUsers[i].data.UnRead = this.onlineUsers[i].data.UnRead + 1;
                        //左侧列表信息更新
                        this.onlineUsers[i].data.message = data[0].data.message;
                        //新创建一个列表，将信息存入列表，用于聊天窗口循环
                        let obj = {
                            sendType: data[0].data.sendType,
                            sendPeople: 'other',
                            message: data[0].data.message
                        };
                        this.onlineUsers[i].data.messageList.push(obj)
                    }
                }

                this.reviceMessage = data[0].data.message;
            });

            //离线处理
            this.socket.on("Offline", (data) => {
                this.$toast(data[0].message);
                this.allowSession = false;
                let obj = { sendType: 4, sendPeople: 'notice', message: data[0].message }
                this.selectUsers.data.messageList.push(obj)
            });

            //错误通知
            this.socket.on("error", (data) => {
                this.$toast(data[0].message);
            });

            //成功通知
            this.socket.on("success", (data) => {
                this.$toast(data[0].message);
            });

        },
        methods: {

            initialization() {
                //加载数据,正常流程进入此页面，会拿到数据，假如浏览器不支持或被禁止存储，或因为各种迷惑行为导致没拿到数据，直接退出登录
                if (JSON.parse(localStorage.getItem('serviceData')) != null) {
                    //此处修改对象会丢失响应式监听，不会触发视图更新，因此要显式拷贝对象
                    this.service = Object.assign({}, JSON.parse(localStorage.getItem('serviceData')))
                } else {
                    alert("道友莫要开玩笑，时代变了，您的上古浏览法器太落后了！")
                    this.loginOut();
                }
            },

            //退出登录，删除token  
            loginOut() {
                //删除vuex
                // this.$store.state.token = null;
                //删除localStorage
                localStorage.setItem('token', null);
                //去登录页面
                this.$router.push({ path: '/customerServiceLogin', replace: true })
            },
            //列表弹出选择
            onSelect() {
                this.loginOut()
            },

            //修改在线状态
            changeOnLine() {
                if (this.statechange) {
                    //客服上线
                    this.socket.emit("serviceOnline", this.service);
                } else {
                    this.socket.emit("serviceOffline", this.service);
                }

            },

            //通知条控制
            showNotice() {
                this.showNoticeBar = !this.showNoticeBar
            },

            //客服选择会话
            selectSession(obj) {
                //隐藏
                this.isSelectShow=false
                //点击之后显示聊天窗口
                this.isSelectSession = true
                //点击之后取消显示红点
                for (var i = 0; i < this.onlineUsers.length; i++) {
                    this.onlineUsers[i].data.isSelectSession = false
                    if (this.onlineUsers[i].data.userId == obj.data.userId) {
                        this.onlineUsers[i].data.UnRead = 0;
                    }
                }
                obj.data.isSelectSession = true
                //进行初始化
                this.selectUsers = {}
                //拷贝选择的用户进入新列表    
                this.selectUsers = Object.assign({}, obj)
            },

            //客服发送消息
            sendMessage(data, sendType) {
                //判断发送类型
                if (sendType === 1 && this.sendData.length <= 0) {
                    this.$toast("大哥至少说点什么吧!");
                    return;
                }
                if (sendType === 2 && this.$route.path === '/customerService') {
                    this.expressionShow = !this.expressionShow;
                }
                //向socket发送数据请求
                this.service.message = data;
                this.service.socketRoom = this.selectUsers.data.socketRoom;
                this.service.receiveId = this.selectUsers.data.receiveId;
                this.service.sendType = sendType;
                this.socket.emit("sendMessage", this.service);
                //将数据存入与这个用户的聊天信息列表
                let obj = {}
                obj.sendType = sendType;
                obj.sendPeople = 'me'
                obj.message = data;
                this.selectUsers.data.messageList.push(obj)
                //清空输入框
                this.sendData = '';
                //让聊天窗口回到底部
                this.toBottom(128)
            },

            //客服选择快捷回复
            selectReplay(text) {
                this.sendData = text;
            },
            
            //客服删除关闭列表
            closeSeesion(item) {
                this.socket.emit("closeSeesion", item);
                this.isSelectSession=false
                // this.selectUsers = {}
                this.onlineUsers=this.onlineUsers.filter((v) => v != item)
            },
            
            //接收子组件返回
            changeValue(value){
                this.service.serviceName=value;
                localStorage.setItem('serviceData', JSON.stringify(this.service))
            },

            //回到底部
            toBottom(time) {
                setTimeout(() => {
                    let RightCont = document.getElementById("RightCont");
                    if (RightCont != null) {
                        let scrollHeight2 = RightCont.scrollHeight;
                        RightCont.scrollTop = scrollHeight2;
                    }
                }, time);
                clearTimeout();
            },
            

        }
    }

</script>


<style scoped>
    @import url("../assets/css/CustomerService.css");
</style>