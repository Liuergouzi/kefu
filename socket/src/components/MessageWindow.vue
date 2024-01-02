<template>
    <div class="RightCont">
        <div v-if="lastSession" class="noticeDiv">
            <div class="moreSession" v-on:click="selectMessage">
                {{ $t('text.MessageWindow.t1') }}
            </div>
        </div>

        <div class="noticeDiv">
            <div class="hitSession" v-on:click="selectMessage">
                {{ isService ? isOffline?$t('text.MessageWindow.t5'):$t('text.MessageWindow.t4') : $t('text.MessageWindow.t2') }}
            </div>
        </div>

        <!--消息接收-->
        <div :key="index" v-for="(item, index) in messageList_copy"
            style="display: flex;flex-wrap: wrap;padding-bottom: 10px;">
            <!--别人-->

            <div class="customerServiceDiv" v-if="item.sendPeople == 'other'">

                <div class="answerHead">
                    <img v-if="isService" src="../assets/images/visitor.png" />
                    <img v-else :src="serviceHead" />
                </div>

                <div v-if="item.sendType == 1 && item.isRetract != 1" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    {{ item.message }}
                </div>
                <div v-else-if="item.sendType == 2 && item.isRetract != 1" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <img v-bind:src="item.message" />
                </div>
                <div v-else-if="item.sendType == 3 && item.isRetract != 1" class="SendImage" @click="imagePreview(item.message)">
                    <img v-bind:src="item.message" />
                </div>

                <div v-if="item.isRetract == 1" class="retract" :style="this.$store.state.bgColor"
                    @click="item.isRetract = 0">
                    {{ $t('text.MessageWindow.t6') }}
                </div>

            </div>


            <!--自己-->
            <div class="myselfDiv" v-if="item.sendPeople == 'me'">
                <van-popover v-model:show="item.showRetract" :actions="item.sendType == 3?actionsTwo:actions" @select="retractSelect($event,item)">
                    <template #reference>
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
                    </template>
                </van-popover>
                <div class="nesHead">
                    <img v-if="isService" :src="serviceHead" />
                    <img v-else src="../assets/images/visitor.png" />
                </div>
            </div>

            <!--状态通知显示-->
            <div v-if="item.sendPeople == 'notice'" class="noticeDiv">
                <div class="moreSession" v-if="item.sendType == 4">
                    {{ item.message }}
                </div>
            </div>

            <!--历史时间显示-->
            <div v-if="isShowHistoryTime" class="noticeDiv">
                <div class="moreSession" v-if="item.sendTime">
                    {{ item.sendTime }}
                </div>
            </div>

            <div style="clear: both"></div>
        </div>
    </div>
</template>

<script>
import {selectMessage} from '../http/api'
import { ImagePreview } from 'vant';
import 'vant/es/image-preview/style';

export default {
    name: 'MessageWindow',
    emits: ['retractMessage'],
    props: {
        messageList: Object,
        sendId: String,
        receiveId: String,
        isService: Boolean,
        isOffline:Boolean,
        serviceHead:String
    },
    data() {
        return {
            lastSession: false,
            idIsSelect: [],
            //此处对于子组件与父组件之间的传值需要拷贝一下，父组件传值子组件实际上还是引用地址，不能直接去修改
            messageList_copy: this.messageList,
            isShowHistoryTime: false,
            timeOutEvent: 0,
        }
    },
    mounted() {
        this.selectMessage()
    },
    methods: {        

        //消息撤回
        retractSelect(event,item) {
            if(event.id==1){
                return this.$emit('retractMessage', item)
            }
            if(event.id==2){
                this.imagePreview(item.message)
            }
        },

        //查询历史消息
        selectMessage() {
            let params = {
                sendId: this.sendId,
                receiveId: this.receiveId,
                isService: this.isService
            }
            selectMessage(params).then(
                (response) => {
                    let message = response
                    let lasTime = new Date()
                    this.messageList_copy.length = 0
                    for (var i = message.length - 1; i >= 0; i--) {
                        let newTime
                        if (this.isOverTime(message[i].sendTime, lasTime)) {
                            newTime = message[i].sendTime
                            lasTime = message[i].sendTime
                        } else {
                            newTime = null
                        }

                        if (message[i].sendId == this.sendId) {
                            let obj = message[i].isRetract == 1 ?
                                {
                                    sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t8'),
                                    sendTime: newTime, isRetract: message[i].isRetract,id:message[i].id
                                }
                                :
                                {
                                    sendType: message[i].sendType, sendPeople: 'me', message: message[i].sendMessage,
                                    sendTime: newTime, isRetract: message[i].isRetract,id:message[i].id
                                }
                            this.messageList_copy.unshift(obj)
                        } else {
                            let obj
                            if (!this.isService) {
                                obj = message[i].isRetract == 1 ?
                                    {
                                        sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t9'),
                                        sendTime: newTime, isRetract: message[i].isRetract,id:message[i].id
                                    }
                                    :
                                    {
                                        sendType: message[i].sendType, sendPeople: 'other', message: message[i].sendMessage,
                                        sendTime: newTime, isRetract: message[i].isRetract,id:message[i].id
                                    }
                            } else {
                                obj = {
                                    sendType: message[i].sendType, sendPeople: 'other', message: message[i].sendMessage,
                                    sendTime: newTime, isRetract: message[i].isRetract,id:message[i].id
                                }
                            }

                            this.messageList_copy.unshift(obj)
                        }
                    }
                    //对已经加载了消息的id记录下来
                    let obj = { receiveId: this.receiveId }
                    this.idIsSelect.push(obj)
                    this.lastSession = false
                    this.isShowHistoryTime = true
                }
            )
        },
        //时间对比是否超过1小时，否则彼此之间不显示时间
        isOverTime(time1, time2) {
            const t1 = new Date(time1);
            const t2 = new Date(time2);
            const diff = t1 - t2; // 计算时间差值
            const hours = Math.abs(diff / 1000 / 60 / 60); // 计算小时数
            return hours > 1;
        },
        //图片预览
        imagePreview(src){
            ImagePreview({images:[src],closeable: true,})
        }
    },

    watch: {
        //此处需要根据客服的选择，进行实时刷新判断是否已经加载历史消息，否则可以多次加载消息，消息列表重复
        receiveId: {
            handler() {
                let listTemp = this.idIsSelect.filter((v) => v.receiveId == this.receiveId)
                if (listTemp.length == 0) {
                    this.lastSession = true
                } else {
                    this.lastSession = false
                }
                if (listTemp.length == 0 && this.lastSession) {
                    this.selectMessage()
                }
            }
        },
        //解决父组件传值拷贝不会更新
        messageList: {
            handler() {
                this.messageList_copy = this.messageList
            }
        }
    },
    computed: {
        actions() {
            return [
                { text: this.$t('text.MessageWindow.t3') },
            ];
        },
        actionsTwo() {
            return [
                { id:1,text: this.$t('text.MessageWindow.t3') },
                { id:2,text: this.$t('text.MessageWindow.t7') },
            ];
        },
    }
}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
</style>