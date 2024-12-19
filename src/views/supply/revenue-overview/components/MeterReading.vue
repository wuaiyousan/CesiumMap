<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:45:24
 * @Description: MeterReading
-->
<script setup>
import BasePanel from "../../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import dayjs from "dayjs";

import { getMeterReading } from "@/api/business/supply/pevenueoverview.js";

let info = reactive({
  data: {},
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
});

onMounted(() => {
  getMeterReading().then((res) => {
    let { promiseNum, realityNum, finishRate } = res || {};
    info.data = { promiseNum, realityNum };
    let xData = [];
    let yData = [];
    let inObj = finishRate.statisticData || {};
    for (let i in inObj) {
      if (i !== undefined) {
        xData.push(dayjs(i).format("M月"));
        yData.push(inObj[i]);
      }
    }
    info.chartInfo.xAxis = xData;
    info.chartInfo.seriesData = yData;
  });
});

let chartOpt = {
  title: {
    text: "抄表完成率",
    left: 40,
    top: 10,
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "14",
    },
  },
  color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
  tooltip: {
    trigger: "axis",
    formatter: "{b} : {c}%",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    icon: "roundRect",
    top: 10,
    bottom: 10,
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "14",
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
      axisLabel: {
        textStyle: {
          color: "rgba(215, 240, 255, 0.8)",
        },
        interval: 1,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
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
      splitNumber: 4,
    },
  ],
  series: [
    {
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgb(0, 221, 255)",
            },
            {
              offset: 1,
              color: "rgb(77, 119, 255)",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
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
  <BasePanel class="component-wrapper MeterReading">
    <template v-slot:headerLeft>
      <div>抄表分析</div>
    </template>
    <div class="water-volume">
      <span class="water-supply">当期应抄</span>
      <span class="quantity"
        >{{ info.data.promiseNum }} <span class="company">只</span></span
      >
    </div>
    <div class="water-volume">
      <span class="water-supply">当期实抄</span>
      <span class="quantity"
        >{{ info.data.realityNum }} <span class="company">只</span></span
      >
    </div>
    <!-- <div>
      <p class="leakage-rate">抄表完成率</p>
    </div> -->

    <ChartView
      class="chartview"
      :chartInfo="info.chartInfo"
      :chartOpt="chartOpt"
      :preHandler="chartPreHandler"
    ></ChartView>
  </BasePanel>
</template>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.MeterReading {
  height: 400px;
  position: absolute;
  top: 100px;
  right: 10px !important;

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
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #e1feff;
    line-height: 29px;
    letter-spacing: 4px;
  }
  .water-volume {
    padding-left: 110px;
    margin: 20px 0;
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
  .leakage-rate {
    margin-bottom: 10px;
    margin-top: 20px;
    height: 30px;
    line-height: 30px;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(162, 210, 255, 0) 0%,
      rgba(115, 173, 255, 0.3) 50%,
      rgba(105, 166, 255, 0) 100%
    );
    color: #cbfdff;
  }
  .chartview {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .header-box {
    width: 100%;
    height: 38px;
    background: url("@/assets/img/common/title-bg.png") no-repeat;
    background-size: 100% 100%;
  }
}
.component-wrapper.base-panel.component-wrapperMeterReading
  .component-wrapper.chart-view {
  width: 500px;
  height: 180px;
}
</style>
