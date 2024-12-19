<!--
 * @Author: fishScola
 * @Date: 2022-10-15 22:34:31
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:31:09
 * @Description: 服务指标排行
-->
<script setup>
import { getServiceRank } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import NumberCount from "@/views/common/components/NumberCount.vue";
import SplideView from "@/views/common/components/SplideView.vue";

const { colors } = defineProps({
  colors: {
    type: [Array, String],
    default: function () {
      return [
        { color: "#29FF98", percentage: 20 },
        { color: "#0095FF", percentage: 40 },
        { color: "#FFC102", percentage: 60 },
        { color: "#FF6A29", percentage: 80 },
        { color: "#FF5754", percentage: 100 },
      ];
    },
  },
});

let info = reactive({
  splideOption: {},
  splideList: [],
  // 话务情况
  yearTraffic: 0,
  yearServiceOrder: 0,
  rate: 0,
});

onMounted(() => {
  getServiceRank().then((res) => {
    let { rankServiceVOS, rate, yearServiceOrder, yearTraffic } = res || {};
    info.yearTraffic = yearTraffic;
    info.yearServiceOrder = yearServiceOrder;
    info.rate = Number(rate.replace("%", ""));
    // 滚动列表
    let arr = []
      .concat(rankServiceVOS)
      .map((it, index) => Object.assign({ order: index + 1 }, it));
    info.splideList = [];
    nextTick(() => {
      showByParams(arr.length);
      info.splideList = arr;
    });
  });
});

// 滚动列表
function showByParams(num, limit = 6, height = 42) {
  let toH = 250;
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
  height: "250px",
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
  <BasePanel class="component-wrapper service-ranking">
    <template v-slot:headerLeft>服务指标排行</template>
    <!-- <SplideView
      class="ranking-splide"
      v-if="info.splideList.length"
      :splide="info.splideOption"
      :tableList="info.splideList"
    >
      <template v-slot:splideHeader>
        <div class="table-head">
          <span class="order">序号</span>
          <span class="name">姓名</span>
          <span class="rate">完成率</span>
          <span class="status">完成情况</span>
        </div>
      </template>
      <template v-slot:default="{ item }">
        <span class="order">{{ item.order }}</span>
        <span class="name">{{ item.name }}</span>
        <span class="rate">{{ item.finishRate }}</span>
        <span class="status">{{ item.finishNum }}</span>
      </template>
    </SplideView>
    <div v-else class="empty-tips">
      <img class="null-img" :src="NullImg" alt="" />
      暂无数据
    </div> -->
    <!-- 满意率 -->
    <div class="service-index">
      <el-progress
        class="service-chart"
        type="circle"
        :percentage="info.rate"
        :color="colors"
        stroke-width="8"
      />
      <div class="leak-info">
        <p class="leak-item">
          <span class="label">年度话务</span>
          <NumberCount class="value" :number="info.yearTraffic"></NumberCount>
        </p>
        <p class="leak-item">
          <span class="label">年客服单</span>
          <NumberCount
            class="value"
            :number="info.yearServiceOrder"
          ></NumberCount>
        </p>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.service-ranking {
  height: 500px;

  :deep(.content) {
    padding: 20px 20px 0;
  }

  .ranking-splide {
    height: calc(~"100% - 160px");

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
      font-size: 14px;
      .order {
        width: 50px;
      }
      .name {
        width: 150px;
      }

      .rate,
      .status {
        width: 90px;
      }
    }
  }
  .empty-tips {
    height: calc(~"100% - 160px");
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

  .service-index {
    // padding-top: 8px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    .service-chart {
      width: 260px;
      display: flex;
      justify-content: center;

      :deep(.el-progress__text) {
        color: #fff;
      }
    }

    .leak-info {
      width: 220px;

      .leak-item {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;

        .label {
          font-size: 22px;
          width: 180px;
          text-align: center;
          color: #fff;
        }

        .value {
          margin: 0 12px;

          :deep(.number-item > span) {
            background: transparent;
            color: #57fffc;
          }
        }
      }
    }
  }
}
</style>
