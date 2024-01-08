<template>
    <div class="RightCont">

        <!--消息接收-->
        <div :key="index" v-for="(item, index) in messageList_copy">
            <!--机器人-->
            <div class="customerServiceDiv" v-if="item.sendPeople == 'other'">
                <div v-if="item.sendType == 1" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <div v-html="item.message"></div>
                </div>
                <div v-if="item.sendType == 2" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <div :key="index" v-for="(titleItem, index) in item.message">
                        <div v-html="titleItem.message"></div>
                        <div :key="index"
                            v-for="(problemItem, index) in item.problem.filter(v => v.titleId === titleItem.id)">
                            <div v-html="problemItem.message" v-on:click="robotClick(problemItem)"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!--自己-->
            <div class="myselfDiv" v-if="item.sendPeople == 'me'">
                <div v-if="item.sendType == 1" class="news">
                    <img class="jiao" src="../assets/images/radio.jpg" />
                    <div v-html="item.message"></div>
                </div>
                <div v-else-if="item.sendType == 2" class="SendImage">
                    <img v-bind:src="item.message" />
                </div>
                <div class="nesHead">
                    <img src="../assets/images/visitor.png" />
                </div>
            </div>

            <!--等待状态通知显示-->
            <div v-if="item.sendPeople == 'notice'" class="noticeDiv">
                <div class="moreSession" v-if="item.sendType == 4" style="padding: 8px 10px;">
                    <span style="display: flex;">
                        {{ $t('text.HomeAiChat.t1') }}{{ item.waitCount }}{{ $t('text.HomeAiChat.t2') }}
                    </span>
                    <div class="wait">
                        <div class="animation_div"></div>
                        <div class="waitCal" v-on:click="waitCancel">{{ $t('text.HomeAiChat.t3') }}</div>
                    </div>
                </div>
            </div>

            <!--普通状态通知显示-->
            <div v-if="item.sendPeople == 'notice'" class="noticeDiv">
                <div class="moreSession" v-if="item.sendType == 5">
                    {{ item.message }}
                </div>
            </div>

            <div style="clear: both"></div>
        </div>
        <div class="specifyService"
            style="background: #eee;color: black;border-radius: 13px;margin: 10px;padding-bottom: 0;">
            <div style="padding-bottom: 15px;">{{ $t('text.HomeAiChat.t5')}}</div>
            <div v-for="item in specifyServiceList" :key="item" class="specifyDiv">
                <div class="specifyLeft">
                    <img :src="item.serviceHead" class="specifyHead">
                    <div class="specifyName">{{ item.serviceName }}</div>
                    <div class="specifyState">
                        <div :class="item.isOnLine ? 'serviceStateGreenDot' : 'serviceStateRedDot'"></div>
                        {{ item.isOnLine ? $t('text.customerService.t4') : $t('text.customerService.t5') }}
                    </div>
                </div>

                <div class="specifyJoin" :style="this.$store.state.bgColor" v-on:click="specifyConnection(item)">选择
                </div>

            </div>
        </div>
        <div class="initLoadingDiv" v-if="initLoading">
            <div class="animation_div" ></div>
            <div style="color: #555;padding-top: 5px;">{{ $t('text.HomeAiChat.t6') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeAiChat',
    props: {
        messageList: Object,
        initLoading:Boolean,
        specifyServiceList: {
            default: []
        }
    },
    mounted() {
    },
    data() {
        return {
            messageList_copy: this.messageList,
        }
    },
    methods: {
        //回复
        robotClick(items) {
            if (this.messageList_copy.filter((v) => v.sendType == 4).length == 0) {
                this.messageList_copy.push(
                    { sendType: 1, sendPeople: 'me', message: items.message },
                    { sendType: 1, sendPeople: 'other', message: this.messageList_copy[0].reply.filter(v => v.problemId === items.id)[0]?.message }
                )
                this.toBottom(200)
            } else {
                this.$toast(this.$t('text.HomeAiChat.t4'));
            }
        },
        //取消排队
        waitCancel() {
            this.$emit('waitCancel');
        },
        specifyConnection(item){
            this.$emit('specifyConnection', item);
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
    },
    watch: {
        messageList() {
            this.messageList_copy = this.messageList
        }

    }

}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
@import url("../assets/css/Home.css");</style>