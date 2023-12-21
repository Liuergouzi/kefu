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
            <div :style="this.$store.state.textColor + ';text-align: right;'" v-on:click="isEditFast = !isEditFast">
                {{ isEditFast ? $t('text.ServiceRightPage.t12') : $t('text.ServiceRightPage.t13') }}
            </div>
            <template :key="index" v-for="(item, index) in fastReplay">
                <ul class="domtree">
                    <li v-if="!isEditFast">
                        <p class="tree-title" v-on:click="selectEasy(item)">
                            {{ item.title }}
                        </p>
                        <ul v-show="currentEasy == item.id" style="position: relative">
                            <li v-for="(son, index2) in item.sonItem" :key="index2">
                                <p class="sonTitle" :title="son.title" v-bind:data-id="son.id"
                                    v-on:click="selectReplay(son)">
                                    {{ son.title }}
                                </p>
                            </li>
                        </ul>
                    </li>
                    <li v-if="isEditFast">
                        <div class="tree-title" v-on:click="selectEasy(item)"
                            style="display: flex;justify-content: space-between;align-items: center;">
                            <p style="margin: 10px 0;">{{ item.title }}</p>
                            <div class="editFastOperate">
                                <div class="editFastEdit" @click.stop="fastEdit(item)">{{ $t('text.ServiceRightPage.t13') }}</div>
                                <div class="editFastDelete" @click.stop="fastDelete(item)">{{ $t('text.ServiceRightPage.t14') }}</div>
                            </div>
                        </div>
                        <ul v-show="currentEasy == item.id" style="position: relative">
                            <li v-for="(son, index2) in item.sonItem" :key="index2">
                                <div class="sonTitle" v-on:click="selectReplay(son)"
                                    style="display: flex;justify-content: space-between;padding-bottom: 15px;">
                                    <p style="margin: 0px;">{{ son.title }}</p>
                                    <div class="editFastOperate">
                                        <div class="editFastEdit" @click.stop="fastEdit(son)">{{ $t('text.ServiceRightPage.t13') }}</div>
                                        <div class="editFastDelete" @click.stop="fastDelete(son)">{{ $t('text.ServiceRightPage.t14') }}</div>
                                    </div>
                                </div>
                            </li>
                            <div style="display: flex;justify-content: center;">
                                <button class="addFastBtn" id="serviceSendBtn" v-on:click="addDialogShow = !addDialogShow;addFastParentId=item.id"
                                    :style="this.$store.state.bgColor">
                                    {{ $t('text.ServiceRightPage.t15') }}
                                </button>
                            </div>
                        </ul>
                    </li>
                </ul>
            </template>
            <div style="display: flex;justify-content: center;padding-top: 20px;" v-if="isEditFast">
                <button class="addFastBtn" id="serviceSendBtn" v-on:click="addDialogShow = !addDialogShow;addFastParentId=null"
                    :style="this.$store.state.bgColor">
                    {{ $t('text.ServiceRightPage.t15') }}
                </button>
            </div>
        </div>
        <!--对接页面-->
        <div v-show="current_state == 3" class="infoContent">
            <iframe style="width: 100%; height: 100%; border: 0px" src="https://ctrlc.cc/home/zfb/pay.html"></iframe>
        </div>
        <van-dialog v-model:show="addDialogShow" :title="$t('text.ServiceRightPage.t16')" show-cancel-button style="color: black;"
            confirm-button-color="#30bcbc" closeOnPopstate @confirm="addFastConfirm">
            <div style="padding:10px 20px">
                <van-field v-model="addFastValue" rows="1" show-word-limit maxlength="250" :placeholder="$t('text.ServiceRightPage.t19')" type="textarea"
                    autosize />
            </div>
        </van-dialog>
        <van-dialog v-model:show="editDialogShow" :title="$t('text.ServiceRightPage.t17')" show-cancel-button style="color: black;"
            confirm-button-color="#30bcbc" closeOnPopstate @confirm="editFastConfirm">
            <div style="padding:10px 20px">
                <van-field v-model="editFastItem.title" rows="1" show-word-limit maxlength="250" :placeholder="$t('text.ServiceRightPage.t19')"
                    type="textarea" autosize />
            </div>
        </van-dialog>
        <van-dialog v-model:show="deleteDialogShow" :title="$t('text.ServiceRightPage.t18')" show-cancel-button style="color: black;"
            confirm-button-color="red" closeOnPopstate @confirm="deleteFastConfirm">
            <div style="padding:10px 20px">
                <p style="text-align: center;color: red;">{{$t('text.ServiceRightPage.t20')}}</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import config from '@/config';
