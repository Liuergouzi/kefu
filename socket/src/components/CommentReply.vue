<template>
    <div class="infoBox">
        <!--工具栏-->
        <div class="serviceTool">
            <div v-for="(item, index) in serviceTool" :key="index" :class="[
                'service_tool',
                item.id == current_state ? 'active_tool' : '',
            ]" v-on:click="changeToolPage(item)">
                {{ item.text }}
            </div>
        </div>
        <!--留言回复-->
        <div v-show="current_state == 1" class="infoContent">
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
        <!--对接页面-->
        <div v-show="current_state == 2" class="infoContent">
            {{ $t('text.CommentReply.t6') }}
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'CommentReply',
    mounted() {

        this.service = Object.assign({}, JSON.parse(localStorage.getItem('serviceData')))

        let params = { page: 1 }
        axios({
            method: 'post',
            url: '/commentSelect',
            data: params,
            headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
        }).then((response) => {
            if (response.data.code) {
                this.messageList = response.data.data;
                if (response.data.data.length == 10) {
                    this.totalPage = this.totalPage + 1
                }
            } else {
                this.$toast(this.$t('text.CommentReply.t7'))
            }
        })
    },
    methods: {
        //切换客服工具
        changeToolPage(serviceTool) {
            this.serviceTool.map((a) => {
                if (a.id == serviceTool.id) {
                    a.state = true;
                    this.current_state = a.id;
                } else {
                    a.state = false;
                }
            });
        },

        //回复留言
        replySubmit(id) {
            let params = {
                id: id,
                commentService: this.service.serviceName,
                commentReply: this.serviceMessage
            }
            console.log(params)
            axios({
                method: 'post',
                url: '/commentReply',
                data: params,
                headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
            }).then((response) => {
                if (response.data.code) {
                    this.$toast(this.$t('text.CommentReply.t8'))
                    this.messageList
                    this.serviceMessage = "";
                } else {
                    this.$toast(this.$t('text.CommentReply.t9'))
                }
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
                let params = { page: this.currentPage }
                axios({
                    method: 'post',
                    url: '/commentSelect',
                    data: params,
                    headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
                }).then((response) => {
                    if (response.data.code) {
                        this.messageList = response.data.data;
                    } else {
                        this.$toast(this.$t('text.CommentReply.t12'))
                    }
                })
            }
        }
    },
    computed: {
        serviceTool() {
            return [
                {
                    id: 1,
                    text: this.$t('text.CommentReply.t10'),
                    state: true,
                },
                {
                    id: 2,
                    text: this.$t('text.CommentReply.t11'),
                    state: false,
                },
            ]
        }
    },
}
</script>
<style scoped>
@import url("../assets/css/ServiceRightPage.css");
</style>
<style scoped>
@import url("../assets/css/Comment.css");
</style>