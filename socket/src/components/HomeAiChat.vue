<template>
    <div class="RightCont">
        <!--消息接收-->
        <div :key="index" v-for="(item, index) in messageList_copy">
            <!--机器人-->
            <div class="customerServiceDiv" v-if="item.sendPeople == 'other'">
                <div class="answerHead">
                    <img src="../assets/images/robot.png" />
                </div>
                <div v-if="item.sendType == 1" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <div v-html="item.message"></div>
                </div>
                <div v-if="item.sendType == 2" class="answers">
                    <img class="jiao" src="../assets/images/other_radio.jpg" />
                    <div v-html="item.message"></div>
                    <div :key="index" v-for="(items, index) in item.problem">
                        <div v-html="items" v-on:click="robotClick(items, index)"></div>
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
                        {{$t('text.HomeAiChat.t1')}}{{ item.waitCount }}{{$t('text.HomeAiChat.t2')}}
                    </span>
                    <div class="wait">
                        <div class="animation_div"></div>
                        <div class="waitCal" v-on:click="waitCancel">{{$t('text.HomeAiChat.t3')}}</div>
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
    </div>
</template>

<script>
export default {
    name: 'HomeAiChat',
    props: {
        messageList: Object,
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
        robotClick(items, index) {
            if (this.messageList_copy.filter((v) => v.sendType == 4).length==0) {
                let obj = {}
                obj.sendType = 1
                obj.sendPeople = 'me'
                obj.message = items;
                this.messageList_copy.push(obj)
                let objs = {}
                objs.sendType = 1
                objs.sendPeople = 'other'
                objs.message = this.$store.state.robot[0].reply[index];
                this.messageList_copy.push(objs)
                this.toBottom(200)
            }else{
                this.$toast(this.$t('text.HomeAiChat.t4'));
            }
        },
        //取消排队
        waitCancel() {
            this.$emit('waitCancel');
        },
        //回到底部
        toBottom(time) {
            setTimeout(() => {
                let RightCont = document.getElementById("userMessage");
                if (RightCont != null) {
                    console.log("yes")
                    let scrollHeight2 = RightCont.scrollHeight;
                    RightCont.scrollTop = scrollHeight2;
                }
            }, time);
            clearTimeout();
        },
    },
    watch: {
    }

}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
</style>