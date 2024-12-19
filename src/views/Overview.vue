<!--
 * @Author: fishScola
 * @Date: 2022-10-13 09:49:51
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-06-28 08:42:32
 * @Description:
-->
<script setup>
import SceneView from "./map/SceneView.vue";
import MapDialog from "@/components/map-dialog/MapDialog.vue";
import PageHeader from "./common/PageHeader.vue";
// import PageMask from "./common/PageMask.vue";
import { projTitle } from "@/common/ProjConfig.js";
import { handleScreenAuto1, removeScreenAuto } from "@/utils/tools.js";
import { onUnmounted } from "vue";
import SupplyView from "@/views/supply/SupplyView.vue";
let info = reactive({
  thematic: {
    active: "fcdr",
  },
});
const router = useRouter();
const currentRoute = useRoute();
const url = window.location.hostname;

const thematic = []; //[{ name: '一张图', route: `http://${url}:9092/#/wel/index` }];
// 切换主题 - 主题(防汛抗旱、水资源、水利工程、城乡供水)
function thematicChanged({ type }) {
  info.thematic.active = type;
  router.push({ name: type });
}

onMounted(() => {
  info.thematic.active = currentRoute.name || "fcdr";
  handleScreenAuto1();
});
onUnmounted(() => {
  removeScreenAuto();
});

const showDialog = ref(true);

const showMap = ref(true);
const handleShowMap = (bool) => {
  showMap.value = bool;
};
</script>

<template>
  <div id="layout" class="component-wrapper information-overview">
    <PageHeader
      :toTitle="projTitle"
      :params="info.thematic"
      :thematics="thematic"
      class="page-header"
      @thematic-changed="thematicChanged"
    ></PageHeader>
    <!-- 页面蒙层 -->
    <!-- <PageMask></PageMask> -->
    <SupplyView @handle-show-map="handleShowMap"></SupplyView>
    <!-- 地图场景 -->
    <SceneView v-show="showMap" class="scene-view"></SceneView>
    <!-- 地图弹窗 -->
    <!-- <MapDialog v-if="showDialog" v-model:visible="showDialog"></MapDialog> -->
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.information-overview {
  color: #f2f2f2;
  .page-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 110px;
    // line-height: 80px;
  }
  .scene-view {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
#layout {
  background: @background-color;
  position: relative;
  overflow: hidden;
  // 自适应方案1css
  display: inline-block;
  // 现场屏幕大小 1920*1080 3328×1560
  width: 2746px; //设计稿的宽度
  height: 1545px; //设计稿的高度
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
}
</style>
