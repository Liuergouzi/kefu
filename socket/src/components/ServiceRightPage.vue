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
        <!--用户信息-->
        <div v-show="current_state == 1" class="infoContent">
            <div>
                <label>{{$t('text.ServiceRightPage.t1')}}</label>
                <span>{{ user.data.userId }}</span>
            </div>
            <div>
                <label>{{$t('text.ServiceRightPage.t2')}}</label>
                <span>{{ user.data.userName }}</span>
            </div>
            <div>
                <label>{{$t('text.ServiceRightPage.t3')}}</label>
                <span>{{ user.data.socketRoom }}</span>
            </div>
            <div>
                <label>{{$t('text.ServiceRightPage.t4')}}</label>
                <span>{{ user.data.receiveId }}</span>
            </div>
            <div>
                <label>{{$t('text.ServiceRightPage.t5')}}</label>
                <span>【{{ user.data.isProhibit}}】</span>
            </div>
        </div>
        <!--快捷回复-->
        <div v-show="current_state == 2" class="infoContent" style="display: block">
            <template :key="index" v-for="(item, index) in fastReplay">
                <ul class="domtree">
                    <li>
                        <p class="tree-title" v-on:click="selectEasy(item.id)">
                            {{ item.title }}
                        </p>
                        <ul v-show="currentEasy == item.id" style="position: relative">
                            <li v-for="(son, index2) in item.sonItem" :key="index2">
                                <p class="sonTitle" :title="son.title" v-bind:data-id="son.id"
                                    v-on:click="selectReplay(son.title)">
                                    {{ son.title }}
                                </p>
                                <div class="see_all" name="see_all" v-bind:data-id="son.id">
                                    {{ son.title }}
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </template>
        </div>
        <!--对接页面-->
        <div v-show="current_state == 3" class="infoContent">
            <iframe style="width: 100%; height: 100%; border: 0px" src="https://ctrlc.cc/home/zfb/pay.html"></iframe>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'ServiceRightPage',
    props: {
        user:Object
    },
    methods: {
        selectReplay(text) {
            this.$emit('submit', text);
        },

        sendMessage(data, type) {
            this.$emit('sendMessage', data, type);
        },
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
        //切换快捷回复
        selectEasy(id) {
            if (id == this.currentEasy) {
                this.currentEasy = 0;
            } else {
                this.currentEasy = id;
            }
        },

    },
    data() {
        return {
            current_state: 1,
            currentEasy: 0,
            serviceTool: [
                {
                    id: 1,
                    text: this.$t('text.ServiceRightPage.t6'),
                    state: true,
                },
                {
                    id: 2,
                    text: this.$t('text.ServiceRightPage.t7'),
                    state: false,
                },
                {
                    id: 3,
                    text: this.$t('text.ServiceRightPage.t8'),
                    state: false,
                },
            ],

            fastReplay: [
                {
                    "title": "真ikun",
                    "sonItem": [
                        {
                            "title": "你最好是",
                            "id": 10001
                        },
                        {
                            "title": "拜托你们膳待我的男骸亿点点好吗，就亿点点，真的很好玩吗?",
                            "id": 10001
                        },
                        {
                            "title": "荔枝，你让我拿什么荔枝啊？我爱的那个牠都被你们这样对待了，还让我怎么荔枝?",
                            "id": 10001
                        },
                        {
                            "title": "我家鸽鸽下蛋你别吃",
                            "id": 10001
                        },
                    ],
                    "id": 10000
                },
                {
                    "title": "假ikun",
                    "sonItem": [
                        {
                            "title": "小黑子，食不食油饼？",
                            "id": 20001
                        },
                        {
                            "title": "小黑子，苏珊",
                            "id": 20001
                        }
                    ],
                    "id": 20000
                },
                {
                    "title": "纯路人",
                    "sonItem": [
                        {
                            "title": "纯路人，感觉没必要",
                            "id": 30001
                        },
                        {
                            "title": "纯路人，真觉得你们有没有树枝，要是你们也被这样子黑的话，你们会怎么样？",
                            "id": 30001
                        },
                    ],
                    "id": 30000
                }
            ],

        }
    },
}
</script>
<style scoped>
@import url("../assets/css/ServiceRightPage.css");
</style>

