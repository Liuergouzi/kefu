<template>
    <div class="emjon">
        <ul>
            <li :key="index" v-for="(item, index) in expressions">
                <img class="serviceSendExpression" v-bind:src="item.image" v-bind:title="item.title"
                    v-on:click="sendMessage(item.image,2)" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SendEmote',
    methods: {
      sendMessage(data,type) {
        this.$emit('sendMessage',data,type);
      }
    },
    data() {
        return {
            expressions: [
                {
                    title: "[呵呵]",
                    image: require("../assets/images/emote/smilea_thumb.gif"),
                },
                {
                    title: "[嘻嘻]",
                    image: require("../assets/images/emote/tootha_thumb.gif"),
                },
                {
                    title: "[哈哈]",
                    image: require("../assets/images/emote/laugh.gif"),
                },
                {
                    title: "[可爱]",
                    image: require("../assets/images/emote/tza_thumb.gif"),
                },
                {
                    title: "[可怜]",
                    image: require("../assets/images/emote/kl_thumb.gif"),
                },
                {
                    title: "[挖鼻屎]",
                    image: require("../assets/images/emote/kbsa_thumb.gif"),
                },
                {
                    title: "[吃惊]",
                    image: require("../assets/images/emote/cj_thumb.gif"),
                },
                {
                    title: "[害羞]",
                    image: require("../assets/images/emote/shamea_thumb.gif"),
                },
                {
                    title: "[挤眼]",
                    image: require("../assets/images/emote/zy_thumb.gif"),
                },
                {
                    title: "[闭嘴]",
                    image: require("../assets/images/emote/bz_thumb.gif"),
                },
                {
                    title: "[鄙视]",
                    image: require("../assets/images/emote/bs2_thumb.gif"),
                },
                {
                    title: "[爱你]",
                    image: require("../assets/images/emote/lovea_thumb.gif"),
                },
                {
                    title: "[泪]",
                    image: require("../assets/images/emote/sada_thumb.gif"),
                },
                {
                    title: "[偷笑]",
                    image: require("../assets/images/emote/heia_thumb.gif"),
                },
                {
                    title: "[亲亲]",
                    image: require("../assets/images/emote/qq_thumb.gif"),
                },
                {
                    title: "[生病]",
                    image: require("../assets/images/emote/sb_thumb.gif"),
                },
                {
                    title: "[太开心]",
                    image: require("../assets/images/emote/mb_thumb.gif"),
                },
                {
                    title: "[懒得理你]",
                    image: require("../assets/images/emote/ldln_thumb.gif"),
                },
                {
                    title: "[右哼哼]",
                    image: require("../assets/images/emote/yhh_thumb.gif"),
                },
                {
                    title: "[左哼哼]",
                    image: require("../assets/images/emote/zhh_thumb.gif"),
                },
                {
                    title: "[嘘]",
                    image: require("../assets/images/emote/x_thumb.gif"),
                },
                {
                    title: "[衰]",
                    image: require("../assets/images/emote/cry.gif"),
                },
                {
                    title: "[委屈]",
                    image: require("../assets/images/emote/wq_thumb.gif"),
                },
                {
                    title: "[吐]",
                    image: require("../assets/images/emote/t_thumb.gif"),
                },
                {
                    title: "[打哈气]",
                    image: require("../assets/images/emote/k_thumb.gif"),
                },
                {
                    title: "[抱抱]",
                    image: require("../assets/images/emote/bba_thumb.gif"),
                },
                {
                    title: "[怒]",
                    image: require("../assets/images/emote/angrya_thumb.gif"),
                },
                {
                    title: "[疑问]",
                    image: require("../assets/images/emote/yw_thumb.gif"),
                },
                {
                    title: "[馋嘴]",
                    image: require("../assets/images/emote/cza_thumb.gif"),
                },
                {
                    title: "[拜拜]",
                    image: require("../assets/images/emote/88_thumb.gif"),
                },
                {
                    title: "[思考]",
                    image: require("../assets/images/emote/sk_thumb.gif"),
                },
                {
                    title: "[汗]",
                    image: require("../assets/images/emote/sweata_thumb.gif"),
                },
                {
                    title: "[困]",
                    image: require("../assets/images/emote/sleepya_thumb.gif"),
                },
                {
                    title: "[睡觉]",
                    image: require("../assets/images/emote/sleepa_thumb.gif"),
                },
                {
                    title: "[钱]",
                    image: require("../assets/images/emote/money_thumb.gif"),
                },
                {
                    title: "[失望]",
                    image: require("../assets/images/emote/sw_thumb.gif"),
                },
                {
                    title: "[酷]",
                    image: require("../assets/images/emote/cool_thumb.gif"),
                },
                {
                    title: "[花心]",
                    image: require("../assets/images/emote/hsa_thumb.gif"),
                },
                {
                    title: "[哼]",
                    image: require("../assets/images/emote/hatea_thumb.gif"),
                },
                {
                    title: "[鼓掌]",
                    image: require("../assets/images/emote/gza_thumb.gif"),
                },
                {
                    title: "[晕]",
                    image: require("../assets/images/emote/dizzya_thumb.gif"),
                },
                {
                    title: "[悲伤]",
                    image: require("../assets/images/emote/bs_thumb.gif"),
                },
            ],
        }
    },
}
</script>
<style scoped>
@import url("../assets/css/SendEmote.css");
</style>

