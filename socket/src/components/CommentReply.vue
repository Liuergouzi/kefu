<template>
    <div class="infoBox">
        <!--留言回复-->
        <div class="infoContent">
            <img @click="getComment(true)" src="../assets/images/refresh.png"
                style="width: 18px;height: 18px;position: absolute;top: 0;right: 33px;">
            <div class="messageRecord">
                <div v-for="(item, index) in messageList" :key="index" class="messageDiv">
                    <div class="messageTime">{{ getTransTime(item.commentTime) }}</div>
                    <div class="messageContent">
                        <div class="messageDetail">{{ item.commentContent }}</div>
                        <div class="messageState" v-if="item.commentState == 1">{{ $t('text.CommentReply.t1') }}</div>
                        <div class="messageState" v-else-if="item.State == 2" v-on:click="item.State = 1">
                            {{ $t('text.CommentReply.t2') }}
                        </div>
                        <div class="messageState" :style="this.$store.state.bgColor" v-else
                            v-on:click="seeMessageDetail(item)">
                            {{ $t('text.CommentReply.t3') }}
                        </div>
                    </div>

                    <div v-if="item.commentState == 1" style="text-align: left">
                        <div>{{ $t('text.CommentReply.t4') }}{{ item.commentService }}</div>
                        <div>{{ item.commentReply }}</div>
                    </div>

                    <div v-if="item.State == 2" style="text-align: left;width:200px;margin-top:10px">
                        <input v-model="serviceMessage">
                        <div class="messageSub" :style="this.$store.state.bgColor" v-on:click="replySubmit(item.id)">
                            {{ $t('text.CommentReply.t5') }}</div>
                    </div>
                </div>
            </div>
            <van-pagination v-model="currentPage" :page-count="totalPage"></van-pagination>
        </div>
    </div>
</template>

<script>
import { commentSelect, commentReply } from '../http/api'
export default {
    name: 'CommentReply',
    mounted() {

        this.service = Object.assign({}, JSON.parse(localStorage.getItem('serviceData')))
        this.getComment()
    },
    methods: {

        //获取留言
        getComment(flag) {
            commentSelect({ page: 1 }).then((response) => {
                this.messageList = response;
                if (response.length == 10&&!flag) {
                    this.totalPage = this.totalPage + 1
                }
                if(flag){
                    this.$toast(this.$t('text.customerService.t26'));
                }
            })
        },

        //回复留言
        replySubmit(id) {
            let params = {
                id: id,
                commentService: this.service.serviceName,
                commentReply: this.serviceMessage
            }
            commentReply(params).then(() => {
                this.$toast(this.$t('text.CommentReply.t8'))
                this.serviceMessage = "";
            })
        },

        //时间转换
        getTransTime(time) {
            const date = new Date(time);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        },

        seeMessageDetail(message) {
            message.State = 2;
        },
    },
    data() {
        return {
            current_state: 1,
            currentEasy: 0,
            messageList: [],
            serviceMessage: "",
            service: {
                serviceId: '',
                serviceName: '',
                serviceState: 0,
                serviceFrequency: 0
            },
            currentPage: 1,
            totalPage: 1
        }
    },
    watch: {
        //监听，页数切换
        currentPage: {
            handler() {
                commentSelect({ page: this.currentPage }).then((response) => {
                    this.messageList = response
                })
            }
        }
    },
    computed: {
    },
}
</script>
<style scoped>
@import url("../assets/css/ServiceRightPage.css");
</style>
<style scoped>
@import url("../assets/css/Comment.css");
</style>