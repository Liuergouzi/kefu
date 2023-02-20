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
            <div style="clear: both"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatGPTWindow',
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
        },
    },
    watch: {
    }

}
</script>
<style scoped>
@import url("../assets/css/MessageWindow.css");
</style>