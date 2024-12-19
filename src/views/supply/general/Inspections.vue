<!--
 * @Author: fishScola
 * @Date: 2022-10-15 16:58:29
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:31:44
 * @Description: 巡检概况
-->
<script setup>
import { getPatrolOverview } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import NumberCount from "@/views/common/components/NumberCount.vue";
import dayjs from "dayjs";

let info = reactive({
  leakagePointReport: 0,
  repairFinished: 0,
  num: 1,
});

onMounted(() => {
  watchEffect(() => {
    getPatrolOverview().then((res) => {
      const { count, userCount, doneRate, monthlyYearlyData } = res;
      info.leakagePointReport = count;
      info.num = userCount;
      info.repairFinished = Number(doneRate);
      const lastSixMonths = [];
      for (let i = 5; i >= 0; i--) {
        const monthAgo = dayjs().subtract(i, "month").format("M月");

        lastSixMonths.push(monthAgo);
      }
      let lineChart = leakChart.chartInfo,
        series = [[], []];
      for (let i = 0; i < 6; i++) {
        for (let x = 0; x < monthlyYearlyData.length; x++) {
          if (
            lastSixMonths[i] ==
            dayjs(monthlyYearlyData[x].trendDate).format("M月")
          ) {
            series[0].push(monthlyYearlyData[x].count);
            series[1].push(monthlyYearlyData[x].done);
          } else {
            series[0].push(null);
            series[1].push(null);
          }
        }
      }
      lineChart.xAxis = lastSixMonths;
      lineChart.seriesData = series;
    });
  });
});

let leakChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [[], []],
  },
});
let chartOpt = {
  // backgroundColor: "#000A18",
  title: {
    text: "巡检任务与完成任务柱状图",
    left: "center",
    top: "top",
    textStyle: {
      color: "#EFF4FF",
      fontSize: 24,
    },
  },
  legend: {
    icon: "roundRect",
    top: 40,
    data: ["任务数", "完成任务数"],
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "14",
    },
  },
  tooltip: {
    trigger: "axis",
  },
  grid: {
    x: 40,
    y: 70,
    x2: 8,
    y2: 30,
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisLabel: {
        color: "rgba(239,244,255,0.50)",
        fontSize: "16px",
      },
    },
  ],
  yAxis: {
    type: "value",
    name: "个",
    axisLabel: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "16px",
    },
    splitLine: {
      lineStyle: {
        type: "dashed", //虚线
        color: "rgba(255, 255, 255, 0.4)",
      },
    },
    splitNumber: 4,
  },
  series: [
    {
      type: "bar",
      barWidth: 8,
      name: "任务数",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(255,208,59,0.5)",
            },
            {
              offset: 1,
              color: "rgba(255,208,59,0)",
            },
          ],
        },
      },
      label: {
        show: true,
        width: 16,
        height: 4,
        formatter: `{c}\n`,
        fontSize: 16,
        color: "rgba(255,208,59,1)",
        position: "insideTop",
        verticalAlign: "bottom",
        backgroundColor: "#ffd03b",
      },
      data: [],
    },
    {
      type: "bar",
      barWidth: 8,
      barGap: "100%",
      barCategoryGap: "50%",
      name: "完成任务数",
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      itemStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(29,170,138,1)",
            },
            {
              offset: 1,
              color: "rgba(0,0,0,0.5)",
            },
          ],
        },
      },
      label: {
        show: true,
        formatter: `{c}\n`,
        fontSize: 16,
        width: 16,
        height: 4,
        color: "rgba(29,170,138,1)",
        position: "top",
        verticalAlign: "bottom",
        backgroundColor: "#eff4ff",
      },
      data: [],
    },
  ],
};

// setOption前置处理
function chartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  opts.series[0].data = seriesData[0];
  opts.series[1].data = seriesData[1];
}
</script>

<template>
  <BasePanel class="component-wrapper inspections">
    <template v-slot:headerLeft>巡检概况</template>
    <div class="leak-box">
      <div class="leak-info">
        <h3>巡检统计表</h3>
        <div class="info">
          <p class="leak-item">
            <span class="label">任务总数</span>
            <span class="value">{{ info.leakagePointReport }}个</span>
          </p>
          <p class="leak-item">
            <span class="label">巡检人员</span>
            <span>{{ info.leakagePointReport }}名</span>
          </p>
          <p class="leak-item">
            <span class="label">任务完成率</span>
            <span class="value">{{ info.repairFinished }}%</span>
          </p>
        </div>
      </div>
      <ChartView
        class="saving-chart"
        :chartInfo="leakChart.chartInfo"
        :chartOpt="chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.inspections {
  height: 410px;
  .inspection-time {
    width: 100px;
  }

  .leak-box {
    display: flex;
    justify-content: space-evenly;
    height: 100%;

    .saving-chart {
      flex: 1;
      height: 100%;
    }

    .leak-info {
      width: 220px;
      h3 {
        font-size: @titleSize6;
        color: @font-color-light;
        text-align: center;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: calc(~"100% - 30px");
      }
      .leak-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 54px;
        span {
          font-size: 22px;
          color: @font-color-light;
        }
        .label {
          font-size: 22px;
          width: 130px;
          color: @font-color-major;
        }
        .value {
          display: inline-block;
          margin: 0px;
        }
      }
    }
  }
}
</style>
