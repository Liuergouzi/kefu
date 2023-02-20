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
                    <div class="messageTime">{{ item.commentTime }}</div>
                    <div class="messageContent">
                        <div class="messageDetail">{{ item.commentContent }}</div>
                        <div class="messageState" v-if="item.commentState == 1">已回复</div>
                        <div class="messageState" v-else-if="item.State == 2" v-on:click="item.State = 1">
                            取消
                        </div>
                        <div class="messageState" :style="this.$store.state.bgColor" v-else
                            v-on:click="seeMessageDetail(item)">
                            回复
                        </div>
                    </div>
                    
                    <div v-if="item.commentState == 1" style="text-align: left">
                        <div>客服：{{ item.commentService }}</div>
                        <div>{{ item.commentReply }}</div>
                    </div>
                    
                    <div v-if="item.State == 2" style="text-align: left;width:200px;margin-top:10px">
                        <input v-model="serviceMessage">
                        <div class="messageSub" :style="this.$store.state.bgColor" v-on:click="replySubmit(item.id)">提交</div>
                    </div>
                </div>
            </div>
        </div>
        <!--对接页面-->
        <div v-show="current_state == 2" class="infoContent">
            页面后续扩展内容
        </div>
    </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'CommentReply',
        mounted() {
            
            this.service = Object.assign({}, JSON.parse(localStorage.getItem('serviceData')))
            
            let params = {}
            axios({
                method: 'post',
                url: '/commentSelect',
                data: params
            }).then((response) => {
                if (response.data[0].code) {
                    this.messageList = JSON.parse(response.data[0].data);
                } else {
                    this.$toast("获取失败")
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
                    id:id,
                    commentService: this.service.serviceName,
                    commentReply:this.serviceMessage
                }
                console.log(params)
                axios({
                    method: 'post',
                    url: '/commentReply',
                    data: params
                }).then((response) => {
                    if (response.data[0].code) {
                        this.$toast("回复成功")
                        // for(var i=0;i<this.messageList.length();i++){
                            
                        // }
                        this.messageList
                        this.serviceMessage = "";
                    } else {
                        this.$toast("回复失败")
                    }
                })
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
                serviceMessage:"",
                service: {
                    serviceId: '',
                    serviceName: '',
                    serviceState: 0,
                    serviceFrequency: 0
                },
                serviceTool: [
                    {
                        id: 1,
                        text: "留言回复",
                        state: true,
                    },
                    {
                        id: 2,
                        text: "页面后续扩展内容",
                        state: false,
                    },
                ],
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