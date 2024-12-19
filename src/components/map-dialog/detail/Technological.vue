<template>
    <div class="wrap">
        <div class="img">
            工艺流程图片
        </div>
        <div class="video">
            <el-container>
                <el-main style="padding: 0;">
                    <div style="width: 100%;height:480px;display: flex;flex-wrap: wrap;background-color: #000;">
                        <div v-for="i in spilt" :key="i" class="play-box" :style="liveStyle"
                            :class="{ redborder: playerIdx == (i - 1) }" @click="toPlay(i)">
                            <div v-if="!videoUrl[i - 1]" style="color: #ffffff;font-size: 30px;font-weight: bold;">{{ i }}
                            </div>
                            <!-- <player ref="player" v-else :videoUrl="videoUrl" fluent autoplay @screenshot="shot"
                                @destroy="destroy" /> -->
                        </div>
                    </div>
                </el-main>
                <el-header class="header">
                    <i class="el-icon-full-screen btn" :class="{ active: spilt == 2 }" @click="spilt = 2">2分屏</i>
                    <i class="el-icon-menu btn" :class="{ active: spilt == 4 }" @click="spilt = 4">4分屏</i>
                    <i class="el-icon-s-grid btn" :class="{ active: spilt == 6 }" @click="spilt = 6">6分屏</i>
                    <i class="el-icon-s-grid btn" :class="{ active: spilt == 8 }" @click="spilt = 8">8分屏</i>
                    <!-- <i class="el-icon-thumb btn" :class="{active:spilt==9}" @click="tofullscreenToggel">全屏</i> -->
                </el-header>
            </el-container>
        </div>
    </div>
</template>
<script>
// import player from './jessibuca.vue'
export default {
    name: 'technological',
    data() {
        return {
            spilt: 2,//分屏 
            playerIdx: 0,//激活播放器
            videoUrl: [''],
        }
    },
    components: {
        // player
    },
    computed: {
        liveStyle() {
            let style = { width: '99%', height: '49%' }
            switch (this.spilt) {
                case 4:
                    style = { width: '49%', height: '49%' }
                    break
                case 6:
                    style = { width: '33%', height: '49%' }
                    break
                case 8:
                    style = { width: '49%', height: '22%' }
                    break
            }
            this.$nextTick(() => {
                // for (let i = 0; i < this.spilt; i++) {
                //     const player = this.$refs.player
                //     player && player[i] && player[i].updatePlayerDomSize()
                // }
            })
            return style
        }
    },
    watch: {
        spilt(newValue) {
            console.log("切换画幅;" + newValue)
            let that = this
            for (let i = 1; i <= newValue; i++) {
                if (!that.$refs['player' + i]) {
                    continue
                }
                this.$nextTick(() => {
                    // if (that.$refs['player' + i] instanceof Array) {
                    //     that.$refs['player' + i][0].resize()
                    // } else {
                    //     that.$refs['player' + i].resize()
                    // }
                })

            }
            window.localStorage.setItem('split', newValue)
        }
    },
    methods: {
        shot(e) {
            // console.log(e)
            // send({code:'image',data:e})
            var base64ToBlob = function (code) {
                let parts = code.split(';base64,');
                let contentType = parts[0].split(':')[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                return new Blob([uInt8Array], {
                    type: contentType
                });
            };
            let aLink = document.createElement('a');
            let blob = base64ToBlob(e); //new Blob([content]);
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = '截图';
            aLink.href = URL.createObjectURL(blob);
            aLink.click();
        },
        playVideo() {
            this.spilt = 2
            this.$set(this.videoUrl, 0, 'https://baikevideo.cdn.bcebos.com/media/mda-Og7wRzKHv5Z824nu/0142f5b0c375ea89df3e9bda44528caf.mp4')
            let _this = this
            setTimeout(() => {
                window.localStorage.setItem('videoUrl', JSON.stringify(_this.videoUrl))
            }, 100)
        },
        toPlay(i){
            this.playerIdx = (i - 1)
            this.videoUrl='https://baikevideo.cdn.bcebos.com/media/mda-Og7wRzKHv5Z824nu/0142f5b0c375ea89df3e9bda44528caf.mp4'
            console.log('tototo');
        }
    }
}
</script>
<style  lang="less" scoped>
.wrap {
    display: flex;
    max-height: 600px;

    .img {
        width: 60%;
        background-color: pink;
        margin: 10px;
        height: 480px;
    }

    .video {
        width: 40%;
        margin: 10px
    }

    .redborder {
        border: 2px solid red !important;
    }

    .header {
        height: 60px;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
    }

    .btn {
        width: 91px;
        height: 37px;
        line-height: 37px;
        background: #ffffff;
        border: 1px solid #0a84ff;
        border-radius: 2px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #0a84ff;
        display: inline-block;
    }
    .active{
        color: #ffffff;
        background-color: #0a84ff;
    }
}
</style>