<!--
 * @Author: fishScola
 * @Date: 2022-10-13 16:28:10
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-06 10:42:48
 * @Description: 供水监控
-->
<script setup>
import { getSupplyMonitor } from "@/api/business/supply/dispatch.js";
import dayjs from "dayjs";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";

let prodChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: '#000A18',
    color: ["#30C1FF", "#1CF8CC"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      x: 36,
      y: 40,
      x2: 12,
      y2: 12,
      borderWidth: 1,
      containLabel: true,
    },
    legend: {
      itemWidth: 24,
      itemHeight: 14,
      itemGap: 20,
      icon: "",
      textStyle: {
        fontSize: 14,
        lineHeight: 24,
        color: "rgba(215, 240, 255, 0.8)",
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false,
        },
        data: [],
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.8)",
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(215, 240, 255, 0.8)",
          fontSize: 14,
          interval: 1,
          formatter: "{value}",
          margin: 8,
        },
      },
    ],
    yAxis: [
      {
        name: "",
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.8)",
          align: "right",
          padding: [0, -20, 0, -16],
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.4)",
            type: "dashed",
            dashOffset: [2, 6],
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(215, 240, 255, 0.8)",
          fontSize: 14,
        },
      },
      {
        name: "",
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.8)",
          align: "right",
          padding: [0, 0, 0, -16],
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.4)",
            type: "dashed",
            dashOffset: [2, 6],
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(215, 240, 255, 0.8)",
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: "",
        type: "line",
        smooth: true,
        barWidth: 16,
        yAxisIndex: 0,
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(48,193,255, 0.6)",
              },
              {
                offset: 1,
                color: "rgba(13,70,106, 0)",
              },
            ],
          },
        },
        lineStyle: {
          color: "#30C1FF",
        },
        data: [],
      },
      {
        name: "",
        type: "line",
        smooth: true,
        barWidth: 16,
        yAxisIndex: 1,
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(28,248,204, 0.6)",
              },
              {
                offset: 1,
                color: "rgba(13,70,106, 0)",
              },
            ],
          },
        },
        lineStyle: {
          color: "#1CF8CC",
        },
        data: [],
      },
    ],
  },
});

let supplyChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: '#000A18',
    color: ["#30C1FF", "#1CF8CC"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      x: 36,
      y: 40,
      x2: 12,
      y2: 12,
      borderWidth: 1,
      containLabel: true,
    },
    legend: {
      itemWidth: 24,
      itemHeight: 14,
      itemGap: 20,
      icon: "rect",
      textStyle: {
        fontSize: 14,
        lineHeight: 24,
        color: "rgba(215, 240, 255, 0.8)",
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false,
        },
        data: [],
        axisLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.8)",
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(215, 240, 255, 0.8)",
          fontSize: 14,
          interval: 1,
          formatter: "{value}",
          margin: 8,
        },
      },
    ],
    yAxis: [
      {
        name: "吨",
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.8)",
          align: "right",
          padding: [0, -20, 0, -16],
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.4)",
            type: "dashed",
            dashOffset: [2, 6],
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(215, 240, 255, 0.8)",
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: "",
        type: "line",
        barWidth: 16,
        symbolSize: 8,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(48,193,255, 0.6)",
              },
              {
                offset: 1,
                color: "rgba(13,70,106, 0)",
              },
            ],
          },
        },
        lineStyle: {
          color: "#30C1FF",
        },
        data: [],
      },
      {
        name: "",
        type: "line",
        barWidth: 16,
        symbolSize: 8,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(28,248,204, 0.6)",
              },
              {
                offset: 1,
                color: "rgba(13,70,106, 0)",
              },
            ],
          },
        },
        lineStyle: {
          color: "#1CF8CC",
        },
        data: [],
      },
    ],
  },
});

// 供水能耗 - 供水量统计
function chartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  seriesData.forEach((it, index) => {
    opts.series[index].name = it.name;
    opts.series[index].data = it.yList;
  });
}

function prodChartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  seriesData.forEach((it, index) => {
    opts.series[index].name = it.name;
    opts.series[index].data = it.yList;
    opts.yAxis[index].name = it.unit;
  });
}

onMounted(() => {
  Promise.all([
    getSupplyMonitor("WATER_CONSUME"),
    getSupplyMonitor("WATER_STATISTICS"),
  ]).then((arr) => {
    let prodList = []
      .concat(arr[0])
      .map(formatSeries)
      .filter((it) => it);
    let supplyList = []
      .concat(arr[1])
      .map(formatSeries)
      .filter((it) => it);
    // 供水监控
    let toProd = prodChart.chartInfo;
    toProd.xAxis = (prodList[0] && prodList[0].xList) || [];
    toProd.seriesData = prodList;
    let toSupply = supplyChart.chartInfo;
    toSupply.xAxis = (supplyList[0] && supplyList[0].xList) || [];
    toSupply.seriesData = supplyList;
  });
});

function formatSeries(item) {
  let prodObj = {
    POWER_CONSUMPTION: {
      name: "电耗",
      unit: "千瓦",
    },
    TONS_Of_WATER_CONSUMPTION: {
      name: "吨水电耗",
      unit: "千瓦时/吨",
    },
  };
  let { name, statisticData } = item || {};
  if (Object.keys(statisticData).length) {
    let xList = [];
    let yList = [];
    for (let key in statisticData) {
      xList.push(dayjs(key).format("M月"));
      yList.push(statisticData[key]);
    }
    let itInfo = prodObj[name] || { name, unit: "" };
    return {
      xList,
      yList,
      ...itInfo,
    };
  } else {
    return null;
  }
}
</script>

<template>
  <BasePanel class="component-wrapper supply-monitor">
    <template v-slot:headerLeft>供水监控</template>
    <div class="chart-title">
      <span class="chart-icon"></span>供水能耗
    </div>
    <ChartView
      class="production-chart"
      :chartInfo="prodChart.chartInfo"
      :chartOpt="prodChart.chartOpt"
      :preHandler="prodChartPreHandler"
    ></ChartView>
    <div class="chart-title">
      <span class="chart-icon"></span>供水量统计
    </div>
    <ChartView
      class="supply-chart"
      :chartInfo="supplyChart.chartInfo"
      :chartOpt="supplyChart.chartOpt"
      :preHandler="chartPreHandler"
    ></ChartView>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.supply-monitor {
  height: 540px;

  .chart-title {
    margin-bottom: 10px;
    margin-left: 30px;
    height: 30px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 500;
    text-align: center;
    color: #cbfdff;
    display: flex;
    align-items: center;

    .chart-icon {
      width: 30px;
      height: 24px;
      background: url('@/assets/img/common/right-anchor.svg') no-repeat;
    }
  }

  .production-chart {
    height: 180px;
  }

  .supply-chart {
    height: 180px;
  }
}
</style>
