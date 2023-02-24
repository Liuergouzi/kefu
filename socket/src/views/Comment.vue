<template>
    <div class="commentBg">
        <div class="showComment">
            <div class="commentTitle">
                <span v-bind:class="{ messageActive: messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(true)">请您留言</span>
                <span v-bind:class="{ messageActive: !messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(false)">留言记录</span>
            </div>
            <!--提交页面-->
            <div v-show="messageType">
                <div class="messageTip">
                    {{ messageTip }}
                </div>
                <van-rate v-model="rateValue" allow-half class="messageRate"></van-rate>
                <textarea v-model="customerMessage" maxlength="200" id="remark" class="textarea"></textarea>
                <div class="submitDiv" style="margin-top: 10px">
                    <div class="submitBtn" :style="this.$store.state.bgColor"
                        v-bind:class="{ activeBtn: customerMessage.length > 0 }" v-on:click="sumbitMessage">
                        提交
                    </div>
                </div>
            </div>
            <!--回复查看页面-->
            <div v-show="!messageType" class="messageRecord">
                <div v-for="(item, index) in messageList" :key="index" class="messageDiv">
                    <div class="messageTime">{{ item.commentTime }}</div>
                    <div class="messageContent">
                        <div class="messageDetail">{{ item.commentContent }}</div>
                        <div class="messageState" v-if="item.commentState == 0">待回复</div>
                        <div class="messageState" v-else-if="item.State == 2" v-on:click="item.State = 1">
                            ∧收起
                        </div>
                        <div class="messageState" :style="this.$store.state.bgColor" v-else
                            v-on:click="seeMessageDetail(item)">
                            查看详情
                        </div>
                    </div>
                    <div v-if="item.State == 2" style="text-align: left">
                        <div>客服：{{ item.commentService }}</div>
                        <div>{{ item.commentReply }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import axios from 'axios';
    export default {
        name: 'LeaveWord',
        props: {
        },
        data() {
            return {
                messageType: true,
                messageTip: "您好，很抱歉我们暂时无法为您提供服务，如需帮助，请留言，我们将尽快联系并解决您的问题",
                rateValue: 10,
                customerMessage: '',
                messageList: []
            }
        },
        methods: {
            //留言与留言记录的切换
            changeMessageType(flat) {
                this.messageType = flat;
                if (!flat) {
                    let params = {
                        commentId: localStorage.getItem('userId')
                    }
                    console.log(params)
                    axios({
                        method: 'post',
                        url: '/commentSelectById',
                        data: params
                    }).then((response) => {
                        if (response.data[0].code) {
                            this.messageList = JSON.parse(response.data[0].data);
                        } else {
                            this.$toast("获取失败")
                        }
                    })
                }
            },

            //提交留言
            sumbitMessage() {

                let params = {
                    commentId: localStorage.getItem('userId'),
                    commentContent: this.customerMessage,
                    commentGrade: this.rateValue,
                    commentTime: this.getNowTime()
                }
                console.log(params)
                axios({
                    method: 'post',
                    url: '/commentInsert',
                    data: params
                }).then((response) => {
                    if (response.data[0].code) {
                        this.$toast("提交成功")
                        this.customerMessage = "";
                    } else {
                        this.$toast("提交失败")
                    }
                })
            },

            //获取当前时间
            getNowTime() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);
                return time;
            },
            //小于10的拼接上0字符串
            addZero(s) {
                return s < 10 ? ('0' + s) : s;
            },

            seeMessageDetail(message) {
                message.State = 2;
            },
        },
        watch: {

        }

    }
</script>

<style scoped>
    @import url("../assets/css/Comment.css");
</style>