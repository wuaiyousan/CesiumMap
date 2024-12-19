<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:27:17
 * @Description: 预警信息
-->
<script setup>
import {
  getWaringStatistics,
  getWaringList,
} from "@/api/business/supply/dispatch.js";
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import WarningItem from "./components/WarningItem.vue";

let info = reactive({
  pressure: {
    percent: 0,
    lable: "压力预警",
    text: 0,
    unit: "个",
  },
  flow: {
    percent: 0,
    lable: "流量预警",
    text: 0,
    unit: "个",
  },
  wq: {
    percent: 0,
    lable: "水质预警",
    text: 0,
    unit: "个",
  },
  total: 0,
  // 预警列表
  splideOption: {},
  splideList: [],
  infoDisabled: true,
});

onMounted(() => {
  // 预警列表
  getWaringList().then((res) => {
    let toArr = [];
    [].concat(res || []).forEach((item, index) => {
      let obj = {
        info: "",
        altinfo: "",
      };
      obj.name = item.eventName;
      obj.order = index + 1;
      let length = item.alarmDataList.length;
      if (length) {
        if (length < 3) {
          info.infoDisabled = true;
          item.alarmDataList.forEach((items, index) => {
            obj.info += items.elementName + "：" + items.value + "\n";
            obj.altinfo = "";
          });
        } else {
          info.infoDisabled = false;
          item.alarmDataList.forEach((items, index) => {
            obj.info += items.elementName + "：" + items.value + "\n";
            obj.altinfo += items.elementName + "：" + items.value + "\n";
          });
        }
      }
      toArr.push(obj);
    });

    info.splideList = [];
    nextTick(() => {
      showByParams(toArr.length);
      info.splideList = toArr;
    });
  });
  // 预警统计
  getWaringStatistics().then((res) => {
    let { waringTypeInfoVOS, waringTotal } = res || {};
    info.total = waringTotal;
    // 预警情况
    [].concat(waringTypeInfoVOS).forEach((it) => {
      if (it) {
        let { waringType, percent, waringNumber } = it;
        switch (waringType) {
          case "waterPres":
            info.pressure.percent = formatRateVal(percent);
            info.pressure.text = waringNumber;
            break;
          case "flowAmount":
            info.flow.percent = formatRateVal(percent);
            info.flow.text = waringNumber;
            break;
          case "waterQuality":
            info.wq.percent = formatRateVal(percent);
            info.wq.text = waringNumber;
            break;
          default:
            break;
        }
      }
    });
  });
});

function formatRateVal(val, tag = "%") {
  return Number(val.replace(tag, ""));
}

function showByParams(num, limit = 5, height = 52) {
  let toH = 286;
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
  height: "286px",
  gap: "2px",
  start: 0,
  perPage: 5,
  perMove: 1,
  arrows: false,
  pagination: false,
  pauseOnHover: true,
};
import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper warning-info">
    <template v-slot:headerLeft>预警信息</template>
    <template v-slot:headerRight>
      <span class="summary">{{ info.total }}</span
      >&nbsp;个
    </template>
    <div class="warning-total">
      <WarningItem :params="info.pressure"></WarningItem>
      <WarningItem :params="info.flow"></WarningItem>
      <WarningItem :params="info.wq"></WarningItem>
    </div>
    <div class="splide-box">
      <SplideView
        class="dispatch-splide"
        v-if="info.splideList.length"
        :splide="info.splideOption"
        :tableList="info.splideList"
      >
        <template v-slot:splideHeader>
          <div class="table-head">
            <span class="order">序号</span>
            <span class="name">设备名称</span>
            <span class="info">报警信息</span>
            <!-- <span class="value">报警值</span> -->
          </div>
        </template>
        <template v-slot:default="{ item }">
          <span class="order">{{ item.order }}</span>
          <span class="name">{{ item.name }}</span>
          <el-tooltip
            popper-class="altItem"
            effect="light"
            :disabled="info.infoDisabled"
            :content="item.altinfo"
            placement="top"
          >
            <span class="info">{{ item.info }}</span>
          </el-tooltip>
          <!-- <span class="value">{{ item.alarmValue }}</span> -->
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
.component-wrapper.warning-info {
  height: 600px;

  .summary {
    height: 20px;
    font-size: 18px;
    font-weight: 400;
    color: #96faff;
    line-height: 28px;
  }

  .warning-total {
    display: flex;
    justify-content: space-evenly;
  }

  .splide-box {
    height: calc(~"100% - 156px");
    padding-top: 10px;
  }

  .dispatch-splide {
    height: 100%;

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
      white-space: nowrap;
      text-overflow: ellipsis;
      .order {
        width: 50px;
      }

      .name {
        width: 310px;
      }

      .type,
      .info {
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
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
}
</style>
<style lang="less">
.altItem {
  width: 300px;
  background-color: black !important;
  color: #57fffc;
  font-size: 16px;
}
</style>
