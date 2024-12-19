<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-25 10:07:01
 * @Description: 站点监测
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import UseGlobalScene from "../../map/uses/UseGlobalScene";
import TypeSelections from "./components/TypeSelections.vue";
import { getSiteSurvey } from "@/api/business/supply/dispatch.js";
import dayjs from "dayjs";
import PPListInfo from "@/assets/json/monitor/PPList.json";

import MS301ListInfo from "@/assets/json/monitor/MS301List.json";
import MS304ListInfo from "@/assets/json/monitor/MS304List.json";
import WQ001ListInfo from "@/assets/json/monitor/WQ001List.json";
import CCAM010ListInfo from "@/assets/json/monitor/CCAM010List.json";

const { isLocal } = defineProps({
  // 加载 本地 所有监测点
  isLocal: {
    type: Boolean,
    default: function () {
      return true;
    },
  },
});

let info = reactive({
  theType: "",
  // splide
  splideOption: {},
  splideList: [],
});

onMounted(() => {
  if (isLocal) {
    info.theType = "PP";
    window.setTimeout(() => {
      let allStation = [
        ...MS301ListInfo,
        ...MS304ListInfo,
        ...WQ001ListInfo,
        ...CCAM010ListInfo,
      ];
      showMonitorList(allStation);
    }, 1500);
  } else {
    onType("FLOW");
  }
});

// 监测类型
function onType(code) {
  if (info.theType === code) {
    return;
  }
  info.theType = code;
  // 获取数据后更新
  getSiteSurvey(code).then((res) => {
    showMonitorList(res);
  });
}

// 处理返回记录并添加到滚动列表
function showMonitorList(res) {
  let toArr = [].concat(res).map((it, index) => {
    let { properties, geometry } = it;
    return Object.assign({}, properties, {
      updateTime: showTime(properties.updateTime),
      order: index + 1,
      position: lonlatByGeom(geometry),
    });
  });
  info.splideList = [];
  nextTick(() => {
    showByParams(toArr.length);
    info.splideList = toArr;
  });
}

function showTime(time, fmt = "MM-DD HH:mm") {
  if (time) {
    return dayjs(time).format(fmt);
  } else {
    return "--";
  }
}

function showByParams(num, limit = 5, height = 52) {
  let toH = isLocal ? 310 : 220;
  if (num > limit) {
    info.splideOption = Object.assign({}, splideTmpl, {
      height: `${toH}px`,
      start: 0,
      perPage: limit,
      autoplay: true,
    });
  } else {
    toH = Math.max(0, (num - 1) * height + (height - 2));
    info.splideOption = Object.assign({}, splideTmpl, {
      height: `${toH}px`,
      start: 0,
      perPage: num,
      autoplay: false,
    });
  }
}

let splideTmpl = {
  type: "loop",
  // rewind: true,
  direction: "ttb",
  autoplay: false,
  interval: 2000,
  height: "220px",
  gap: "2px",
  start: 0,
  perPage: 5,
  perMove: 1,
  arrows: false,
  pagination: false,
  pauseOnHover: true,
};

// 点击滚动列表项
const { flyToPosition } = UseGlobalScene();
function onSlideClick(it) {
  if (it && it.position) {
    flyToPosition(it.position);
  }
}

function lonlatByGeom(geom) {
  if (!geom) {
    return null;
  }
  let { type, coordinates } = geom;
  if (type === "Point") {
    return {
      lon: coordinates[0],
      lat: coordinates[1],
    };
  } else {
    return null;
  }
}
import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper station-monitor">
    <template v-slot:headerLeft>站点监测</template>
    <TypeSelections
      v-show="!isLocal"
      class="monitor-types"
      :selection="info.theType"
      @selection-change="onType"
    ></TypeSelections>
    <div class="splide-box" :class="{ full: isLocal }">
      <SplideView
        v-if="info.splideList.length"
        :splide="info.splideOption"
        :tableList="info.splideList"
        @slide-click="onSlideClick"
      >
        <template v-slot:splideHeader>
          <div class="table-head" v-if="info.theType === 'WQ'">
            <span class="order">序号</span>
            <span class="poi">监测点</span>
            <span class="turbidity"> 浊度<br />NTU </span>
            <span class="cl"> 余氯<br />mg/L </span>
            <span class="ph">PH</span>
            <span class="time">监测时间</span>
          </div>
          <div class="table-head" v-else>
            <span class="order">序号</span>
            <span class="poi">监测点</span>
            <span class="value" v-show="info.theType === 'FLOW'">
              流量（m³/h）
            </span>
            <span class="value" v-show="info.theType === 'STRESS'">
              压力（MPa）
            </span>
            <span class="value" v-show="info.theType === 'PP'"> 监测值 </span>
            <span class="time">监测时间</span>
          </div>
        </template>
        <template v-slot:default="{ item }" v-if="info.theType === 'WQ'">
          <span class="order">{{ item.order }}</span>
          <span class="poi">{{ item.detectionPointName }}</span>
          <span class="turbidity">{{ item.turbidity }}</span>
          <span class="cl">{{ item.residualChlorine }}</span>
          <span class="ph">{{ item.ph }}</span>
          <span class="time">{{ item.updateTime }}</span>
        </template>
        <template
          v-slot:default="{ item }"
          v-else-if="['FLOW', 'STRESS'].includes(info.theType)"
        >
          <span class="order">{{ item.order }}</span>
          <span class="poi">{{ item.detectionPointName }}</span>
          <span class="value">{{ item.currentValue }}</span>
          <span class="time">{{ item.updateTime }}</span>
        </template>
        <template
          v-slot:default="{ item }"
          v-else-if="['PP'].includes(info.theType)"
        >
          <span class="order">{{ item.order }}</span>
          <span class="poi">{{ item.deviceName }}</span>
          <span class="value">{{ item.currentValue || 0.0 }}</span>
          <span class="time">{{ item.updateTime }}</span>
        </template>
      </SplideView>
      <div v-else class="empty-tips">
        <img class="null-img" :src="NullImg" alt="" />
        暂无数据
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.station-monitor {
  height: 420px;

  .monitor-types {
    margin-bottom: 12px;

    .selection-type {
      width: 180px;
      text-align: center;
    }
  }

  .splide-box {
    height: calc(~"100% - 52px");

    &.full {
      height: 100%;
    }

    .empty-tips {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      .null-img {
        width: 80px;
        height: 80px;
      }
    }

    .table-head {
      width: 100%;
      height: 68px;
      display: flex;
      background-color: @tableHeadBg;
      font-family: PingFangSC-Medium;
      line-height: 68px;
      color: @tableHeadColor;
      font-size: 14px;
    }

    .splide-column {
      font-size: 14px;
      .order {
        width: 44px;
      }
      .poi {
        width: 160px;
      }
      .value {
        // display: inline-block;
        // margin-top: 3px;
        // line-height: 22px;
        width: 120px;
      }
      .time {
        width: 110px;
      }

      .turbidity {
        display: inline-block;
        margin-top: 3px;
        width: 80px;
        line-height: 22px;
      }
      .cl {
        display: inline-block;
        margin-top: 3px;
        width: 90px;
        line-height: 22px;
      }
      .ph {
        width: 52px;
      }
    }
  }
}
</style>
