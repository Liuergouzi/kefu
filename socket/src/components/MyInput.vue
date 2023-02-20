<template>
    <div>
        <div class="input__x" v-if="line==1">
            <input type="text" class="input__fill" v-model="serviceName">
            <label class="input__label">用户名</label>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'MyInput',
        props: {
            line: String,
            serviceId: String
        },
        data() {
            return {
                serviceName: '',
            }
        },
        watch: {
            //监听，自动post修改
            serviceName: {
                handler(newValue, oldValue) {
                    console.log(oldValue)
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
                            this.$emit('changeValue1', newValue);
                        } 
                    })
                }
            },
        }
    }
</script>
<style scoped>
    @import url("../assets/css/MyInput.css");
</style>