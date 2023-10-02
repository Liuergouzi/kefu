<template>
    <input ref="referenceUpload" class="FileImage serviceFileImage" name="customerService" type="file" value=""
        v-on:change="sendImage" />
</template>

<script>
export default {
    name: 'SendImage',
    methods: {
        sendMessage(data, type) {
            this.$emit('sendMessage', data, type);
        },
        //发送图片
        sendImage(e) {
            const fileObj = e.target.files[0];
            if (fileObj != null) {
                if (!/image\/\w+/.test(fileObj.type)) {
                    return alert(this.$t('text.SendImage.t1'), { icon: 5, time: 1000 });
                }
                var fd = new FormData();
                fd.append("file", fileObj);
                if (fileObj.size > 1024 * 1024 * 2 && fileObj.size < 1024 * 1024 * 10) {
                    let reader = new FileReader();
                    reader.readAsDataURL(fileObj);
                    reader.onload = (e) => {
                        let image = new Image(); //新建一个img标签（还没嵌入DOM节点)
                        image.src = e.target.result;
                        image.onload = () => {
                            let canvas = document.createElement("canvas"),
                                context = canvas.getContext("2d"),
                                imageWidth = image.width / 2, //压缩后图片的大小
                                imageHeight = image.height / 2,
                                data = "";
                            canvas.width = imageWidth;
                            canvas.height = imageHeight;
                            context.drawImage(image, 0, 0, imageWidth, imageHeight);
                            data = canvas.toDataURL("image/jpeg");
                            let newFile = this.dataURLtoFile(data); //压缩完成
                            fd = new FormData();
                            fd.append("file", newFile);
                            this.sendMessage(data, 3)
                            this.$refs.referenceUpload.value = null;
                        };
                    };
                } else if (fileObj.size > 1024 * 1024 * 10) {
                    return alert(this.$t('text.SendImage.t2'), { icon: 5, time: 1000 });
                } else {
                    let reader = new FileReader();
                    reader.readAsDataURL(fileObj);
                    reader.onload = (e) => {
                        this.sendMessage(e.target.result, 3);
                        this.$refs.referenceUpload.value = null;
                    };
                }
            }
        },
        //压缩图片
        dataURLtoFile(dataurl, filename = "file") {
            let arr = dataurl.split(",");
            let mime = arr[0].match(/:(.*?);/)[1];
            let suffix = mime.split("/")[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${filename}.${suffix}`, {
                type: mime,
            });
        },
    },
    data() {
        return {
        }
    },
}
</script>
<style scoped>
@import url("../assets/css/SendImage.css");
</style>

