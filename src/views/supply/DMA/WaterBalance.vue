<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-25 11:10:14
 * @Description: RealRainfall
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import { getWaterBalance } from "@/api/business/supply/dma.js";
import ChartView from "@/views/common/components/ChartView.vue";
import dayjs from "dayjs";

let info = reactive({
  data: [],
  chartInfo: {
    seriesData: [],
  },
  funnelChartInfo: {
    seriesData: [],
  },
});

const pickerOptions = (time) => {
  return time.getTime() > Date.now();
};

const selectedMonth = ref(dayjs().subtract(1, "months").format("YYYY-MM"));
let funnelChartOpt = {
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} m³",
    textStyle: {
      color: "black",
    },
  },
  color: ["#00E8FF", "#29FF98", "#0095FF", "#FFC102", "#FF6A29", "#FF5754"],
  grid: {
    x: 40,
    y: 30,
    x2: 8,
    y2: 0,
    // containLabel: true
  },
  series: [
    {
      name: "Expected",
      type: "funnel",
      top: 0,
      bottom: 100,
      width: "40%",
      orient: "vertical",
      left: "center",
      label: {
        formatter: `{c}万m³`,
        color: "#00E8FF",
        fontSize: 16,
        position: "right",
        rich: {
          title: {
            lineHeight: 20,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.8)",
          },
          number: {
            fontSize: 18,
          },
        },
      },
      labelLine: {
        show: false,
      },
      itemStyle: {
        opacity: 0.9,
      },
      emphasis: {
        label: {
          position: "outside",
          //   formatter: '{b}Expected: {c}%'
        },
      },
      data: [],
    },
  ],
};
let chartOpt = {
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} m³（{d}%）",
    show: true,
  },
  color: ["#00E8FF", "#29FF98", "#0095FF", "#FFC102", "#FF6A29", "#FF5754"],
  legend: {
    top: "80%",
    left: "center",
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: 16,
    },
  },
  yAxis: {
    show: false,
  },
  xAxis: {
    show: false,
  },
  series: [
    {
      name: [],
      type: "pie",
      radius: ["26%", "36%"],
      center: ["50%", "55%"],
      top: -80,
      avoidLabelOverlap: false,
      label: {
        show: true,
        color: "#00E8FF",
        fontSize: 14,
        formatter: `{d}%`,
        rich: {
          title: {
            lineHeight: 20,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.8)",
          },
          number: {
            fontSize: 18,
          },
        },
      },
      labelLine: {
        show: true,
      },
      data: [],
    },
  ],
};
onMounted(() => {
  getData();
});

function getData() {
  getWaterBalance({ date: selectedMonth.value }).then((result) => {
    info.chartInfo.seriesData = [
      { value: Number(result.chargingWater), name: "计费用水量" },
      { value: Number(result.freeWater), name: "免费用水量" },
      { value: Number(result.leakWater), name: "漏损水量" },
    ];
    info.funnelChartInfo.seriesData = [
      { value: Number(result.chargingWater), name: "计费用水量" },
      { value: Number(result.freeWater), name: "免费用水量" },
      { value: Number(result.leakWater), name: "漏损水量" },
    ];
  });
}
function chartPreHandler(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}
function funnelChartPreHandler(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}

const timeChange = (time) => {
  selectedMonth.value = time;
  getData();
};
</script>

<template>
  <BasePanel class="component-wrapper water-balance">
    <template v-slot:headerLeft>水平衡分析</template>
    <template v-slot:headerRight>
      <div class="head-right">
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          size="large"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          style="width: 180px"
          :editable="false"
          :clearable="false"
          :disabled-date="pickerOptions"
          @change="timeChange"
        >
        </el-date-picker>
      </div>
    </template>
    <ChartView
      class="chartview"
      :chartInfo="info.chartInfo"
      :chartOpt="chartOpt"
      :preHandler="chartPreHandler"
    ></ChartView>
    <ChartView
      class="chart2"
      :chartOpt="funnelChartOpt"
      :chartInfo="info.funnelChartInfo"
      :preHandler="funnelChartPreHandler"
    >
    </ChartView>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.water-balance {
  height: 550px;
  background: @panelBgColor;
  .content {
    padding-top: 8px;
    .chartview {
      width: 100%;
      height: 280px;
    }
  }

  .chart2 {
    height: 250px;
  }
}
</style>
