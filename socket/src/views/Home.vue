<template>
    <div class="userBody">
        <!-- <div id="btn_open" class="openChat" v-on:click="isDisplay = !isDisplay">
            <i class="openChatIcon"></i>
            <i class="openChatline"></i>
            <span class="openChatText">{{ $t('text.Home.t1') }}</span>
        </div> -->
        <div class="userWindow" id="userWindow" v-show="isDisplay">
            <div class="userHead" :style="this.$store.state.bgColor">

                <div class="userHeadInfo">
                    <img class="userHeadImg" src="../assets/images/logo.png">
                    <div class="userHeadTitle">
                        <div class="userHeadName">{{ $t('text.webName') }}</div>
                        <div class="userHeadDetail">{{ $t('text.Home.t2') }}</div>
                    </div>
                </div>

                <span class="headSpan">
                    <img v-if="false" class="headTap" src="../assets/images/homeSetting.png"
                        @click="showPopup = !showPopup">
                    <!--<img class="headTap" src="../assets/images/TurnOnSound.png">-->
                    <!--<img class="headTap" src="../assets/images/enlarge.png">-->
                    <SetLanguage></SetLanguage>
                    <input class="headTap" type="color" v-on:click="changeBg" v-model="bgColor">
                    <!-- <img class="headTap" src="../assets/images/close.png" v-on:click="isDisplay = !isDisplay"> -->
                </span>

            </div>

            <!--信息窗口-->
            <HomeAiChat :messageList="messageList" id="userMessage" class="userMessage" @waitCancel="waitCancel"
                style="display:inline-block" :specifyServiceList="specifyServiceList" @specifyConnection="specifyConnection">
            </HomeAiChat>

            <!--底部发送-->
            <div class="customerChatFootDiv">
                <div v-show="!allowSession" class="notAllowSeesion"></div>
                <div class="customerChatTool">
                    <!--工具栏-->
                    <div class="customerChatToolList">
                        <ul>
                            <li v-on:click="openSpecify" style="position: relative">
                                <img src="../assets/images/labour.png" />
                            </li>
                            <li v-on:click="toLabor" style="position: relative">
                                <img src="../assets/images/random.png" />
                            </li>
                            <li v-on:click="showComment" style="position: relative">
                                <img src="../assets/images/comments.png" />
                            </li>
                        </ul>
                    </div>

                    <!--发送内容-->
                    <div style="height: calc(100% - 70px)">
                        <textarea v-model="sendData" class="customerChatText" :style="this.$store.state.textColor"
                            :placeholder="$t('text.Home.t4')" v-on:keyup.enter="enterSend"></textarea>
                        <button class="customerChatButton" v-on:click="sendMessage(sendData, 1, 'me')"
                            :style="this.$store.state.bgColor">
                            {{ $t('text.Home.t3') }}
                        </button>
                    </div>
                </div>
            </div>

            <van-action-sheet v-model:show="specifyServiceShow" title="请选择客服" style="position: absolute;">
                <div class="specifyService">
                    <van-list v-model:loading="specifyLoading" :finished="specifyFinished"
                        :finished-text="$t('text.customerService.t23')" @load="getSpecifyData">
                        <div v-for="item in specifyServiceList" :key="item" class="specifyDiv">
                            <div class="specifyLeft">
                                <img :src="item.serviceHead" class="specifyHead">
                                <div class="specifyName">{{ item.serviceName }}</div>
                                <div class="specifyState">
                                    <div :class="item.isOnLine ? 'serviceStateGreenDot' : 'serviceStateRedDot'"></div>
                                    {{ item.isOnLine ? $t('text.customerService.t4') : $t('text.customerService.t5') }}
                                </div>
                            </div>

                            <div class="specifyJoin" :style="this.$store.state.bgColor"
                                v-on:click="specifyConnection(item)">选择</div>

                        </div>
                    </van-list>
                </div>
            </van-action-sheet>

        </div>
    </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2';
import JSEncrypt from 'jsencrypt';
import SetLanguage from '@/components/SetLanguage.vue';
import HomeAiChat from '@/components/HomeAiChat.vue';
let encryptor = new JSEncrypt();
import {selectdefaultProblem,selectService} from '../http/api'
import config from '@/config';
import CryptoJS from 'crypto-js'

