<!--
 * @Author: fishScola
 * @Date: 2022-10-13 21:28:53
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-28 20:31:13
 * @Description: 泵站
-->
<script setup>
import TypeSelections from "./components/TypeSelections.vue";
import CraftInfo from "./components/CraftInfo.vue";
import RunParams from "./components/RunParams.vue";
import VideoMonitor from "./components/VideoMonitor.vue";
import { getStationParams } from "@/api/business/supply/dispatch.js";

import pump01 from "./images/01.png";
import pump02 from "./images/02.png";

const { params } = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        id,
        name,
      };
    },
  },
});

let info = reactive({
  station: "",
  theType: "",
  typeList: [
    { code: "craft", name: "工艺信息" },
    { code: "run", name: "运行参数" },
    { code: "video", name: "视频监控" },
  ],
  // 工艺图
  processImg: "",
  // 运行参数
  showList: [],
});

let imgMap = {
  1: pump01,
  2: pump02,
};

onMounted(() => {
  let { id, name } = params || {};
  if (id) {
    info.station = name;
    getStationParams(id).then((res) => {
      // 运行参数
      let {
        feedWaterPressure,
        powerConsumption,
        waterYield,
        accumulatedWaterYield,
        outWaterPressure,
        waterInflow,
        accumulatedWaterInflow,
      } = res || {};
      onType("craft");
      if (feedWaterPressure) {
        info.showList = [
          { label: "出水量", value: waterYield },
          { label: "累计出水量", value: accumulatedWaterYield },
          { label: "出水压力", value: outWaterPressure },
          { label: "耗电量", value: powerConsumption },

          { label: "进水量", value: waterInflow },
          { label: "累计进水量", value: accumulatedWaterInflow },
          { label: "进水压力", value: feedWaterPressure },
        ];
      } else {
        info.showList = [];
      }
      // 工艺图
      info.processImg = imgMap[id];
    });
  }
});

onBeforeUnmount(() => {
  if (info) {
    info.station = "";
    info.theType = "";
  }
});

function onType(code) {
  if (info.theType === code) {
    return;
  }
  info.theType = code;
}

// 关闭
const emit = defineEmits();
function onClose() {
  emit("dialog-close");
}
</script>

<template>
  <div class="component-wrapper pump-view">
    <div class="header-box">
      <span class="title">{{ info.station }}</span>
      <TypeSelections
        class="running-types"
        :typeList="info.typeList"
        :selection="info.theType"
        @selection-change="onType"
      ></TypeSelections>
      <span class="closer" @click.stop="onClose" title="关闭"></span>
    </div>
    <div class="content-box">
      <CraftInfo
        :url="info.processImg"
        class="craft-box"
        v-if="info.theType === 'craft'"
      ></CraftInfo>
      <RunParams
        :showList="info.showList"
        class="run-box"
        v-else-if="info.theType === 'run'"
      ></RunParams>
      <VideoMonitor class="video-box" v-else="info.theType === 'video'"></VideoMonitor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.pump-view {
  padding: 10px;
  height: 360px;
  background: rgba(0, 4, 13, 0.4);
  border-radius: 10px;
  user-select: none;

  .header-box {
    padding-right: 12px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;

    .title {
      padding-left: 12px;
      color: #fff;
      font-size: 22px;
    }

    .running-types {
      margin-right: 40px;
      width: 320px;
      display: flex;
      justify-content: space-between;
    }

    .closer {
      position: absolute;
      top: 18px;
      right: 20px;
      width: 24px;
      height: 24px;
      background: url("@/assets/img/common/station/closer.svg") no-repeat;
      cursor: pointer;
    }
  }

  .content-box {
    height: calc(~"100% - 40px");
    padding: 10px;

    .craft-box {
      height: 100%;
    }

    .run-box {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    .video-box {
      height: 100%;
    }
  }
}
</style>
