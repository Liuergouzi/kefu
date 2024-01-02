<template>
    <svg v-if="whichShow" @click="setType" t="1696178881815" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="28726" width="128" height="128">
        <path
            d="M579.2 478.4h-9.6l36.8 206.4c24.8-8.8 47.2-21.6 66.4-39.2-20-24.8-36.8-52-49.6-80.8l39.2-4.8c10.4 21.6 23.2 41.6 36.8 58.4 28.8-35.2 51.2-81.6 66.4-140.8l-186.4 0.8z m148 167.2c22.4 19.2 48 33.6 76 42.4l17.6 5.6-10.4 38.4-17.6-5.6c-34.4-10.4-65.6-28.8-92.8-52.8-24.8 22.4-54.4 40-86.4 50.4l24.8 139.2H490.4l-20 91.2h467.2c21.6 0 40-17.6 40-40V240c0-21.6-17.6-40-40-40H520l31.2 172.8-0.8-0.8 3.2 19.2 0.8-2.4 8.8 49.6h96v-40h74.4v40h124v40h-52c-16.8 69.6-44 125.6-78.4 167.2z m-277.6 217.6H87.2c-44 0-79.2-36-79.2-79.2V108.8c0-44 36-79.2 79.2-79.2h396.8l24.8 131.2h428c44 0 79.2 36 79.2 79.2v675.2c0 44-36 79.2-79.2 79.2H420.8l28.8-131.2zM262.4 557.6v-41.6H184v-61.6h72.8v-41.6H184V360h78.4v-41.6H137.6v238.4h124.8v0.8z m191.2 0V438.4c0-21.6-4.8-38.4-14.4-49.6-9.6-12-24.8-17.6-44-17.6-11.2 0-21.6 2.4-30.4 6.4-8.8 4.8-16 12-20 20h-2.4l-6.4-23.2h-34.4v182.4h44.8V471.2c0-21.6 3.2-36.8 8.8-46.4 5.6-8.8 14.4-13.6 27.2-13.6 8.8 0 16 3.2 20 9.6 4 6.4 6.4 16 6.4 29.6v107.2h44.8z"
            p-id="28727" fill="#ffffff"></path>
    </svg>
    <svg v-else @click="setType" t="1696179253921" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="29526" width="128" height="128">
        <path
            d="M249.7536 378.5728c10.6496 31.6416 28.3648 59.0848 53.0432 83.2512 20.992-22.7328 36.7616-50.7904 47.0016-83.2512h-100.0448zM902.2464 191.488H511.2832L488.96 71.8848H125.952c-40.0384 0-72.6016 32.5632-72.6016 72.6016v617.1648c0 40.0384 32.5632 72.6016 72.6016 72.6016h330.9568l-26.5216 119.6032h471.9616c40.0384 0 72.6016-32.5632 72.6016-72.6016V264.192c-0.1024-40.1408-32.768-72.704-72.704-72.704zM409.3952 558.1824c-42.8032-15.7696-78.1312-35.84-106.5984-59.0848-29.7984 26.5216-67.072 46.08-110.2848 58.1632l-14.9504-24.6784c42.3936-11.1616 77.7216-27.9552 105.5744-51.712-28.7744-29.3888-48.8448-63.2832-60.1088-101.888h-40.448v-27.9552h105.5744c-6.5536-12.0832-14.9504-23.7568-24.6784-34.9184l27.9552-10.24c9.728 12.5952 18.6368 27.4432 26.5216 44.7488h100.9664v27.9552h-40.448c-13.0048 40.0384-31.6416 73.5232-56.32 100.5568 27.4432 21.9136 61.8496 40.0384 102.4 54.8864 0.1024 0.2048-15.1552 24.1664-15.1552 24.1664z m529.1008 322.56a36.352 36.352 0 0 1-36.352 36.352H475.9552l18.1248-83.2512h136.2944l-77.7216-433.2544-0.4096 2.3552-3.2768-17.3056 0.9216 0.4096-28.3648-158.3104h381.1328a36.352 36.352 0 0 1 36.352 36.352v616.6528h-0.512zM643.4816 538.2144h100.1472v-26.5216h-100.1472v-53.0432h106.5984V432.128H612.2496v190.7712h141.9264v-26.5216H643.4816v-58.1632z m208.9984-57.2416c-8.3968 0-15.7696 1.3312-22.7328 5.12-6.5536 3.2768-13.0048 8.3968-18.1248 14.9504v-16.2816H781.312v138.24h30.3104v-83.2512c0.9216-11.1616 4.7104-19.5584 11.1616-25.6 5.632-5.12 12.0832-7.9872 19.5584-7.9872 20.992 0 31.1296 11.1616 31.1296 33.9968v82.432h30.3104v-85.2992c0.8192-37.6832-16.896-56.32-51.3024-56.32z"
            fill="#ffffff" p-id="29527"></path>
    </svg>

    <van-dialog v-model:show="dialogShow" title="语言/language" show-cancel-button 
        style="color: black;box-shadow: 0px 0px 10px 1px #eee;" overlayClass="languageOverlay"
        confirm-button-color="#30bcbc" closeOnPopstate @confirm="confirm">
        <div class="notes">
            <span>
                您确定要切换语言吗？
            </span>
            <span>
                Are you sure you want to switch languages?
            </span>
            <label>
                不再提醒/Don't remind me again
                <input type="checkbox" name="dontRemind" v-model="ischecked" checked="checked" />
            </label>
        </div>
    </van-dialog>
</template>

<script>

export default {
    name: 'SetLanguage',
    props: {
        isShowDialog: Boolean
    },
    data() {
        return {
            whichShow: localStorage.getItem('language') == 'en-US' ? true : false,
            dialogShow: false,
            ischecked: localStorage.getItem('langRemind') == 'true' ? true : false
        }
    },
    methods: {
        //设置语言
        setType() {
            // !this.ischecked ||this.isShowDialog && !this.ischecked
            if (this.isShowDialog && !this.ischecked) {
                this.dialogShow = true
            } else {
                this.$store.commit('setLanguageUser')
                this.whichShow = !this.whichShow
                if (this.ischecked) {
                    localStorage.setItem('langRemind', 'true')
                }
            }
        },
        confirm() {
            this.$store.commit('setLanguageUser')
            this.whichShow = !this.whichShow
            if (this.ischecked) {
                localStorage.setItem('langRemind', 'true')
            }
        }
    },
    watch: {
        whichShow(newValue){
            if(newValue){
                this.$i18n.locale='en-US'
            }else{
                this.$i18n.locale='zh-CN'
            }
        }
    },
computed: {
},

}
</script>
<style scoped>
.icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.notes {
    display: flex;
    flex-direction: column;
    gap: 15px;
    color: #f30000;
    text-align: center;
    padding: 20px;
    align-items: center;
    justify-content: center;
}

label {
    display: flex;
    align-items: center;
    line-height: 0px;
    gap: 10px;
    color: #888;
}

/** 未被选中的样式*/
input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0 4px 0 0;
    appearance: none;
    position: relative;
    background: #dfdfdf;
    border-radius: 50%;
}

/** 选中的样式*/
input[type="checkbox"]:checked::before {
    content: "";
    background: #30bcbc;
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    border: none;
    border-radius: 50%;
}
</style>
<style>
.languageOverlay {
    height: 9999px !important;
}
</style>