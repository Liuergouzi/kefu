<!--
 * @轮子的作者: 轮子哥
 * @Date: 2024-01-03 10:43:04
 * @LastEditTime: 2024-01-08 15:38:32
-->
<template>
    <div>
        <div class="input__x" v-if="line == 1"> 
            <input type="text" class="input__fill" v-model="serviceName">
            <label class="input__label">{{$t('text.MyInput.t1')}}</label>
        </div>
        <div class="input__x" v-if="line == 2">
            <input type="number" class="input__fill" v-model="serviceMax">
            <label class="input__label">{{$t('text.MyInput.t2')}}</label>
        </div>
    </div>
</template>

<script>
import {updateServiceName,updateServiceMax} from '../http/api'
export default {
    name: 'MyInput',
    props: {
        line: String,
        serviceId: String,
        serviceNameProps: String,
        serviceMaxProps: Number
    },
    data() {
        return {
            socket: this.$store.state.socket,
            serviceName: this.serviceNameProps,
            serviceMax: this.serviceMaxProps
        }
    },
    methods: {
    },
    watch: {
        //监听，自动post修改昵称
        serviceName: {
            handler(newValue) {
                if (newValue != "" && newValue.indexOf(" ") < 0) {
                    updateServiceName({serviceName: newValue,serviceId: this.serviceId}).then(() => {
                        this.socket.emit("updateServiceName", {serviceName: newValue,serviceId: this.serviceId});
                        this.$emit('changeValue', newValue, 1);
                    })
                }
            }
        },
        //监听，自动post修改接待人数
        serviceMax: {
            handler(newValue) {
                if (typeof(newValue)=='number') {
                    updateServiceMax({serviceMax: newValue,serviceId: this.serviceId}).then(() => {
                        this.socket.emit("updateServiceMax", {serviceMax: newValue,serviceId: this.serviceId});
                        this.$emit('changeValue', newValue, 2);
                    })
                }
            }
        },
    }
}
</script>
<style scoped>
@import url("../assets/css/MyInput.css");
</style>