import CryptoJS from 'crypto-js'
import axios from 'axios';
export default {
    name: 'ServiceRightPage',
    props: {
        user: Object,
        serviceId: [String, Number]
    },
    data() {
        return {
            current_state: 1,
            currentEasy: 0,
            editDialogShow: false,
            deleteDialogShow: false,
            addDialogShow: false,
            addFastValue: '',
            addFastParentId:null,
            isEditFast: false,
            editFastItem: {},
            fastReplay: [],

        }
    },
    methods: {
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
                //查询快捷回复数据
                if (a.id == 2 && this.fastReplay.length == 0) {
                    this.selectFastData()
                }
            });
        },
        //选择快捷回复
        selectEasy(item) {
            if (item.id == this.currentEasy) {
                this.currentEasy = 0;
            } else {
                this.currentEasy = item.id;
            }
        },
        selectReplay(item) {
            this.$emit('submit', item.title);
        },
        //编辑快捷回复
        fastEdit(item) {
            this.editDialogShow = true
            this.editFastItem = JSON.parse(JSON.stringify(item))
        },
        fastDelete(item) {
            this.deleteDialogShow = true
            this.editFastItem = JSON.parse(JSON.stringify(item))
        },
        //查询快捷回复
        selectFastData() {
            axios({
                method: 'post',
                url: '/selectFast',
                data: { serviceId: this.serviceId },
                headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
            }).then((response) => {
                if (response.data.code) {
                    let list = []
                    let parent = response.data.data.filter(v => v.parentId === null)
                    let sonItem = response.data.data.filter(v => v.parentId != null)
                    parent.forEach(element => {
                        list.push({
                            id: element.id,
                            title: element.title,
                            sonItem: sonItem.filter(v => v.parentId === element.id)
                        })
                    });
                    this.fastReplay = list
                }
            })
        },
        //快捷回复增删改
        addFastConfirm() {
            axios({
                method: 'post',
                url: '/addFast',
                data: { serviceId: this.serviceId, parentId: this.addFastParentId, title: this.addFastValue },
                headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
            }).then((response) => {
                if (response.data.code) {
                    this.$toast(this.$t('text.ServiceRightPage.t21'))
                    this.selectFastData()
                }
            })
        },
        editFastConfirm() {
            axios({
                method: 'post',
                url: '/editFast',
                data: { id: this.editFastItem.id, title: this.editFastItem.title },
                headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
            }).then((response) => {
                if (response.data.code) {
                    this.$toast(this.$t('text.ServiceRightPage.t22'))
                    this.selectFastData()
                }
            })
        },
        deleteFastConfirm() {
            axios({
                method: 'post',
                url: '/deleteFast',
                data: { id: this.editFastItem.id, },
                headers: { 'Accept-Language': localStorage.getItem('language') == 'en-US' ? 'en-US' : 'zh-CN' }
            }).then((response) => {
                if (response.data.code) {
                    this.$toast(this.$t('text.ServiceRightPage.t23'))
                    this.selectFastData()
                }
            })
        },


        //获取扩展内容
        getExtend(extend) {
            if (extend && extend != '') {
                try {
                    let data = this.aesDecrypt(extend)
                    if (data && data != '') {
                        return this.convert(JSON.parse(data)).filter(v => v.title !== 'userName')
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

        //扩展内容加解密
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

