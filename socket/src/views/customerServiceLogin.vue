<template>
    <div class="container">
        <div class="main">
            <div class="bg"></div>
            <form class="formone" action="/" method="get">
                <div class="title">{{ $t('text.customerServiceLogin.t1') }}</div>
                <div class="username">
                    <input type="text" id="login_account" v-model="login.serviceAccount" :placeholder="$t('text.customerServiceLogin.t2')" />
                </div>
                <div class="password">
                    <input type="password" id="login_password" v-model="login.servicePassword" :placeholder="$t('text.customerServiceLogin.t3')" />
                </div>
                <div class="clear">
                    <div v-on:click="clear()" style="padding-left: 28px;">{{ $t('text.customerServiceLogin.t4') }}</div>
                    <SetLanguage></SetLanguage>
                </div>
                <div class="loginbtn" v-on:click="serviceLogin">
                    <div class="btnbg">{{ $t('text.customerServiceLogin.t5') }}</div>
                    <button type="button">{{ $t('text.customerServiceLogin.t5') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
    import SetLanguage from '@/components/SetLanguage.vue';
import JSEncrypt from 'jsencrypt';
    let encryptor = new JSEncrypt();
    export default {
    data() {
        return {
            socket: this.$store.state.serviceSocket,
            publicKey: '',
            login: {
                serviceAccount: '',
                servicePassword: ''
            }
        };
    },
    mounted() {
        this.initialization();
        //接收公钥
        this.socket.on("returnPublicKey", (data) => {
            this.publicKey = JSON.stringify(data.data).replace(/\\r|\\n/g, '');
            encryptor.setPublicKey(this.publicKey);
        });
        //接收登录返回
        this.socket.on("loginReturn", (data) => {
            //数据存储
            //存储到localStorage
            localStorage.setItem('token', data.token.data);
            //客服数据存储到localStorage
            localStorage.setItem('serviceData', data.data);
            //页面跳转
            this.$router.push({ path: '/customerService', replace: true });
        });
        //错误失败处理
        this.socket.on("error", (data) => {
            alert(data.message);
        });
    },
    methods: {
        initialization() {
            //初始化，从服务端拿公钥
            this.socket.emit("getPublicKey");
        },
        //登录
        serviceLogin() {
            if (this.login.serviceAccount == null || this.login.servicePassword == null) {
                alert("输入为空");
            }
            else {
                //数据加密
                this.login.serviceAccount = encryptor.encrypt(this.login.serviceAccount);
                this.login.servicePassword = encryptor.encrypt(this.login.servicePassword);
                this.socket.emit("serviceLogin", this.login);
            }
        },
        //清空密码账号输入
        clear() {
            this.login.serviceAccount = null;
            this.login.servicePassword = null;
        },
    },
    components: { SetLanguage }
}

</script>

<style>
    *,
    body,
    html {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

    }
    .clear{
        display: flex;
        gap: 20px;
    }
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #54307d;
        cursor: pointer;
        transform-style: preserve-3d;
        perspective: 800px;
    }

    .container .main {
        width: 500px;
        height: 500px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        background: #4c317a;
        display: flex;
        justify-content: center;
        align-items: center;
        transform-style: preserve-3d;
        perspective: 800px;
        animation: mainplay 1s linear forwards;
    }

    @keyframes mainplay {
        from {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }

        to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }

    .container .main .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        background: linear-gradient(#6c39c7, #65f0ffbd);
        z-index: -1;
        animation: clipplay 2s infinite alternate linear;
    }

    @keyframes clipplay {
        from {
            clip-path: polygon(20% 0%, 0% 20%, 9% 50%, 0% 80%, 20% 100%, 53% 93%, 80% 100%, 100% 80%, 89% 50%, 100% 20%, 80% 0%, 48% 13%);
        }

        to {
            clip-path: polygon(20% 0%, 0% 20%, 0 52%, 0% 80%, 20% 100%, 50% 100%, 80% 100%, 100% 80%, 100% 48%, 100% 20%, 80% 0%, 48% 0);
        }
    }

    .container .main .formone {
        width: 80%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        /* display: none; */
    }

    .container .main .formone div {
        width: 100%;
        flex: 1;
        text-align: center;
    }

    .container .main .formone .title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6ad6c8f0;
        font-size: 40px;
    }

    .container .main .formone .username {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container .main .formone input {
        width: 100%;
        height: 70%;
        line-height: 100%;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: transparent;
        color: white;
        outline: none;
        text-align: center;
        box-shadow: 0px 0px 2px 0px #6c569a;
    }

    ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: white;
        font-size: 16px;
    }

    .container .main .formone input:hover {
        box-shadow: 0px 0px 20px 0px #4787d2;
    }

    .container .main .formone button {
        width: 100%;
        height: 70%;
        line-height: 100%;
        border-radius: 5px;
        border: none;
        background: #714cac;
        color: white;
        outline: none;
    }

    .container .main .formone .loginbtn,
    .container .main .formone .registerbtn {
        position: relative;
    }

    .btnbg {
        width: 0% !important;
        height: 70%;
        position: absolute;
        left: 50%;
        background: linear-gradient(#9756e2, #495a73);
        transition: all 1s;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        letter-spacing: 5px;
        border-radius: 5px;

    }

    .container .main .formone .registerbtn:hover .btnbg,
    .container .main .formone .loginbtn:hover .btnbg {
        width: 100% !important;
        left: 0%;
    }
</style>