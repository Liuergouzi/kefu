<template>
    <div class="commentBg">
        <div class="showComment">
            <div class="commentTitle">
                <span v-bind:class="{ messageActive: messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(true)">{{$t('text.Comment.t1')}}</span>
                <span v-bind:class="{ messageActive: !messageType }" class="messageTopBtn"
                    v-on:click="changeMessageType(false)">{{$t('text.Comment.t2')}}</span>
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
                        {{$t('text.Comment.t3')}}
                    </div>
                </div>
            </div>
            <!--回复查看页面-->
            <div v-show="!messageType" class="messageRecord">
                <div v-for="(item, index) in messageList" :key="index" class="messageDiv">
                    <div class="messageTime">{{ item.commentTime }}</div>
                    <div class="messageContent">
                        <div class="messageDetail">{{ item.commentContent }}</div>
                        <div class="messageState" v-if="item.commentState == 0">{{$t('text.Comment.t4')}}</div>
                        <div class="messageState" v-else-if="item.State == 2" v-on:click="item.State = 1">
                            {{$t('text.Comment.t5')}}
                        </div>
                        <div class="messageState" :style="this.$store.state.bgColor" v-else
                            v-on:click="seeMessageDetail(item)">
                            {{$t('text.Comment.t6')}}
                        </div>
                    </div>
                    <div v-if="item.State == 2" style="text-align: left">
                        <div>{{$t('text.Comment.t7')}}{{ item.commentService }}</div>
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
                messageTip: this.$t('text.Comment.t8'),
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
                        method: 'get',
                        url: '/commentSelectById',
                        data: params,
                        headers: {'Accept-Language':  localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'}
                    }).then((response) => {
                        if (response.data.code) {
                            this.messageList = response.data.data;
                        } else {
                            this.$toast(this.$t('text.Comment.t9'))
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
                    data: params,
                    headers: {'Accept-Language':  localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN'}
                }).then((response) => {
                    if (response.data.code) {
                        this.$toast(this.$t('text.Comment.t10'))
                        this.customerMessage = "";
                    } else {
                        this.$toast(this.$t('text.Comment.t11'))
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