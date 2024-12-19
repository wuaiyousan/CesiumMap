<!--
 * @Author: fishScola
 * @Date: 2022-10-13 22:07:00
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-28 19:41:35
 * @Description: 视频监控
-->
<script setup>
import VideoPanel from "../../components/VideoPanel.vue";

const { videoList } = defineProps({
  videoList: {
    type: Array,
    default: function () {
      return [
        {
          url: "",
          name: "video-01",
        },
        // {
        //   url:
        //     "https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-720p.flv",
        //   name: "video-02",
        // },
      ];
    },
  },
});
</script>

<template>
  <div class="component-wrapper video-monitor">
    <VideoPanel
      class="video-item"
      v-for="(item, index) in videoList"
      :key="index"
      :params="item"
    ></VideoPanel>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.video-monitor {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;

  .video-item {
    // width: 49%;
    height: 100%;
  }
}
</style>
