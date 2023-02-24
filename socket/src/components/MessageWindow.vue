<template>
    <div class="RightCont">
        <div v-if="lastSession" class="noticeDiv">
            <div class="moreSession" v-on:click="selectMessage">
                加载更多
            </div>
        </div>
        <!--消息接收-->
        <div :key="index" v-for="(item, index) in messageList_copy">
            <!--别人-->
            <div class="customerServiceDiv" v-if="item.sendPeople == 'other'">
                <div class="answerHead">
                    <img v-if="isService == 'true'" src="../assets/images/visitor.png" />
                    <img v-else src="../assets/images/service_head.png" />
                </div>
                <div v-if="item.sendType == 1" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    {{ item.message }}
                </div>
                <div v-else-if="item.sendType == 2" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <img v-bind:src="item.message" />
                </div>
                <div v-else-if="item.sendType == 3" class="SendImage">
                    <img v-bind:src="item.message" />
                </div>
            </div>

            <!--自己-->
            <div class="myselfDiv" v-if="item.sendPeople == 'me'">
                <div v-if="item.sendType == 1" class="news">
                    <img class="jiao" src="../assets/images/radio.jpg" />
                    {{ item.message }}
                </div>
                <div v-else-if="item.sendType == 2" class="news">
                    <img class="jiao" src="../assets/images/radio.jpg" />
                    <img v-bind:src="item.message" />
                </div>
                <div v-else-if="item.sendType == 3" class="SendImage">
                    <img v-bind:src="item.message" />
                </div>
                <div class="nesHead">
                    <img v-if="isService == 'true'" src="../assets/images/service_head.png" />
                    <img v-else src="../assets/images/visitor.png" />
                </div>
            </div>

            <!--状态通知显示-->
            <div v-if="item.sendPeople == 'notice'" class="noticeDiv">
                <div class="moreSession" v-if="item.sendType == 4">
                    {{ item.message }}
                </div>
            </div>

            <div style="clear: both"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'MessageWindow',
    props: {
        messageList: Object,
        sendId: String,
        receiveId: String,
        isService: String
    },
    mounted() {

        let params = {
            sendId: this.sendId,
            receiveId: this.receiveId
        }
        //先请求查看是否有历史消息
        axios({
            method: 'post',
            url: '/selectMessage',
            data: params
        }).then((response) => {
            if (response.data[0].code) {
                let message = JSON.parse(response.data[0].data);
                if (message.length == 0) {
                    this.lastSession = false
                }
            } else {
                this.lastSession = false
            }
        })
    },
    methods: {
        selectMessage() {
            let params = {
                sendId: this.sendId,
                receiveId: this.receiveId
            }
            axios({
                method: 'post',
                url: '/selectMessage',
                data: params
            }).then((response) => {
                if (response.data[0].code) {
                    let message = JSON.parse(response.data[0].data);

                    for (var i = message.length - 1; i >= 0; i--) {
                        if (message[i].sendId == this.sendId) {
                            let obj = { sendType: message[i].sendType, sendPeople: 'me', message: message[i].sendMessage }
                            this.messageList_copy.unshift(obj)
                        } else {
                            let obj = { sendType: message[i].sendType, sendPeople: 'other', message: message[i].sendMessage }
                            this.messageList_copy.unshift(obj)
                        }
                    }
                    //对已经加载了消息的id记录下来
                    let obj = { receiveId: this.receiveId }
                    this.idIsSelect.push(obj)
                    this.lastSession = false
                } else {
                    this.lastSession = false
                    this.$toast(response.data[0].message);
                }
            })
        }
    },
    data() {
        return {
            lastSession: true,
            idIsSelect: [],
            //此处对于子组件与父组件之间的传值需要拷贝一下，父组件传值子组件实际上还是引用地址，不能直接去修改
            messageList_copy: this.messageList
        }
    },
    watch: {
        //此处需要根据客服的选择，进行实时刷新判断是否已经加载历史消息，否则可以多次加载消息，消息列表重复
        receiveId: {
            handler(newValue, oldValue) {
                console.log(oldValue)
                let listTemp = this.idIsSelect.filter((v) => v.receiveId == this.receiveId)
                if (listTemp.length == 0) {
                    this.lastSession = true
                } else {
                    this.lastSession = false
                }
                if (listTemp.length == 0 && this.lastSession) {
                    let params = {
                        sendId: this.sendId,
                        receiveId: this.receiveId
                    }
                    axios({
                        method: 'post',
                        url: '/selectMessage',
                        data: params
                    }).then((response) => {
                        if (response.data[0].code) {
                            let message = JSON.parse(response.data[0].data);
                            if (message.length == 0) {
                                this.lastSession = false
                            }
                        } else {
                            this.lastSession = false
                            this.$toast(response.data[0].message);
                        }
                    })
                }
            }
        },
        //解决父组件传值拷贝不会更新
        messageList: {
            handler() {
                this.messageList_copy = this.messageList
            }
        }
    }

}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
</style>