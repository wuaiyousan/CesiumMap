<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:42:58
 * @Description: MarketingOverview
-->
<script setup>
import BasePanel from "../../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";

import { getRevenue } from "@/api/business/supply/pevenueoverview.js";

let info = reactive({
  data: {},
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
});

onMounted(() => {
  getRevenue().then((res) => {
    let { totalWaterSupply, totalWaterSell, nrwData } = res || {};
    info.data = { totalWaterSupply, totalWaterSell };
    let xData = [];
    let yData = [];
    let inObj = nrwData.statisticData || {};
    for (let i in inObj) {
      xData.push(i);
      yData.push(inObj[i]);
    }
    info.chartInfo.xAxis = xData;
    info.chartInfo.seriesData = yData;
  });
});

let chartOpt = {
  title: {
    text: "产销差率",
    left: 30,
    top: 10,
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "14",
    },
  },
  tooltip: {
    trigger: "axis",
    formatter: "{b} : {c}%",
    axisPointer: {
      type: "cross",
    },
  },
  grid: {
    top: "25%",
    left: "12%",
    right: "8%",
    bottom: "10%",
    // containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisPointer: {
        type: "shadow",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      axisLabel: {
        textStyle: {
          color: "rgba(215, 240, 255, 0.8)",
          type: "dashed",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: "rgba(215, 240, 255, 0.8)",
        },
      },
      splitLine: {
        lineStyle: {
          type: "dashed", //虚线
          color: "rgba(255, 255, 255, 0.4)",
        },
        show: true, //隐藏
      },
      splitNumber: 3,
    },
  ],
  series: [
    {
      name: "",
      type: "line",
      tooltip: {
        valueFormatter: function (value) {
          return value + " %";
        },
      },
      data: [],
    },
  ],
};

// setOption前置处理
function chartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  opts.series[0].data = seriesData;
}
</script>

<template>
  <BasePanel class="component-wrapper market-overview">
    <template v-slot:headerLeft>营销总览</template>
    <div class="water-volume">
      <span class="water-supply">供水总量</span>
      <span class="quantity"
        >{{ info.data.totalWaterSupply }}<span class="company"> 万吨</span></span
      >
    </div>
    <div class="water-volume">
      <span class="water-supply">售水总量</span>
      <span class="quantity"
        >{{ info.data.totalWaterSell }}<span class="company"> 万吨</span></span
      >
    </div>
    <ChartView
      class="chartview"
      :chartInfo="info.chartInfo"
      :chartOpt="chartOpt"
      :preHandler="chartPreHandler"
    ></ChartView>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.market-overview {
  height: 400px;
  position: absolute;
  top: 100px;
  left: 10px !important;

  .content {
    padding-top: 8px;
    height: 0;
  }
  .rank-container {
    padding-top: 10px;
    height: calc(~"100% - 108px");
  }
  .rainview {
    text-align: left;
    font-size: 18px;
    padding-left: 10px;
    position: absolute;
    top: 9px;
    width: 300px;
    left: 1px;
  }
  .water-volume {
    padding-left: 20px;
    margin: 10px 0;
    margin-bottom: 0;
    display: flex;
    align-items: center;

    .water-supply {
      font-size: 18px;
      color: rgb(230, 247, 255);
      letter-spacing: 2px;
      width: 140px;
      text-align: right;
    }
    .quantity {
      margin-left: 32px;
      color: #57fffc;
      font-size: 24px;
      line-height: 28px;
      font-family: manrope-bold;
      font-weight: bold;
      font-style: normal;
      text-shadow: rgb(19 128 255) 0px 0px 10px;

      .company {
        padding-left: 4px;
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .chartview {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
    margin-top: 10px;
  }
}
.component-wrapper.base-panel.component-wrapper.market-overview .water-volume {
  padding-left: 110px !important;
}
</style>
