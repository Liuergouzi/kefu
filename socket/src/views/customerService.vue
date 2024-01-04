<template>
    <div class="serviceBody">
        <!--头部-->
        <div class="serviceHead" :style="this.$store.state.bgColor">
            <!--左-->
            <div class="serviceHeadLeft">
                <div class="serviceHeadImg">
                    <img :src="service.serviceHead" />
                </div>
                <!--昵称及修改昵称-->
                <div v-if="!changeServiceName" class="serviceHeadName" v-on:mouseenter="changeServiceName = true">
                    {{ $t('text.customerService.t1') }}{{ service.serviceName }}
                </div>
                <MyInput v-else style="margin-top: 14px" v-on:mouseleave="changeServiceName = false" :line="'1'"
                    :serviceId="service.serviceId" :serviceNameProps="service.serviceName" @changeValue="changeInputValue">
                </MyInput>

                <!--最大接待人数及修改-->
                <div v-if="!changeServiceReception" class="serviceHeadReception"
                    v-on:mouseenter="changeServiceReception = true">
                    {{ $t('text.customerService.t2') }}{{ service.serviceMax }}
                </div>
                <MyInput v-else style="margin-top: 14px" v-on:mouseleave="changeServiceReception = false" :line="'2'"
                    :serviceId="service.serviceId" :serviceMaxProps="service.serviceMax" @changeValue="changeInputValue">
                </MyInput>

                <div class="serviceHeadNameNone" style="margin-left:10px;margin-right:10px">
                    {{ $t('text.customerService.t3') }}
                    {{ service.serviceFrequency }}
                </div>
                <div style="margin-top: 13px; margin-left: 5px">
                    <van-switch v-model="stateChange" size="24px" v-on:click="changeOnLine">
                        <template #node>
                            <div class="icon-wrapper">
                                <van-icon :name="stateChange ? 'success' : 'cross'"></van-icon>
                            </div>
                        </template>
                    </van-switch>
                </div>
                <div class="serviceStateDiv">
                    <div :class="stateChange ? 'serviceStateGreenDot' : 'serviceStateRedDot'"></div>
                    {{ stateChange ? $t('text.customerService.t4') : $t('text.customerService.t5') }}
                </div>

            </div>

            <!--中-->
            <div class="serviceHeadCenter">
                <van-notice-bar v-if="showNoticeBar" left-icon="volume-o" delay="0" scrollable
                    :text="$t('text.customerService.t6')" mode="closeable">
                </van-notice-bar>
            </div>

            <!--右-->
            <div class="serviceHeadRight">
                <div style="position: relative;padding-right: 15px;">
                    <img src="../assets/images/message.png" style="width: 25px;height: 25px;cursor: pointer"
                        @click="offMsgDialogShow = !offMsgDialogShow">
                    <div v-show="offMessageCount > 0" class="off_read">
                        {{ offMessageCount > 99 ? "99+" : offMessageCount }}
                    </div>
                </div>
                <SetLanguage></SetLanguage>
                <div style="margin-top:5px">
                    <van-popover v-model:show="isPopover" :actions="[{ text: this.$t('text.customerService.t17') }]"
                        @select="onSelect()">
                        <template #reference>
                            <van-button type="primary"><img src="../assets/images/setting.png"></van-button>
                        </template>
                    </van-popover>
                </div>
                <van-dialog v-model:show="offMsgDialogShow" style="color: black;" confirm-button-color="#30bcbc"
                    closeOnPopstate width="400px">
                    <div class="offMessageList">
                        <van-list v-model:loading="userOfflineMessage.offlineLoading"
                            :finished="userOfflineMessage.offlineFinished" :finished-text="$t('text.customerService.t23')"
                            @load="selectOfflineMessage">
                            <div v-for="item in userOfflineMessageList" :key="item" class="offMessageItem"
                                @click="goToUserOffMsg(item)">
                                <div>{{ item.data.userName }}:</div>
                                <div style="padding-left: 10px;">
                                    <div style="padding: 10px 0px;" v-if="item.data.sendType == '1'">{{
                                        item.data.sendMessage
                                    }}</div>
                                    <img style="padding: 10px 0px;max-width: 50px;margin-right: 50px;" v-else
                                        :src="item.data.sendMessage" />
                                    <div style="color: gray;font-size: 12px;">{{ item.data.sendTime }}</div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </van-dialog>
            </div>

        </div>
        <!--主内容-->
        <div class="context">
            <!--左边内容-->
            <div class="conLeft">

                <!--搜素框-->
                <van-search v-model="searchUserNameValue" show-action :placeholder="$t('text.customerService.t28')"
                    @clear="console.log('aa')" @search="onSearchUserName" :clearable="false">
                    <template #action>
                        <div @click="onSearchUserName">{{ $t('text.customerService.t29') }}</div>
                    </template>
                </van-search>
                <!--显示搜索的列表-->
                <ul>
                    <div class="cancelSearch" v-if="searchUserNameList.length>0" @click="searchUserNameList=[];searchUserNameValue=''">
                        取消搜索
                    </div>
                    <li :key="index" v-for="(item, index) in searchUserNameList" style="cursor: pointer;height: 50px;"
                        class="searchUserNameHover" v-on:click="selectSession(item, false)">
                        <div class="liLeft">
                            <img src="../assets/images/visitor.png" style="height: 35px;" />
                        </div>
                        <div class="liRight" style="display: flex;align-items: center;">
                            {{ item.data.userName }}
                        </div>
                    </li>
                </ul>

                <!--在线用户列表-->
                <ul>
                    <div v-show="onlineUsers.length > 0" class="conLeftTop" v-on:click="onlineShow = !onlineShow">
                        <span v-show="onlineShow">▼</span>
                        <span v-show="!onlineShow">▲</span>
                        {{ $t('text.customerService.t7') }}
                    </div>
                    <!--显示在线连接列表-->
                    <li v-show="onlineShow" :key="index" v-for="(item, index) in onlineUsers" style="cursor: pointer"
                        v-on:click="selectSession(item, false)" :class="{ isSelect: item.data.isSelectSession }"
                        v-on:mouseenter="item.CloseSession = true" v-on:mouseleave="item.CloseSession = false">
                        <div class="liLeft">
                            <img src="../assets/images/visitor.png" />
                        </div>
                        <div class="liRight">
                            <!--显示用户名-->
                            <span class="intername">{{ item.data.userName }}</span>
                            <!--显示最新一条消息-->
                            <span class="infor">
                                {{ item.data.sendType == '3' ? '[' + $t('text.customerService.t24') + ']' :
                                    item.data.sendType == '2' ? '[' + $t('text.customerService.t25') + ']' : item.data.message
                                }}
                            </span>
                            <!--显示小红点-->
                            <div v-show="item.data.UnRead > 0" class="un_read">
                                {{ item.data.UnRead > 99 ? "99+" : item.data.UnRead }}
                            </div>
                            <div class="closeSession" v-show="item.CloseSession" v-on:click.stop="closeSeesion(item)">
                                <img src="../assets/images/closeSeesion.png" style="width:12px;height:12px">
                                <div style="font-size: 12px;">{{ $t('text.customerService.t8') }}</div>
                            </div>
                        </div>
                    </li>
                </ul>

                <!--排队等待的用户列表-->
                <!-- <ul>
                    <div v-show="waitUsers.length > 0" class="conLeftTop" v-on:click="waitShow = !waitShow">
                        <span v-show="waitShow">▼</span>
                        <span v-show="!waitShow">▲</span>
                        排队用户
                    </div>
                    <li v-show="waitShow" :key="index" v-for="(item, index) in waitUsers" class="offlineUlStyle"
                        v-on:mouseenter="item.CloseSession = true" v-on:mouseleave="item.CloseSession = false">
                        <div class="liLeft">
                            <img src="../assets/images/visitor.png" />
                        </div>
                        <div class="liRight">
                            <span class="intername">排队用户{{ index+1 }}</span>
                            <span class="closeSession" v-show="item.CloseSession" v-on:click.stop="agreeWait(item)">
                                <img src="../assets/images/agreeWait.png" style="width:12px;height:12px">
                                接入
                            </span>
                        </div>
                    </li>
                </ul> -->

                <!--离线消息会话列表-->
                <ul>
                    <div v-show="selectUserOffMsgList.length > 0" class="conLeftTopOffLine"
                        v-on:click="offMessageShow = !offMessageShow">
                        <div>
                            <span v-show="offMessageShow">▼</span>
                            <span v-show="!offMessageShow">▲</span>
                            {{ $t('text.customerService.t9') }}
                        </div>
                        <img @click.stop="userOfflineMessage.offlinePage = 1; offlineUsers = []; getOffline(true)"
                            src="../assets/images/refresh.png" style="width: 18px;height:18px;margin-right: 10px;">
                    </div>
                    <!--显示离线连接列表-->
                    <li v-show="offMessageShow" :key="index" v-for="(item, index) in selectUserOffMsgList"
                        class="offlineUlStyle" v-on:click="selectSession(item, true)"
                        v-on:mouseenter="item.CloseSession = true" :class="{ isSelect2: item.data.isSelectSession }"
                        v-on:mouseleave="item.CloseSession = false">
                        <div class="liLeft">
                            <img src="../assets/images/visitor.png" />
                        </div>
                        <div class="liRight">
                            <!--显示用户名-->
                            <span class="intername">{{ item.data.userName }}</span>
                            <!--显示最新一条消息-->
                            <span class="infor">
                                {{ item.data.sendType == '3' ? '[' + $t('text.customerService.t24') + ']' :
                                    item.data.sendType == '2' ? '[' + $t('text.customerService.t25') + ']' :
                                        item.data.message }}
                            </span>
                            <!--显示小红点-->
                            <div v-show="item.data.UnRead > 0" class="un_read">
                                {{ item.data.UnRead > 99 ? "99+" : item.data.UnRead }}
                            </div>
                            <span class="closeSession" v-show="item.CloseSession" v-on:click.stop="deleteOffLine(item)">
                                <img src="../assets/images/redClose.png" style="width:12px;height:12px">
                                {{ $t('text.customerService.t10') }}
                            </span>
                        </div>
                    </li>
                </ul>

                <!--离线用户列表-->
                <ul>
                    <div v-show="offlineUsers.length > 0" class="conLeftTopOffLine" v-on:click="offlineShow = !offlineShow">
                        <div>
                            <span v-show="offlineShow">▼</span>
                            <span v-show="!offlineShow">▲</span>
                            {{ $t('text.customerService.t27') }}
                        </div>
                        <img @click.stop="userOfflineList.offlinePage = 1; offlineUsers = []; getOffline(true)"
                            src="../assets/images/refresh.png" style="width: 18px;height:18px;margin-right: 10px;">
                    </div>
                    <!--显示离线连接列表-->
                    <van-list v-model:loading="userOfflineList.offlineLoading" :finished="userOfflineList.offlineFinished"
                        :finished-text="$t('text.customerService.t23')" @load="getOffline">
                        <li v-show="offlineShow" :key="index" v-for="(item, index) in offlineUsers" class="offlineUlStyle"
                            v-on:click="selectSession(item, true)" v-on:mouseenter="item.CloseSession = true"
                            :class="{ isSelect2: item.data.isSelectSession }" v-on:mouseleave="item.CloseSession = false">
                            <div class="liLeft">
                                <img src="../assets/images/visitor.png" />
                            </div>
                            <div class="liRight">
                                <!--显示用户名-->
                                <span class="intername">{{ item.data.userName }}</span>
                                <!--显示最新一条消息-->
                                <span class="infor">
                                    {{ item.data.sendType == '3' ? '[' + $t('text.customerService.t24') + ']' :
                                        item.data.sendType == '2' ? '[' + $t('text.customerService.t25') + ']' :
                                            item.data.message }}
                                </span>
                                <span class="closeSession" v-show="item.CloseSession" v-on:click.stop="deleteOffLine(item)">
                                    <img src="../assets/images/redClose.png" style="width:12px;height:12px">
                                    {{ $t('text.customerService.t10') }}
                                </span>
                            </div>
                        </li>
                    </van-list>
                </ul>

                <!--列表为空-->
                <div v-show="onlineUsers.length === 0 && offlineUsers.length === 0" class="noPeople">
                    <img src="../assets/images/noPeple.png" />
                    <div style="text-align: center">{{ $t('text.customerService.t11') }}</div>
                </div>
            </div>
            <!--左部->中间内容-->
            <!--没有用户连接-->
            <div v-if="onlineUsers.length === 0 && offlineUsers.length === 0" class="conRight">
                <div class="layout-empty">
                    <div class="layout-empty-conatiner">
                        <img style="width: 100px; height: auto" src="../assets/images/noPeple.png" />
                        <span>{{ $t('text.customerService.t12') }}</span>
                        <span style="color: #bdc3d1">{{ $t('text.customerService.t13') }}</span>
                    </div>
                </div>
            </div>
            <!--有用户连接，但没有点击-->
            <div v-else-if="!isSelectSession" class="conRight">
                <div class="layout-empty">
                    <div class="layout-empty-conatiner">
                        <span>{{ $t('text.customerService.t14') }}</span>
                        <span style="color: #bdc3d1">{{ $t('text.customerService.t15') }}</span>
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
                <MessageWindow v-if="isSelectSession" :messageList="selectUsers.data.messageList"
                    :sendId="service.serviceId" :receiveId="selectUsers.data.receiveId" isService
                    @retractMessage="retractMessage" :isOffline="this.selectUsers.data.isOffline"
                    :serviceHead="service.serviceHead">
                </MessageWindow>
                <!--聊天框底部-->
                <div class="RightFoot">
                    <!--<div  class="notAllowSeesion"></div>-->
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
                                v-on:keyup.enter="enterSend"></textarea>
                            <button class="sendBtn" id="serviceSendBtn" v-on:click="sendMessage(sendData, 1)"
                                :style="this.$store.state.bgColor">
                                {{ $t('text.customerService.t16') }}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <!--右边内容-->
            <ServiceRightPage @submit="selectReplay($event)" :user="selectUsers" :serviceId="service.serviceId">
            </ServiceRightPage>

        </div>
    </div>
