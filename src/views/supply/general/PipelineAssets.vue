<!--
 * @Author: fishScola
 * @Date: 2022-10-15 17:01:23
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 15:16:08
 * @Description: 管网资产
-->
<script setup>
import { getPipeAssets } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import dayjs from "dayjs";

onMounted(() => {
  getPipeAssets().then((res) => {
    let { pipeCaliberList, pipeMaterialList } = res || {};
    // 柱状图图表
    let toChart = leakageChart.chartInfo;
    let yAxis = leakageChart.chartOpt;
    let xArr = [],
      series = [];
    for (let i = 0; i < pipeMaterialList.length; i++) {
      xArr.push(pipeMaterialList[i].material);
      series.push(pipeMaterialList[i].length);
    }
    yAxis.yAxis[0].data = xArr;
    toChart.seriesData = series;

    //饼图
    let pieCharts = pieChart.chartInfo;
    let pieSeries = [];
    let total = 0;
    for (let i = 0; i < pipeCaliberList.length; i++) {
      pieSeries.push({
        name: pipeCaliberList[i].caliber,
        value: pipeCaliberList[i].length,
      });
      total += Number(pipeCaliberList[i].length);
    }
    pieCharts.seriesData = pieSeries;
    pieCharts.total = total;
  });
});

let pieChart = reactive({
  chartInfo: {
    total: 0,
    seriesData: [],
  },
  chartOpt: {
    color: ["#2AE8BD", "#FFD03B", "#eff4ff", "#FF6A3A", "#FFDA98"],
    title: {
      text: "不同口径管网长度占比",
      left: "center",
      top: "top",
      textStyle: {
        color: "#EFF4FF",
        fontSize: 20,
      },
    },
    grid: {
      x: 8,
      y: 40,
      x2: 8,
      y2: 2,
      borderWidth: 1,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} :（{d}%）",
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
    graphic: {
      type: "text",
      left: "center",
      top: "center",
      style: {
        text: "管网总长度" + "\n" + "216.3km", // 这里修改为你的统计数字
        textAlign: "center",
        fill: "#EFF4FF",
        fontSize: 20,
      },
    },
    series: [
      {
        name: "漏损率",
        radius: ["45%", "55%"],
        type: "pie",
        data: [],
        label: {
          show: true,
          color: "#ffffff",
          position: "outside",
          formatter: function (parms) {
            return parms.percent + "%";
          },
        },
      },
    ],
  },
});

let leakageChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: "#000A18",
    color: ["none"],
    title: {
      text: "不同材质管网长度",
      left: "center",
      top: "top",
      textStyle: {
        color: "#EFF4FF",
        fontSize: 20,
      },
    },
    grid: {
      x: 8,
      y: 20,
      x2: 40,
      y2: 2,
      borderWidth: 1,
      containLabel: true,
    },
    legend: {
      top: 0,
      show: false,
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b}：{c}km",
    },
    xAxis: [
      {
        type: "value",
        axisPointer: {
          type: "shadow",
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            dashOffset: [2, 6],
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
        axisLabel: {
          show: true,
          color: "rgba(239,244,255,0.50)",
          fontSize: 16,
          lineHeight: 20,
          interval: 1,
          margin: 6,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "category",
        data: [],
        axisLabel: {
          show: true,
          color: "#eff4ff",
          fontSize: 16,
        },
      },
    ],
    series: [
      {
        type: "bar",
        barWidth: 16,
        data: [],
        showBackground: true,
        backgroundStyle: {
          color: "rgba(106,112,124,0.20)",
        },
        label: {
          show: true,
          formatter: `{c}km`,
          color: "#FFD03B",
          fontSize: 16,
          position: "right",
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255,109,62,0.35)",
              },
              {
                offset: 1,
                color: "#FFD03B",
              },
            ],
          },
        },
      },
    ],
  },
});

function chartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  opts.series[0].data = seriesData;
}

function chartPreHandler1(opts, inOptions) {
  let { seriesData, total } = inOptions;
  opts.series[0].data = seriesData;
  opts.graphic.style.text = "管网总长度" + "\n" + total + "km";
}
</script>

<template>
  <BasePanel class="component-wrapper pipeline-assets">
    <template v-slot:headerLeft>管网资产</template>
    <div class="wrap">
      <ChartView
        class="chart pieCharts"
        :chartInfo="pieChart.chartInfo"
        :chartOpt="pieChart.chartOpt"
        :preHandler="chartPreHandler1"
      ></ChartView>
      <ChartView
        class="chart"
        :chartInfo="leakageChart.chartInfo"
        :chartOpt="leakageChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.pipeline-assets {
  height: 460px;
  .wrap {
    height: 100%;
    display: flex;
  }
  .chart {
    flex: 1;
    height: 360px;
    width: 50%;
    padding: 20px 0;
  }
  .pieCharts {
    background: url("@/assets/img/supply/pieBg.png") no-repeat center center;
  }
}
</style>
