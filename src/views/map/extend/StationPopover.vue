<!--
 * @Author: fishScola
 * @Date: 2022-09-28 16:15:17
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-04-01 16:55:35
 * @Description: 测站Popover
-->
<script setup>
import { notEmpty, formatVal } from "@/utils/index.js";
import UseGlobalMessage from "../../common/UseGlobalMessage";

const { params, messageTags } = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        stName: "",
        stId: "",
        stCode: "",
        sttp: "",
      };
    },
  },
  // 接受推送消息的测站类型
  messageTags: {
    type: Array,
    default: function () {
      return ["PP", "PZ", "ZZ", "SG", "SS", "VWM", "WQ", "ZG"];
    },
  },
});

const info = reactive({
  stName: "",
  flow: "",
  z: "",
  rain: "",
  mot: "",
});

onMounted(() => {
  watchEffect(() => {
    if (params.stName) {
      info.stName = params.stName;
      info.flow = params.flow;
      info.z = params.z;
      info.rain = params.rain;
      info.mot = params.mot;
    }
  });
});

// let { stCode: code, sttp } = params;
// if (notEmpty(code) && notEmpty(sttp) && messageTags.includes(sttp)) {
//   const { useWebsocketEvent } = UseGlobalMessage();
//   useWebsocketEvent(`/station/monitor/${sttp}/${code}`, callbackFn);
// }

// 订阅测站消息更新 - 回调
function callbackFn(data) {
  if (!data) {
    return;
  }
  // 监测值
  let { stName, sttp, stCode, mot, value } = data.monitor;
  if (params.sttp === sttp && params.stCode === stCode) {
    let { ra, ri, flow } = value;
    info.stName = stName;
    if (notEmpty(flow)) {
      info.flow = formatVal(flow, "m³/h");
    }
    if (notEmpty(ri)) {
      info.z = formatVal(ri, "m");
    }
    if (notEmpty(ra)) {
      info.rain = formatVal(typeof ra === "object" ? ra.tenMinute : ra, "mm");
    }
    info.mot = mot;
  }
}
</script>

<template>
  <div class="component-wrapper station-popover">
    <p class="title">{{ info.stName || "--" }}</p>
    <div class="info-list">
      <p class="info-item">
        <span class="lbl">流量：</span>
        <span class="txt">{{ info.flow }}</span>
      </p>
      <p class="info-item">
        <span class="lbl">水位：</span>
        <span class="txt">{{ info.z }}</span>
      </p>
      <p class="info-item">
        <span class="lbl">雨量：</span>
        <span class="txt">{{ info.rain }}</span>
      </p>
      <p class="info-item">
        <span class="lbl">采集时间：</span>
        <span class="txt">{{ info.mot || "--" }}</span>
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.station-popover {
  // width: 330px;
  height: 180px;
  padding: 12px 24px;

  .title {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #96faff;
    line-height: 25px;
  }

  .info-list {
    margin-top: 8px;

    .info-item {
      margin-bottom: 8px;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #ffffff;

      .lbl {
        text-align: left;
      }
      .txt {
        text-align: right;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