</template>

<script>
import MyInput from '@/components/MyInput.vue';
import MessageWindow from '@/components/MessageWindow.vue';
import SendEmote from '@/components/SendEmote.vue';
import SendImage from '@/components/SendImage.vue';
import ServiceRightPage from '@/components/ServiceRightPage.vue';
import SetLanguage from '@/components/SetLanguage.vue';
import { chatListSelect, selectOfflineMessage, offlineMessageCount, resetOfflineCount, selectUserName } from '../http/api'
import config from '@/config';
import CryptoJS from 'crypto-js'

export default {

    components: {
        MyInput,
        MessageWindow,
        SendEmote,
        SendImage,
        ServiceRightPage,
        SetLanguage
    },

    data() {
        return {
            socket: this.$store.state.serviceSocket,
            service: {
                serviceId: '',
                serviceName: '',
                serviceState: 0,
                serviceFrequency: 0,
                serviceMax: 1
            },
            onlineUsers: [],
            offlineUsers: [],
            waitUsers: [],
            selectUsers: {
                data: {
                    userId: '',
                    userName: '',
                    userState: '',
                    isProhibit: '',
                    messageList: [],
                    isOffline: false
                }
            },
            isPopover: false,
            sendData: '',
            reviceMessage: '',
            changeServiceName: false,
            changeServiceReception: false,
            stateChange: false,
            showNoticeBar: false,
            onlineShow: true,
            waitShow: true,
            offlineShow: true,
            isSelectSession: false,
            expressionShow: false,
            retractItem: {},
            userOfflineList: {
                offlineLoading: false,
                offlinePage: 1,
                offlineFinished: false
            },
            userOfflineMessageList: [],
            selectUserOffMsgList: [],
            offMessageCount: 0,
            offMessageShow: true,
            userOfflineMessage: {
                offlineLoading: false,
                offlinePage: 1,
                offlineFinished: false
            },
            offMsgDialogShow: false,
            searchUserNameValue: '',
            searchUserNameList: [],

        }
    },

    mounted() {
        //初始化
        this.initialization();

        //用户连接成功通知
        this.socket.on("UserJoinSuccess", (data) => {
            let extendIndex = this.getExtend(data.data.extend).findIndex(v => v.title === 'userName')
            if (extendIndex != -1) {
                data.data.userName = this.getExtend(data.data.extend)[extendIndex].value
            }
            data.data.UnRead = 1
            data.data.message = this.$t('text.customerService.t18')
            data.data.messageList = []
            data.data.isSelectSession = false

            //用户重复连线处理
            let isNewJoinUser = this.onlineUsers.filter((v) => v.data.userId === data.data.userId)
            if (isNewJoinUser.length == 0) {
                this.onlineUsers.push(data)
                if (this.offlineUsers.length != 0) {
                    this.offlineUsers = this.offlineUsers.filter((v) => v.data.userId != data.data.userId)
                }
            }
            else {
                for (var i = 0; i < this.onlineUsers.length; i++) {
                    if (isNewJoinUser[0].data.userId == this.onlineUsers[i].data.userId) {
                        this.onlineUsers[i].data.message = this.$t('text.customerService.t19')
                        this.offlineUsers = this.offlineUsers.filter((v) => v.data.userId != data.data.userId)
                    }
                }
            }

            this.showNoticeBar = !this.showNoticeBar
            this.service.serviceFrequency = this.service.serviceFrequency + 1;
            //设置10秒后自动取消通知条
            setTimeout(this.showNotice, 10000);
        });

        //接收消息
        this.socket.on("reviceMessage", (data) => {
            for (var i = 0; i < this.onlineUsers.length; i++) {
                if (this.onlineUsers[i].data.userId == data.data.userId) {
                    //添加红点
                    this.onlineUsers[i].data.UnRead = this.onlineUsers[i].data.UnRead + 1;
                    //左侧列表信息更新
                    this.onlineUsers[i].data.message = data.data.message;
                    this.onlineUsers[i].data.sendType = data.data.sendType
                    //新创建一个列表，将信息存入列表，用于聊天窗口循环
                    let obj = {
                        sendType: data.data.sendType,
                        sendPeople: 'other',
                        message: data.data.message,
                        messageId: data.data.messageId
                    };
                    this.onlineUsers[i].data.messageList.push(obj)
                }
            }
            this.reviceMessage = data.data.message;
            this.toBottom(128)
        });

        //接收发送消息返回的id
        this.socket.on("sendMessageid", (data) => {
            const index = this.findMessageIndex(this.selectUsers.data.messageList, item => item.sendPeople === 'me');
            if (index !== -1) {
                this.selectUsers.data.messageList[index].id = data.data.id
            }
        });

        //撤回成功接收
        this.socket.on("retractSuccess", (data) => {
            this.$toast(data.message)
            this.selectUsers.data.messageList = this.selectUsers.data.messageList.filter(v => v !== this.retractItem)
            let obj = { sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t8') }
            this.selectUsers.data.messageList.push(obj)
        });

        //对方撤回消息
        this.socket.on("otherRetract", (data) => {
            const index = this.onlineUsers.findIndex(v => v.data.userId === data.data.userId)
            if (index != -1) {
                let obj = { sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t9') }
                this.onlineUsers[index].data.messageList.push(obj)
                const messageIndex = this.onlineUsers[index].data.messageList.findIndex(v => v.messageId === data.data.messageId)
                if (index != -1) {
                    this.onlineUsers[index].data.messageList[messageIndex].isRetract = 1
                }
            }
        });

        //离线处理
        this.socket.on("Offline", (data) => {
            this.$toast(data.message);
            let obj = { sendType: 4, sendPeople: 'notice', message: data.message }
            this.selectUsers.data.messageList.push(obj)
            //删除在线列表，加入离线列表
            let offline = this.onlineUsers.filter((v) => v.data.userId == data.data.userId)[0]
            if (offline != undefined) {
                this.offlineUsers.unshift(this.onlineUsers.filter((v) => v.data.userId == data.data.userId)[0])
                this.onlineUsers = this.onlineUsers.filter((v) => v.data.userId != data.data.userId)
            }
        });

        //错误通知
        this.socket.on("error", (data) => {
            this.$toast(data.message);
        });

        //成功通知
        this.socket.on("success", (data) => {
            this.$toast(data.message);
        });

    },
    methods: {


        initialization() {
            //加载数据,正常流程进入此页面，会拿到数据，假如浏览器不支持或被禁止存储，或因为各种迷惑行为导致没拿到数据，直接退出登录
            if (JSON.parse(localStorage.getItem('serviceData')) != null) {
                //此处修改对象会丢失响应式监听，不会触发视图更新，因此要显式拷贝对象
                this.service = Object.assign({}, JSON.parse(localStorage.getItem('serviceData')))
                //获取上次选择的上线状态
                if (JSON.parse(localStorage.getItem('stateChange')) != null) {
                    this.stateChange = JSON.parse(localStorage.getItem('stateChange'))
                    if (this.stateChange)
                        this.socket.emit("serviceOnline", this.service);
                }

                this.getOffMessageCount()
            } else {
                alert(this.$t('text.customerService.t20'))
                this.loginOut();
            }
        },

        //退出登录，删除token  
        loginOut() {
            if (this.stateChange) {
                //客服下线
                this.socket.emit("serviceOffline", this.service);
            }
            //删除vuex
            // this.$store.state.token = null;
            //刷新页面
            setTimeout(()=>{this.$router.go(0)},200)
            //删除localStorage
            localStorage.setItem('token', null);
            //去登录页面
            setTimeout(()=>{this.$router.push({ path: '/customerServiceLogin', replace: true })},800)
        },
        //列表弹出选择
        onSelect() {
            this.loginOut()
        },

        //寻找相匹配数组最后一个的索引
        findMessageIndex(array, callback) {
            for (let i = array.length - 1; i >= 0; i--) {
                if (callback(array[i])) {
                    return i;
                }
            }
            return -1;
        },

        //获取离线列表
        getOffline(showToast) {
            this.userOfflineList.offlineLoading = true
            chatListSelect({ serviceId: this.service.serviceId, page: this.userOfflineList.offlinePage }).then(response => {
                let requestList = []
                response.forEach(element => {
                    element.message = element.sendmessage
                    element.messageList = []
                    element.receiveId = element.userId
                    element.socketRoom = ''
                    element.isSelectSession = false
                    requestList.push({ data: element })
                });
                this.offlineUsers = [...this.offlineUsers, ...requestList]
                this.userOfflineList.offlinePage = this.userOfflineList.offlinePage + 1
                if (response.length < 20) {
                    this.userOfflineList.offlineFinished = true
                    this.userOfflineList.offlineLoading = false
                }
                this.userOfflineList.offlineLoading = false
                if (showToast) {
                    this.$toast(this.$t('text.customerService.t26'));
                }
            }).catch(() => {
                this.userOfflineList.offlineLoading = false
            })
        },

        //查询离线消息
        selectOfflineMessage() {
            this.userOfflineMessage.offlineLoading = true
            selectOfflineMessage({ serviceId: this.service.serviceId, page: this.userOfflineMessage.offlinePage }).then(response => {
                let requestList = []
                response.forEach(element => {
                    element.message = element.sendMessage
                    element.messageList = []
                    element.receiveId = element.userId
                    element.socketRoom = ''
                    element.isSelectSession = false
                    requestList.push({ data: element })
                });
                this.userOfflineMessageList = [...this.userOfflineMessageList, ...requestList]
                if (response.length < 20) {
                    this.userOfflineMessage.offlineFinished = true
                    this.userOfflineMessage.offlineLoading = false
                }
                this.userOfflineMessage.offlineLoading = false
            }).catch(() => {
                this.userOfflineMessage.offlineLoading = false
            })
        },

        //查询离线消息总数
        getOffMessageCount() {
            offlineMessageCount({ serviceId: this.service.serviceId }).then((response) => {
                this.offMessageCount = response
            }).catch(error=>{
                if(error.type=='accessDenied'){
                    this.$toast(this.$t('text.customerService.t31'))
                    setTimeout(this.loginOut(),1000)
                }
            })
        },

        //修改在线状态
        changeOnLine() {
            if (this.stateChange) {
                //客服上线
                this.socket.emit("serviceOnline", this.service);
            } else {
                this.socket.emit("serviceOffline", this.service);
            }
            //存入浏览器
            localStorage.setItem('stateChange', this.stateChange);
        },

        //通知条控制
        showNotice() {
            this.showNoticeBar = !this.showNoticeBar
        },

        //同意排队用户接入
        // agreeWait(item){
        //     this.socket.emit("agreeWait", item);
        // },

        //客服选择会话
        selectSession(obj, isOffline) {
            //点击之后显示聊天窗口
            this.isSelectSession = true
            //点击之后取消显示红点
            for (var i = 0; i < this.onlineUsers.length; i++) {
                this.onlineUsers[i].data.isSelectSession = false
                if (this.onlineUsers[i].data.userId == obj.data.userId) {
                    this.onlineUsers[i].data.UnRead = 0;
                }
            }
            for (var j = 0; j < this.offlineUsers.length; j++) {
                this.offlineUsers[j].data.isSelectSession = false
            }
            obj.data.isSelectSession = true
            obj.data.isOffline = isOffline
            //进行初始化
            this.selectUsers = {}
            //拷贝选择的用户进入新列表
            this.selectUsers = Object.assign({}, obj)
            //让聊天窗口回到底部
            this.toBottom(128)
        },

        //点击离线消息，左侧列表显示离线会话
        goToUserOffMsg(item) {
            this.selectSession(item, true)
            this.offMsgDialogShow = !this.offMsgDialogShow
            this.selectUserOffMsgList = [item]
            //取消红点
            resetOfflineCount({ userId: item.data.userId }).then(() => {
                const timer = setTimeout(() => {
                    this.selectOfflineMessage()
                    this.getOffMessageCount()
                    clearTimeout(timer)
                }, 1000);
            })
        },

        //客服发送消息
        sendMessage(data, sendType) {
            //判断发送类型
            if (sendType === 1 && this.sendData.length <= 0) {
                this.$toast(this.$t('text.customerService.t21'));
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
            this.selectUsers.data.messageList.push({ sendType: sendType, sendPeople: 'me', message: data })
            if (this.selectUsers.data.isOffline) {
                this.selectUsers.data.messageList.push({ sendType: 4, sendPeople: 'notice', message: this.$t('text.customerService.t22') })
            }
            //清空输入框
            this.sendData = '';
            //让聊天窗口回到底部
            this.toBottom(128)
        },

        //撤回消息
        retractMessage(item) {
            this.retractItem = item
            let message = JSON.parse(JSON.stringify(this.service))
            message.messageId = item.id
            this.socket.emit("retractMessage", message);
        },

        //客服选择快捷回复
        selectReplay(text) {
            this.sendData = text;
        },

        //客服踢人
        closeSeesion(item) {
            this.socket.emit("closeSeesion", item);
            this.isSelectSession = false
            // this.selectUsers = {}
            this.onlineUsers = this.onlineUsers.filter((v) => v != item)
            this.offlineUsers = this.offlineUsers.filter((v) => v != item)
        },

        //客服删除关闭离线列表
        deleteOffLine(item) {
            this.isSelectSession = false
            this.offlineUsers = this.offlineUsers.filter((v) => v != item)
        },

        //接收顶部input子组件返回
        changeInputValue(value, index) {
            switch (index) {
                case 1: this.service.serviceName = value; break;
                case 2: this.service.serviceMax = value; break;
            }
            localStorage.setItem('serviceData', JSON.stringify(this.service))
        },

        //客服搜素用户
        onSearchUserName() {
            if (this.searchUserNameValue?.trim().length == 0) {
                return
            }
            selectUserName({ userName: this.searchUserNameValue, serviceId: this.service.serviceId }).then((data) => {
                if (data.length == 0) {
                    this.$toast(this.$t('text.customerService.t30'));
                }
                let requestList = []
                data.forEach(element => {
                    element.message = element.sendmessage
                    element.messageList = []
                    element.receiveId = element.userId
                    element.socketRoom = ''
                    requestList.push({ data: element })
                });
                this.searchUserNameList = requestList
            })
        },

        //解析扩展值
        getExtend(extend) {
            if (extend && extend != '') {
                try {
                    let data = this.aesDecrypt(extend)
                    if (data && data != '') {
                        return this.convert(JSON.parse(data))
                    } else {
                        return []
                    }
                } catch (error) {
                    return []
                }
            } else {
                return []
            }
        },
        aesDecrypt(encryptedData) {
            let decrypted = CryptoJS.AES.decrypt(encryptedData, config.aesKey, {
                iv: config.aesIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        },
        convert(obj) {
            const result = [];
            for (let key in obj) {
                result.push({
                    title: key,
                    value: obj[key]
                });
            }
            return result;
        },

        //回到底部
        toBottom(time) {
            setTimeout(() => {
                let RightCont = document.getElementById("messageComponent");
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