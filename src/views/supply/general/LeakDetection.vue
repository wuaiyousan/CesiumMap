<!--
 * @Author: fishScola
 * @Date: 2022-10-15 16:58:29
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:31:44
 * @Description: 检漏情况
-->
<script setup>
import { getLeakDetection } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import NumberCount from "@/views/common/components/NumberCount.vue";
import TimeSelect from "../components/TimeSelect.vue";

let info = reactive({
  leakagePointReport: 0,
  repairFinished: 0,
  // 时间
  timeType: "",
});

onMounted(() => {
  onTimeChange("YEAR");
});

let leakChart = reactive({
  chartInfo: {
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: "#000A18",
    title: {
      text: "预计节水",
      bottom: -4,
      left: "center",
      textStyle: {
        fontSize: 22,
        color: "#fff",
      },
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        type: "gauge",
        center: ["50%", "60%"],
        radius: "90%",
        startAngle: 200,
        endAngle: -20,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [0.1, "#0D81FF"],
              [0.5, "#0DA7FE"],
              [0.8, "#0CCBFC"],
              [1.0, "#0DD7FC"],
            ],
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          distance: -14,
          length: 14,
          splitNumber: 2,
          lineStyle: {
            color: "",
            width: 6,
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value} 吨",
          offsetCenter: [0, 0],
          color: "#fff",
          fontSize: 20,
        },
        data: [],
      },
    ],
  },
});

function chartPreHandler(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}

function onTimeChange(code) {
  info.timeType = code;
  // 数据更新
  getLeakDetection(code).then((res) => {
    let { leakagePointReport, repairFinished, waterEconomy } = res || {};
    info.leakagePointReport = leakagePointReport;
    info.repairFinished = repairFinished;
    // 预计节水
    leakChart.chartInfo.seriesData = [waterEconomy];
    console.log(leakagePointReport, repairFinished, waterEconomy, 123);
  });
}
</script>

<template>
  <BasePanel class="component-wrapper leak-detection">
    <template v-slot:headerLeft>检漏情况</template>
    <template v-slot:headerRight>
      <TimeSelect
        class="inspection-time"
        :selection="info.timeType"
        @time-change="onTimeChange"
      ></TimeSelect>
    </template>
    <div class="leak-box">
      <ChartView
        class="saving-chart"
        :chartInfo="leakChart.chartInfo"
        :chartOpt="leakChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
      <div class="leak-info">
        <p class="leak-item">
          <span class="label">漏点上报</span>
          <NumberCount
            class="value"
            :number="info.leakagePointReport"
          ></NumberCount>
        </p>
        <p class="leak-item">
          <span class="label">完成修复</span>
          <NumberCount
            class="value"
            :number="info.repairFinished"
          ></NumberCount>
        </p>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.leak-detection {
  height: 426px;

  .inspection-time {
    width: 100px;
  }

  .leak-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;

    .saving-chart {
      width: 220px;
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
