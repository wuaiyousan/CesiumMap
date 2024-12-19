<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: fishScola
 * @LastEditTime: 2023-01-16 16:15:06
 * @Description: 调度指令
-->
<script setup>
import { getInstructionInfo } from "@/api/business/supply/dispatch.js";
import dayjs from "dayjs";
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";

let info = reactive({
  splideOption: {},
  splideList: [],
});

onMounted(() => {
  getInstructionInfo().then((res) => {
    let statusMap = {
      SUCCESS: "成功",
      FAILURE: "失败",
    };
    let toArr = [].concat(res).map((it, index) =>
      Object.assign(
        {
          order: index + 1,
          status: statusMap[it.executionStatus],
          time: dayjs(it.sendTime).format("MM-DD HH:mm"),
        },
        it
      )
    );
    info.splideList = [];
    nextTick(() => {
      showByParams(toArr.length);
      info.splideList = toArr;
    });
  });
});

function showByParams(num, limit = 4, height = 52) {
  let toH = 212;
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
  height: "212px",
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
  <BasePanel class="component-wrapper dispatch-order">
    <template v-slot:headerLeft>调度指令</template>
    <SplideView
      class="dispatch-splide"
      v-if="info.splideList.length"
      :splide="info.splideOption"
      :tableList="info.splideList"
    >
      <template v-slot:splideHeader>
        <div class="table-head">
          <span class="order">序号</span>
          <span class="name">指令名称</span>
          <span class="time">发送时间</span>
          <span class="status">执行</span>
        </div>
      </template>
      <template v-slot:default="{ item }">
        <span class="order">{{ item.order }}</span>
        <span class="name">{{ item.instructionName }}</span>
        <span class="time">{{ item.time }}</span>
        <span class="status">{{ item.status }}</span>
      </template>
    </SplideView>
    <div v-else class="empty-tips">
      <img class="null-img" :src="NullImg" alt="" />
      暂无数据
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.dispatch-order {
  height: 360px;

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
      font-size: 16px;
    }

    .splide-column {
      font-size: 16px;
      .order {
        width: 50px;
      }
      .name {
        width: 240px;
      }
      .time {
        width: 140px;
      }

      .status {
        width: 72px;
      }
    }
  }

  .empty-tips {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    .null-img {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
