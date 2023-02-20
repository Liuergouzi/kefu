<template>

    <div class="Chat">
    <!--会话窗口-->
    <div class="customerChat">
        <div class="customerChatHead" :style="this.$store.state.bgColor">轮子哥在线客服</div>
        <!--聊天内容-->
        <MessageWindow  :messageList="messageList" class="customerChatMessage" :sendId="this.$store.state.userData.userId" :receiveId="this.$store.state.userData.receiveId" :isService="'false'"></MessageWindow>
        <!--聊天框底部-->
        <div class="customerChatFoot">
            <div v-show="!allowSession" class="notAllowSeesion"></div>
            <div class="customerChatTool">
                <!--表情包-->
                <SendEmote v-show="EmoteShow" @sendMessage="sendMessage"></SendEmote>
                <!--工具栏-->
                <div class="customerChatToolList">
                    <ul>
                        <li v-on:click="EmoteShow = !EmoteShow">
                            <img src="../assets/images/expression.png" />
                        </li>
                        <li v-on:click="EmoteShow = false"  style="position: relative">
                            <img src="../assets/images/imageFile.png" />
                            <SendImage @sendMessage="sendMessage"></SendImage>
                        </li>
                    </ul>
                </div>
                <!--发送内容-->
                <div style="height: calc(100% - 70px)">
                    <textarea v-on:focus="EmoteShow = false" id="dope" v-model="sendData" class="customerChatText"
                        :placeholder="allowSession ? '请输入会话内容' : '当前客服已离线'" v-on:keyup.enter="enterSend"></textarea>
                    <button class="customerChatButton" id="serviceSendBtn" v-on:click="sendMessage(sendData, 1)" :style="this.$store.state.bgColor">
                        发送(s)
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
    export default {
        components: {
            MessageWindow,
            SendEmote,
            SendImage
        },
        data() {
            return {
                socket: this.$store.state.socket,
                EmoteShow:false,
                sendData:'',
                allowSession:true,
                message:'',
                user:{},
                messageList:[]
            }
        },

        mounted() {
            
            this.initialization();
            
            //接收消息
            this.socket.on("reviceMessage", (data) => {
                this.message = data[0].data.message;
                let obj = { sendType: data[0].data.sendType, sendPeople: 'other', message: data[0].data.message }
                this.messageList.push(obj)
            });
            
            //错误接收
            this.socket.on("error", (data) => {
                this.$toast(data[0].message);
            });
            
            //离线处理
            this.socket.on("Offline", (data) => {
                this.$toast(data[0].message);
                this.allowSession=false;
                let obj = { sendType: 4, sendPeople: 'notice', message: data[0].message }
                this.messageList.push(obj)
            });

        },
        methods: {
            
            initialization() {
                if (JSON.parse(localStorage.getItem('userData')) != null) {
                //此处修改对象会丢失响应式监听，不会触发视图更新，因此要显式拷贝对象
                    this.user = Object.assign({}, JSON.parse(localStorage.getItem('userData')))
                } else {
                    alert("道友莫要开玩笑，时代变了，您的上古浏览法器太落后了！")
                    this.$router.push({ path: '/', replace: true })
                }
                this.socket.emit('userJoin',this.user)
            },
            
            sendMessage(data, sendType) {
                //判断发送类型
                if (sendType === 1 && this.sendData.length <= 0) {
                    this.$toast("大哥至少说点什么吧!");
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
    @import url("../assets/css/customerChat.css");
</style>