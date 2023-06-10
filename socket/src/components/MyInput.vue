<template>
    <div>
        <div class="input__x" v-if="line == 1">
            <input type="text" class="input__fill" v-model="serviceName">
            <label class="input__label">修改昵称</label>
        </div>
        <div class="input__x" v-if="line == 2">
            <input type="number" class="input__fill" v-model="serviceMax">
            <label class="input__label">最大接待人数</label>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
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
            serviceName: this.serviceNameProps,
            serviceMax: this.serviceMaxProps
        }
    },
    watch: {
        //监听，自动post修改昵称
        serviceName: {
            handler(newValue) {
                if (newValue != "" && newValue.indexOf(" ") < 0) {
                    let params = {
                        serviceName: newValue,
                        serviceId: this.serviceId
                    }
                    axios({
                        method: 'post',
                        url: '/updateServiceName',
                        data: params
                    }).then((response) => {
                        if (response.data[0].code) {
                            this.$emit('changeValue1', newValue, 1);
                        }
                    })
                }
            }
        },
        //监听，自动post修改接待人数
        serviceMax: {
            handler(newValue) {
                if (typeof(newValue)=='number') {
                    let params = {
                        serviceMax: newValue,
                        serviceId: this.serviceId
                    }
                    axios({
                        method: 'post',
                        url: '/updateServiceMax',
                        data: params
                    }).then((response) => {
                        if (response.data[0].code) {
                            this.$emit('changeValue1', newValue, 2);
                        }
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