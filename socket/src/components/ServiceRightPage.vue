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
                <table>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t2') }}</td>
                        <td>{{ user.data.userName }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t9') }}</td>
                        <td>{{ user.data.ip }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t10') }}</td>
                        <td>{{ user.data.area }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t11') }}</td>
                        <td>{{ user.data.device }}</td>
                    </tr>

                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t1') }}</td>
                        <td>{{ user.data.userId }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t3') }}</td>
                        <td>{{ user.data.socketRoom }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t4') }}</td>
                        <td>{{ user.data.receiveId }}</td>
                    </tr>
                    <tr>
                        <td class="infoItemTitle">{{ $t('text.ServiceRightPage.t5') }}</td>
                        <td>{{ user.data.isProhibit }}</td>
                    </tr>
                    <tr v-for="item in getExtend(user.data.extend)" v-bind:key="item">
                        <td class="infoItemTitle">{{ item.title }}：</td>
                        <td>{{ item.value }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <!--快捷回复-->
        <div v-show="current_state == 2" class="infoContentFast">
            <div :style="this.$store.state.textColor+';text-align: right;'" v-on:click="dialogShow=!dialogShow">编辑</div>
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

        <van-dialog v-model:show="dialogShow" title="修改快捷回复" show-cancel-button 
            style="color: black;box-shadow: 0px 0px 10px 1px #eee;" overlayClass="languageOverlay"
            confirm-button-color="#30bcbc" closeOnPopstate @confirm="confirm">
            <div style="padding:10px 20px">
                <van-field v-model="value" label="原值：" placeholder="请输入用户名" readonly autosize/>
                <van-field v-model="value" label="新值：" placeholder="请输入用户名" type="textarea" autosize/>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import config from '@/config';
import CryptoJS from 'crypto-js'

export default {
    name: 'ServiceRightPage',
    props: {
        user: Object
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
        getExtend(extend) {
            if (extend && extend != '') {
                try {
                    let data = this.aesDecrypt(extend)
                    if (data && data != '') {
                        return this.convert(JSON.parse(data)).filter(v=>v.title!=='userName')
                    } else {
                        return []
                    }
                } catch (error) {
                    return []
                }
            } else {
                return []
            }
        },
        convert(obj) {
            const result = [];
            for (let key in obj) {
                result.push({
                    title: key,
                    value: obj[key]
                });
            }
            return result;
        },

        aesDecrypt(encryptedData) {
            let decrypted = CryptoJS.AES.decrypt(encryptedData, config.aesKey, {
                iv: config.aesIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        },
        aesEncrypt(data) {
            let encrypted = CryptoJS.AES.encrypt(data, config.aesKey, {
                iv: config.aesIv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        },
    },
    data() {
        return {
            current_state: 1,
            currentEasy: 0,
            dialogShow:false,
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
                        {
                            "title": "我家鸽鸽下蛋你别吃",
                            "id": 10001
                        },
                        {
                            "title": "我家鸽鸽下蛋你别吃",
                            "id": 10001
                        },
                        {
                            "title": "我家鸽鸽下蛋你别吃",
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
                        {
                            "title": "我家鸽鸽下蛋你别吃",
                            "id": 10001
                        },
                        {
                            "title": "我家鸽鸽下蛋你别吃",
                            "id": 10001
                        },
                        {
                            "title": "我家鸽鸽下蛋你别吃",
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
    computed: {
        serviceTool() {
            return [
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
            ]
        }
    }
}
</script>
<style scoped>
@import url("../assets/css/ServiceRightPage.css");
</style>