export default {
    name: 'HomeView',
    components: {
        SetLanguage,
        HomeAiChat
    },
    data() {
        return {
            isDisplay: true,
            bgColor: '#30bcbc',
            socket: this.$store.state.socket,
            user: {
                userId: '',
                userName: '',
                userState: 0,
                isService: 0,
                isProhibit: 0
            },
            socketRoom: '',
            message: '',
            messageList: [],
            sendData: '',
            allowSession: true,
            showPopup: false,
            oldSendData: '',
            speed: 110,
            specifyServiceShow: false,
            specifyServiceList: [],
            specifyLoading: false,
            specifyFinished: false,
            specifyPage: 1,
            serviceType:null,
        }
    },

    mounted() {

        this.initialization();
        //错误通知返回
        this.socket.on("error", (data) => {
            this.$toast(data.message);
        });

        //客服最大接待人数已满的情况
        this.socket.on("ServiceFull", (data) => {
            this.$toast(data.message);
            let noticeData = { sendPeople: 'notice', sendType: 4, waitCount: data.data.waitCount }
            this.messageList.push(noticeData)
        });

        //等待客服，更新排队次序
        this.socket.on("WaitCountState", () => {
            let length = this.messageList.length - 1
            this.messageList[length].waitCount = this.messageList[length].waitCount - 1
            if (this.messageList[length].waitCount == 0) {
                this.socket.emit("waitSuccess", this.user);
                this.toLabor()
            }
        });

        //接收等待时成功的通知
        // this.socket.on("WaitSuccess", () => {
        //     console.log("同意")
        // });

        //假如等待的过程中客服离线了，取消排队
        this.socket.on("WaitServiceOffline", (data) => {
            this.messageList.pop()
            let noticeData = { sendPeople: 'notice', sendType: 5, message: data.message }
            this.messageList.push(noticeData)
        });

        //访问注册
        this.socket.on("visitReturn", (data) => {
            this.user = JSON.parse(data.data)
        });
        this.socket.on("visitInsertReturn", (data) => {
            this.user = JSON.parse(JSON.stringify(data.data))
        });

        //连接客服成功通知
        this.socket.on("linkServiceSuccess", (data) => {
            this.socketRoom = data.data.socketRoom;
            this.$toast(data.data.serviceName + this.$t('text.Home.t5'));
            //数据存储到localStorage
            let obj = JSON.parse(JSON.stringify(this.user))
            obj.socketRoom = this.socketRoom;
            obj.receiveId = data.data.receiveId;
            obj.serviceName = data.data.serviceName;
            obj.serviceHead = data.data.serviceHead;
            obj.isOnLine = true
            obj.extend =this.$router.currentRoute._value.query.extend?.replace(/ /g,"+")
            localStorage.setItem('userData', JSON.stringify(obj));
            //设置vuex
            this.$store.state.userData = obj;
            //页面跳转
            this.$router.push({ path: '/customerChat', replace: false })
        });

        //监听连接指定客服，不在线的情况下
        this.socket.on("nullSpecifyService", (data) => {
            //数据存储到localStorage
            let obj = JSON.parse(JSON.stringify(this.user))
            obj.receiveId = data.data.receiveId;
            obj.serviceName = data.data.serviceName;
            obj.serviceHead = data.data.serviceHead;
            obj.isOnLine = false
            obj.extend =this.$router.currentRoute._value.query.extend?.replace(/ /g,"+")
            localStorage.setItem('userData', JSON.stringify(obj));
            //设置vuex
            this.$store.state.userData = obj;
            //页面跳转
            this.$router.push({ path: '/customerChat', replace: false })
        })
    },
    methods: {

        initialization() {
            localStorage.setItem("extendRouter", this.$router.currentRoute._value.fullPath)
            //获取浏览器指纹并发送初始数据
            let extend = this.$router.currentRoute._value.query.extend?.replace(/ /g,"+")
            let extendData = this.getExtend(extend)
            let extendServiceType=extendData.filter(v => v.title === 'serviceType')
            let extendList = extendData.filter(v => v.title === 'userName')
            if(extendServiceType.length>0){
                this.serviceType=extendServiceType[0].value
            }
            Fingerprint2.get((components) => {
                const values = components.map(function (component, index) {
                    if (index === 0) {
                        //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
                        return component.value.replace(/\bNetType\/\w+\b/, '')
                    }
                    return component.value
                })
                // 生成最终浏览器指纹
                const murmur = Fingerprint2.x64hash128(values.join(''), 31);
                this.user.userId = murmur;
                localStorage.setItem('userId', murmur);

                if (extendList.length > 0) {
                    this.user.userName = extendList[0].value
                } else {
                    this.user.userName = this.$t('text.Home.t6') + murmur.slice(0, 6);
                }
                this.user.extend = extend == undefined ? '' : extend
                this.socket.emit("visit", this.user);
                this.getSpecifyData()
            })

            this.socket.emit("getPublicKey");
            //接收公钥
            this.socket.on("returnPublicKey", (data) => {
                let publicKey = JSON.stringify(data.data).replace(/\\r\\n/g, '');
                encryptor.setPublicKey(publicKey);
            });

            //查询问题
            selectdefaultProblem().then(response=>{
                this.messageList = [
                        {
                            sendType: 2,
                            sendPeople: 'other',
                            message: response.filter(v => v.type == 'title'),
                            problem: response.filter(v => v.type == 'problem'),
                            reply: response.filter(v => v.type == 'reply')
                        }
                    ]
            })
        },

        //加载客服列表数据
        getSpecifyData() {
            this.specifyLoading = true
            selectService({ page: this.specifyPage,serviceType:this.serviceType }).then(response=>{
                this.specifyServiceList = [...this.specifyServiceList, ...response]
                this.specifyPage = this.specifyPage + 1
                if (response.length < 10) {
                    this.specifyFinished = true
                    this.specifyLoading = false
                }
                this.specifyLoading = false
            }).catch(() => {
                this.specifyLoading = false
            })
        },

        //打开客服选择列表
        openSpecify() {
            this.specifyServiceShow = !this.specifyServiceShow
            this.specifyServiceList = []
            this.specifyPage = 1
            this.specifyFinished = false
        },

        //连接指定客服
        specifyConnection(item) {
            let obj = JSON.parse(JSON.stringify(this.user))
            obj.serviceId = item.serviceId
            obj.serviceName = item.serviceName
            obj.serviceHead = item.serviceHead
            this.socket.emit("specifyConnection", obj);
        },

        //随机转人工
        toLabor() {
            this.socket.emit("toLabor", this.user);
        },

        //取消排队
        waitCancel() {
            this.messageList.pop()
            //请求删除排队用户
            this.socket.emit("waitCancel", this.user);
        },


        //消息发送
        sendMessage(data, sendType, sendPeople) {
            //判断空
            if (sendType === 1 && this.sendData.length <= 0) {
                this.$toast(this.$t('text.Home.t7'));
                return;
            }
            let obj = {}
            obj.sendType = sendType;
            obj.sendPeople = sendPeople;
            obj.sendSize = this.getByteLength(`(You:` + data + `\n)`) - 2;
            obj.message = data;
            this.messageList.push(obj);
            this.oldSendData = this.sendData;
            this.sendData = '';
        },

        //文字打印
        typing(text) {
            var messageLength = this.messageList.length - 1;
            var contentArr = text.split("");
            var content = "";
            var index = 0;
            var ID = setInterval(() => {
                content += contentArr[index];
                this.messageList[messageLength].message = content + "_";
                index++;
                if (index === contentArr.length) {
                    this.messageList[messageLength].message = content;
                    clearInterval(ID);
                    this.toBottom(128)
                }
                if (index % 20 == 0) {
                    this.toBottom(128)
                }
            }, this.speed);
        },

        //获取大小
        getByteLength(str) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len += 2;
                } else {
                    len++;
                }
            }
            return len;
        },


        //回到底部
        toBottom(time) {
            setTimeout(() => {
                let RightCont = document.getElementById("userMessage");
                if (RightCont != null) {
                    let scrollHeight2 = RightCont.scrollHeight;
                    RightCont.scrollTop = scrollHeight2;
                }
            }, time);
            clearTimeout();
        },

        //跳转留言
        showComment() {
            this.$router.push({ path: '/comment', replace: false })
        },

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

        // //判断是否PC端
        isPC() {
            //是否为PC端
            var userAgentInfo = navigator.userAgent;
            var Agents = [
                "Android",
                "iPhone",
                "SymbianOS",
                "Windows Phone",
                "iPad",
                "iPod",
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },

    },
    watch: {
        //改变全局背景
        bgColor: {
            handler(newValue) {
                this.$store.state.bgColor = 'background:' + newValue
                this.$store.state.textColor = 'color:' + newValue
            }
        },
    }


}
</script>


<style scoped>
@import url("../assets/css/Home.css");
</style>