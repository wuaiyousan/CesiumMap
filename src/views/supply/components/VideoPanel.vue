<!--
 * @Author: fishScola
 * @Date: 2022-06-28 11:52:34
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-13 22:17:29
 * @Description: VideoPanel
-->
<script setup>
import LivePlayer from "@liveqing/liveplayer-v3";

const props = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        url: "",
      };
    },
  },
  defaultOpts: {
    type: Object,
    default: function () {
      return {
        // 播放地址
        url: "",
        // 视频标题
        title: "",
        // 视频封面图片
        poster: "",
        // 播放器控制栏
        controls: false,
        // 隐藏截图
        hideSnapshot: true,
        // 是否直播
        live: false,
        // 是否自动播放
        autoplay: true,
        // 是否静音
        muted: true,
        // 流畅模式
        fluent: true,
        // 是否拉伸
        stretch: true,
        // 全屏 - 适应div
        aspect: "fullscreen",
        // 指示加载状态
        loading: true,
        // 隐藏起播状态下的大播放按钮
        hideBigPlay: true,
      };
    },
  },
});

const options = ref({});

onMounted(() => {
  watchEffect(() => {
    options.value = Object.assign({}, props.defaultOpts, props.params);
  });
});

onBeforeUnmount(() => {
  if (options.value) {
    options.value.url = "";
  }
  onExitFullscreen();
});

function onExitFullscreen() {
  if (flag) {
    flag.value = false;
  }
}

// 全屏或退出
const flag = ref(false);
function onFullscreen(status) {
  flag.value = status;
  if (!status) {
    onExitFullscreen();
    return;
  }
}
</script>

<template>
  <LivePlayer
    class="component-wrapper video-panel"
    :class="{ fullscreen: flag }"
    :videoUrl="options.url"
    :videoTitle="options.title"
    :poster="options.poster"
    :controls="options.controls"
    :autoplay="options.autoplay"
    :live="options.live"
    :hide-snapshot-button="options.hideSnapshot"
    :muted="options.muted"
    :fluent="options.fluent"
    :stretch="options.stretch"
    :aspect="options.aspect"
    :loading="options.loading"
    :hide-big-play-button="options.hideBigPlay"
    @fullscreen="onFullscreen"
  >
  </LivePlayer>
</template>

<style lang="less">
.component-wrapper.video-panel {
  position: relative;
  width: 100%;
  height: 100%;
  // overflow: hidden;

  .video-wrapper .video-js {
    background-color: rgba(32, 46, 71, 0.6);

    .video-title {
      top: 4px;
      right: unset;
      left: 4px;
      padding: 4px 6px;
      max-width: 80%;
      font-size: 16px;
    }
  }
}
</style>
