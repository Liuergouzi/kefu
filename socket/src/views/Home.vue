<template>
    <div class="userBody">
        <div id="btn_open" class="openChat" v-on:click="isDisplay = !isDisplay">
            <i class="openChatIcon"></i>
            <i class="openChatline"></i>
            <span class="openChatText">联系客服</span>
        </div>
        <div class="userWindow" id="userWindow" v-show="isDisplay">
            <div class="userHead" :style="this.$store.state.bgColor">

                <span class="headSpan">
                    <img class="headTap" src="../assets/images/homeSetting.png" @click="showPopup = !showPopup">
                    <!--<img class="headTap" src="../assets/images/TurnOnSound.png">-->
                    <!--<img class="headTap" src="../assets/images/enlarge.png">-->
                    <input class="headTap" type="color" v-on:click="changeBg" v-model="bgColor">
                    <img class="headTap" src="../assets/images/close.png" v-on:click="isDisplay = !isDisplay">
                </span>

                <div class="userHeadInfo">
                    <img class="userHeadImg" src="../assets/images/service_head.png">
                    <div class="userHeadTitle">
                        <div class="userHeadName">轮子哥客服</div>
                        <div class="userHeadDetail">予独爱造轮子而一丝不紊</div>
                    </div>
                </div>
            </div>

            <van-popup v-model:show="showPopup" position="right"
                :style="{ width: '50%', height: '100%', padding: '10px', }">
                <br>
                <p>提问最大回复量（ai回复最大字数）：</p>
                <van-slider v-model="maxTokens" :min="1000" :max="3500">
                    <template #button>
                        <div class="custom-button">{{ maxTokens }}</div>
                    </template>
                </van-slider>
                <br>
                <p>语义联系最大量（决定最多关联多少上下文）：</p>
                <van-slider v-model="maxTokens" :min="1000" :max="3500" disabled reverse>
                    <template #button>
                        <div class="custom-button">{{ 4096 - maxTokens }}</div>
                    </template>
                </van-slider>
                <br>
                <p>打字速度（数值越高越慢）：</p>
                <van-slider v-model="speed" :min="0" :max="3000">
                    <template #button>
                        <div class="custom-button">{{ speed }}</div>
                    </template>
                </van-slider>
                <br>
                <p>控制流（ai回复速度有点差别）：</p>
                <van-switch v-model="isStream"></van-switch>
                <br>
            </van-popup>

            <!--信息窗口-->
            <ChatGPTWindow :messageList="messageList" id="userMessage" class="userMessage" style="display:inline-block">
            </ChatGPTWindow>

            <!--底部发送-->
            <div class="customerChatFootDiv">
                <div v-show="!allowSession" class="notAllowSeesion"></div>
                <div class="customerChatTool">
                    <!--工具栏-->
                    <div class="customerChatToolList">
                        <ul>
                            <li v-on:click="toLabor" style="position: relative">
                                <img src="../assets/images/labour.png" />
                            </li>
                            <li v-on:click="showComment" style="position: relative">
                                <img src="../assets/images/comments.png" />
                            </li>
                        </ul>
                    </div>

                    <!--发送内容-->
                    <div style="height: calc(100% - 70px)">
                        <textarea v-model="sendData" class="customerChatText" :style="this.$store.state.textColor"
                            :placeholder="allowSession ? '道友，请传音' : footHit" v-on:keyup.enter="enterSend"></textarea>
                        <button class="customerChatButton" v-on:click="sendMessage(sendData, 1, 'me')"
                            :style="this.$store.state.bgColor">
                            发送(s)
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Fingerprint2 from 'fingerprintjs2';
import JSEncrypt from 'jsencrypt';
import ChatGPTWindow from '@/components/ChatGPTWindow.vue';
import axios from 'axios';
let encryptor = new JSEncrypt();
export default {
    name: 'HomeView',
    components: {
        ChatGPTWindow
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
            maxTokens: 2048,
            allowSession: true,
            showPopup: false,
            isStream: true,
            netCount: 0,
            footHit: '...请耐心等待,轮子哥正在为你火速加载中...',
            oldSendData: '',
            speed: 110,
            loadLoop: function () { },
        }
    },

    mounted() {
        this.initialization();
        //错误通知返回
        this.socket.on("error", (data) => {
            this.$toast(data[0].message);
        });

        //客服最大接待人数已满的情况
        this.socket.on("ServiceFull", (data) => {
            this.$toast(data[0].message);

            let noticeData={sendPeople:'notice',sendType:4,waitCount:data[0].data.waitCount}
            console.log(noticeData)
            this.messageList.push(noticeData)
        });

        //访问注册
        this.socket.on("visitReturn", (data) => {
            this.user = JSON.parse(data[0].data)
        });
        //连接客服成功通知
        this.socket.on("linkServiceSuccess", (data) => {
            this.socketRoom = data[0].data.socketRoom;
            this.$toast(data[0].data.serviceName + "为您服务");
            //数据存储到localStorage
            this.user.socketRoom = this.socketRoom;
            this.user.receiveId = data[0].data.receiveId;
            localStorage.setItem('userData', JSON.stringify(this.user));
            //设置vuex
            this.$store.state.userData = this.user;
            //页面跳转
            this.$router.push({ path: '/customerChat', replace: false })
        });

    },
    methods: {

        initialization() {
            //获取浏览器指纹并发送初始数据
            Fingerprint2.get((components) => {
                const values = components.map(function (component, index) {
                    if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
                        return component.value.replace(/\bNetType\/\w+\b/, '')
                    }
                    return component.value
                })
                // 生成最终浏览器指纹
                const murmur = Fingerprint2.x64hash128(values.join(''), 31);
                this.user.userId = murmur;
                localStorage.setItem('userId', murmur);
                this.user.userName = "小黑子" + murmur.slice(0, 6);
                this.socket.emit("visit", this.user);
            })

            this.socket.emit("getPublicKey");
            //接收公钥
            this.socket.on("returnPublicKey", (data) => {
                let publicKey = JSON.stringify(data[0].data).replace(/\\r\\n/g, '');
                encryptor.setPublicKey(publicKey);
            });

            this.messageList.push(this.$store.state.robot[0])

        },

        //转人工
        toLabor() {
            this.socket.emit("toLabor", this.user);
        },

        ajax(sendMessage) {
            let params = { max_tokens: this.maxTokens, model: "text-davinci-003", stream: this.isStream };
            params.prompt = sendMessage;
            this.typingGoBack();
            axios({
                method: 'post',
                url: 'https://api.openai.com/v1/completions',
                data: params
            }).then((response) => {
                this.messageList[this.messageList.length - 1].message = '';
                clearInterval(this.loadLoop);
                this.allowSession = true;
                this.netCount = 0;
                this.footHit = '...请耐心等待,轮子哥正在为你火速加载中...';
                this.oldSendData = '';

                if (this.isStream) {
                    //stream: true 开启控制流，进入循环打字，凸(艹皿艹 )，回复时间貌似没有变化，白改了
                    let responseFinish;
                    let responseByte;
                    var index = 0;
                    var textLoop = setInterval(() => {
                        //分割转json再提取数据，开启控制流后需要循环获取
                        responseByte = JSON.parse(response.data.slice(5).split("data:")[index]).choices[0].text;
                        this.messageList[this.messageList.length - 1].message += responseByte;
                        //结束
                        responseFinish = JSON.parse(response.data.slice(5).split("data:")[index]).choices[0].finish_reason;
                        if (responseFinish === "stop") {
                            this.messageList[this.messageList.length - 1].sendSize = this.getByteLength(this.messageList[this.messageList.length - 1].message)
                            clearInterval(textLoop);
                            this.toBottom(128);
                        }
                        index++;
                        if (index % 20 == 0) {
                            this.toBottom(128)
                        }
                    }, 100);
                } else {
                    //stream: false 关闭控制流，
                    let text = response.data.choices[0].text.slice(0, 2)
                    if (response.data.choices[0].text.slice(0, 2) === `\n\n`) {
                        text = response.data.choices[0].text.slice(2).replace(/\n\n/g, '<br>    ');
                    } else {
                        text = response.data.choices[0].text.replace(/\n\n/g, '<br>    ');
                    }
                    //打印
                    this.typing(text);
                }
            }).catch(error => {
                clearInterval(this.loadLoop);
                this.$toast("请检查网络设置或耐心等待刷新，如果多次刷新依然无法连接成功请联系轮子哥");
                if (this.netCount <= 5) {
                    this.netCount = this.netCount + 1;
                    if (this.oldSendData != '') {
                        this.footHit = "——————网络异常，第" + this.netCount + "次重新发送——————";
                        this.ajax(this.oldSendData);
                    } else {
                        this.footHit = "——————网络连接异常，第" + this.netCount + "次尝试重新连接，请耐心等待——————";
                        this.allowSession = true
                    }
                } else {
                    this.$toast("网络异常，请刷新后重试！");
                    this.footHit = "网络异常，请刷新后重试！";
                }
                console.log(JSON.stringify(error))
            })
        },

        sendMessage(data, sendType, sendPeople) {
            //判断空
            if (sendType === 1 && this.sendData.length <= 0) {
                this.$toast("道友这般寡言可着实令人难堪！");
                return;
            }
            var sendText = this.spliceText(data);
            let obj = {}
            obj.sendType = sendType;
            obj.sendPeople = sendPeople;
            obj.sendSize = this.getByteLength(`(You:` + data + `\n)`) - 2;
            obj.message = '';
            this.messageList.push(obj);
            if (sendType === 1) {
                this.typing(data);
            } else {
                obj.message = data;
                this.$toast("chatGPT当前暂时无法接收图片，请等待官网更新")
            }
            this.allowSession = false;
            this.oldSendData = this.sendData;
            this.sendData = '';

            this.ajax(sendText);
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

        //计算总字符数，根据字符数范围内进行上下文字体拼接
        spliceText(data) {
            var messageLength = this.messageList.length - 1;
            var totalSize = this.getByteLength(`(You:` + data + `\n)`) - 2;
            var indexOf = -1;
            for (var i = messageLength; i >= 0; i--) {
                if (totalSize < 4096 - this.maxTokens) {
                    totalSize += this.messageList[i].sendSize;
                    indexOf++;
                }
            }
            var sendText = '';
            if (indexOf >= 0) {
                this.messageList.slice(messageLength - indexOf).forEach(element => {
                    if (element.sendPeople == 'me') {
                        sendText += `(You:${element.message}\n)`;
                    } else {
                        sendText += element.message;
                    }
                });
            }
            console.log(totalSize + "索引" + indexOf + "拼接字符" + sendText + `(You:` + data + `\n)`)
            return sendText + `(You:` + data + `\n)`;
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


        //闪烁
        typingGoBack() {
            let obj = {}
            obj.sendType = 1;
            obj.sendPeople = 'other';
            obj.message = '';
            this.messageList.push(obj);
            var index = 0;
            this.loadLoop = setInterval(() => {
                switch (index % 4) {
                    case 1: this.messageList[this.messageList.length - 1].message = "☆"; break;
                    case 2: this.messageList[this.messageList.length - 1].message = "★"; break;
                    case 3: this.messageList[this.messageList.length - 1].message = "♡"; break;
                    case 4: this.messageList[this.messageList.length - 1].message = "♥"; break;
                }
                index++;
            }, 250);
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
        }

        // //判断是否PC端
        // isPC() {
        //     //是否为PC端
        //     var userAgentInfo = navigator.userAgent;
        //     var Agents = [
        //         "Android",
        //         "iPhone",
        //         "SymbianOS",
        //         "Windows Phone",
        //         "iPad",
        //         "iPod",
        //     ];
        //     var flag = true;
        //     for (var v = 0; v < Agents.length; v++) {
        //         if (userAgentInfo.indexOf(Agents[v]) > 0) {
        //             flag = false;
        //             break;
        //         }
        //     }
        //     return flag;
        // },

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