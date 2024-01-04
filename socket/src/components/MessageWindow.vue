<template>
    <div class="RightCont" id="messageComponent">
        <div v-if="lastSession" class="noticeDiv">
            <div class="moreSession" v-on:click="selectMessage">
                {{ $t('text.MessageWindow.t1') }}
            </div>
        </div>

        <div class="noticeDiv">
            <div class="hitSession" v-on:click="selectMessage">
                {{ isService ? isOffline ? $t('text.MessageWindow.t5') : $t('text.MessageWindow.t4') :
                    $t('text.MessageWindow.t2') }}
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
                <div v-else-if="item.sendType == 3 && item.isRetract != 1" class="SendImage"
                    @click="imagePreview(item.message)">
                    <img v-bind:src="item.message" />
                </div>

                <div v-if="item.isRetract == 1" class="retract" :style="this.$store.state.bgColor"
                    @click="item.isRetract = 0">
                    {{ $t('text.MessageWindow.t6') }}
                </div>

            </div>


            <!--自己-->
            <div class="myselfDiv" v-if="item.sendPeople == 'me'">
                <van-popover v-model:show="item.showRetract" :actions="item.sendType == 3 ? actionsTwo : actions"
                    @select="retractSelect($event, item)">
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
import { serviceHistoryMessage, userHistoryMessage } from '../http/api'
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
        isOffline: Boolean,
        serviceHead: String
    },
    data() {
        return {
            lastSession: false,
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
        retractSelect(event, item) {
            if (event.id == 1) {
                return this.$emit('retractMessage', item)
            }
            if (event.id == 2) {
                this.imagePreview(item.message)
            }
        },

        //查询历史消息
        selectMessage() {
            // this.messageList_copy = []
            let params = {
                sendId: this.sendId,
                receiveId: this.receiveId
            }
            if (this.isService) {
                serviceHistoryMessage(params).then((response) => {
                    this.dataHandle(response)
                })
            } else {
                userHistoryMessage(params).then((response) => {
                    this.dataHandle(response)
                })
            }
        },

        //历史消息数据处理
        dataHandle(response) {

            let lasTime = new Date()
            this.messageList_copy.length = 0
            response.reverse().forEach(item => {
                let newTime
                if (this.isOverTime(item.sendTime, lasTime)) {
                    newTime = item.sendTime
                    lasTime = item.sendTime
                } else {
                    newTime = null
                }

                if (item.sendId == this.sendId) {
                    let obj = item.isRetract == 1 ?
                        {
                            sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t8'),
                            sendTime: newTime, isRetract: item.isRetract, id: item.id
                        }
                        :
                        {
                            sendType: item.sendType, sendPeople: 'me', message: item.sendMessage,
                            sendTime: newTime, isRetract: item.isRetract, id: item.id
                        }
                    this.messageList_copy.unshift(obj)
                } else {
                    let obj
                    if (!this.isService) {
                        obj = item.isRetract == 1 ?
                            {
                                sendType: 4, sendPeople: 'notice', message: this.$t('text.customerChat.t9'),
                                sendTime: newTime, isRetract: item.isRetract, id: item.id
                            }
                            :
                            {
                                sendType: item.sendType, sendPeople: 'other', message: item.sendMessage,
                                sendTime: newTime, isRetract: item.isRetract, id: item.id
                            }
                    } else {
                        obj = {
                            sendType: item.sendType, sendPeople: 'other', message: item.sendMessage,
                            sendTime: newTime, isRetract: item.isRetract, id: item.id
                        }
                    }

                    this.messageList_copy.unshift(obj)
                }
            });
            this.isShowHistoryTime = true
            this.toBottom(128)
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
        imagePreview(src) {
            ImagePreview({ images: [src], closeable: true, })
        },

        //监听滑动
        // onScroll(e) {
        //     const scrollTop = e.target.scrollTop;
        //     const scrollHeight = e.target.scrollHeight;
        //     console.log(scrollTop,scrollHeight)
        // },

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
    },

    watch: {
        //客服切换选择加载历史消息
        receiveId: {
            handler() {
                this.selectMessage()
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
                { id: 1, text: this.$t('text.MessageWindow.t3') },
            ];
        },
        actionsTwo() {
            return [
                { id: 1, text: this.$t('text.MessageWindow.t3') },
                { id: 2, text: this.$t('text.MessageWindow.t7') },
            ];
        },
    }
}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
</style>