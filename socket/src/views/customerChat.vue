<template>
    <div class="Chat">
        <!--会话窗口-->
        <div class="customerChat">
            <div class="customerChatHead" :style="this.$store.state.bgColor">
                <div>{{ $t('text.Home.t1') }}</div>
                <div class="customerChatHeadIcon">
                    <SetLanguage></SetLanguage>
                    <img src="../assets/images/closeSeesion.png" class="closeImg" @click="closeSeesion">
                </div>
            </div>
            <!--聊天内容-->
            <MessageWindow :messageList="messageList" class="customerChatMessage" id="customerChatWindow"
                :sendId="this.$store.state.userData.userId" :receiveId="this.$store.state.userData.receiveId"
                 @retractMessage="retractMessage"></MessageWindow>
            <!--聊天框底部-->
            <div class="customerChatFoot">
                <div v-show="!allowSession" class="notAllowSeesion">
                    <div class="back" :style="this.$store.state.bgColor" @click="back">{{ $t('text.customerChat.t1') }}
                    </div>
                </div>
                <div class="customerChatTool">
                    <!--表情包-->
                    <SendEmote v-show="EmoteShow" @sendMessage="sendMessage"></SendEmote>
                    <!--工具栏-->
                    <div class="customerChatToolList">
                        <ul>
                            <li v-on:click="EmoteShow = !EmoteShow">
                                <img src="../assets/images/expression.png" />
                            </li>
                            <li v-on:click="EmoteShow = false" style="position: relative">
                                <img src="../assets/images/imageFile.png" style="width:22px ;height:22px;" />
                                <SendImage @sendMessage="sendMessage"></SendImage>
                            </li>
                        </ul>
                    </div>
                    <!--发送内容-->
                    <div style="height: calc(100% - 70px)">
                        <textarea v-on:focus="EmoteShow = false" id="dope" v-model="sendData" class="customerChatText"
                            :placeholder="textareaHit" v-on:keyup.enter="enterSend"></textarea>
                        <button class="customerChatButton" id="serviceSendBtn" v-on:click="sendMessage(sendData, 1)"
                            :style="this.$store.state.bgColor">
                            {{ $t('text.customerChat.t2') }}
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
import MessageWindow from '@/components/MessageWindow.vue';
import SendEmote from '@/components/SendEmote.vue';
import SendImage from '@/components/SendImage.vue';
import SetLanguage from '@/components/SetLanguage.vue';
export default {
    components: {
        MessageWindow,
        SendEmote,
        SendImage,
        SetLanguage
    },
    data() {
        return {
            socket: this.$store.state.socket,
            EmoteShow: false,
            sendData: '',
            allowSession: true,
            message: '',
            user: {},
            messageList: [],
            retractItem: {}
        }
    },

    mounted() {

        this.initialization();

        //接收消息
        this.socket.on("reviceMessage", (data) => {
            this.message = data.data.message;
            let obj = { sendType: data.data.sendType, sendPeople: 'other', message: data.data.message, messageId: data.data.messageId }
            this.messageList.push(obj)
            this.toBottom(128)
        });

        //接收消息返回的id
        this.socket.on("sendMessageid", (data) => {
            const index = this.findMessageIndex(this.messageList,item => item.sendPeople === 'me');
            if (index !== -1) {
                this.messageList[index].id = data.data.id
            }
        });

        //撤回成功接收
        this.socket.on("retractSuccess", (data) => {
            this.$toast(data.message)
            this.messageList = this.messageList.filter(v => v !== this.retractItem)
            let obj = { sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t8') }
            this.messageList.push(obj)
        });

        //客服撤回消息
        this.socket.on("otherRetract", (data) => {
            this.messageList = this.messageList.filter(item => item.messageId !== data.data.messageId);
            let obj = { sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t9') }
            this.messageList.push(obj)
        });

        //错误接收
        this.socket.on("error", (data) => {
            this.$toast(data.message);
        });

        //离线处理
        this.socket.on("Offline", (data) => {
            //
            //此处你可以更据data.type=='DuplicateConnection'来进一步的弹出是否要下线的通知
            //
            this.$toast(data.message);
            this.allowSession = false;
            let obj = { sendType: 4, sendPeople: 'notice', message: data.message }
            this.messageList.push(obj)
            this.textareaHit = this.$t('text.customerChat.t4')
            this.socket.close()
        });
    },
    methods: {

        initialization() {
            if (JSON.parse(localStorage.getItem('userData')) != null) {
                //此处修改对象会丢失响应式监听，不会触发视图更新，因此要显式拷贝对象
                this.user = Object.assign({}, JSON.parse(localStorage.getItem('userData')))
            } else {
                alert(this.$t('text.customerChat.t5'))
                this.$router.push({ path: '/', replace: true })
            }
            this.socket.emit('userJoin', this.user)
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

        //关闭会话
        closeSeesion() {
            this.allowSession = false;
            this.textareaHit = this.$t('text.customerChat.t6')
            this.socket.close()
        },

        //返回
        back() {
            this.$router.go(0)
        },
        //发送消息
        sendMessage(data, sendType) {
            //判断发送类型
            if (sendType === 1 && this.sendData.length <= 0) {
                this.$toast(this.$t('text.customerChat.t7'));
                return;
            }
            if (sendType === 2 && this.$route.path === '/customerChat') {
                this.EmoteShow = !this.EmoteShow;
            }
            //向socket发送数据请求
            this.user.message = data;
            this.user.sendType = sendType;
            this.socket.emit("sendMessage", this.user);
            //将数据存入与这个用户的聊天信息列表
            let obj = {}
            obj.sendType = sendType;
            obj.sendPeople = 'me'
            obj.message = data;
            this.messageList.push(obj)

            //清空输入框
            this.sendData = '';
            //让聊天窗口回到底部
            this.toBottom(128)
        },

        //撤回消息
        retractMessage(item) {
            this.retractItem = item
            let message = JSON.parse(JSON.stringify(this.user))
            message.messageId = item.id
            this.socket.emit("retractMessage", message);
        },

        //回到底部
        toBottom(time) {
            setTimeout(() => {
                let RightCont = document.getElementById("customerChatWindow");
                if (RightCont != null) {
                    let scrollHeight2 = RightCont.scrollHeight;
                    RightCont.scrollTop = scrollHeight2;
                }
            }, time);
            clearTimeout();
        },

    },
    computed: {
        textareaHit(){
            return this.$t('text.customerChat.t3')
        }
    },

}
</script>

<style scoped>
@import url("../assets/css/customerChat.css");
</style>