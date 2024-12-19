<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: fishScola
 * @LastEditTime: 2023-06-06 11:23:24
 * @Description: 漏损率与产销差率历史变化趋势
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import { getnrw } from "@/api/business/supply/dma.js";
import dayjs from "dayjs";
const selectedMonth = ref([
  dayjs().subtract(6, "months").format("YYYY-MM"),
  dayjs().subtract(1, "months").format("YYYY-MM"),
]);
const pickerOptions = (time) => {
  return time.getTime() > Date.now();
};
let info = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
});

onMounted(() => {
  getData();
});

function getData() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
  };
  getnrw(params).then((res) => {
    let toChartObj = info.chartInfo;
    let xData = [];
    let yData = [];
    let y1Data = [];
    for (let i in res[0].statisticData) {
      xData.push(dayjs(i).format("M月"));
      yData.push(res[0].statisticData[i]);
    }
    for (let i in res[1].statisticData) {
      y1Data.push(res[1].statisticData[i]);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = [yData, y1Data];
  });
}

let chartOpt = {
  title: {
    text: "漏损率产销差率趋势图",
    left: "center",
    top: "top",
    textStyle: {
      color: "#EFF4FF",
      fontSize: 18,
    },
  },
  color: ["rgb(0, 149, 255)", "rgb(255, 193, 2)"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    data: ["产销差率", "漏损率"],
    icon: "roundRect",
    bottom: 0,
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "16",
    },
  },
  grid: {
    x: 40,
    y: 30,
    x2: 8,
    y2: 50,
    // containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisLabel: {
        color: "rgba(215, 240, 255, 0.8)",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.8)",
        },
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
        color: "rgba(215, 240, 255, 0.8)",
        fontSize: 14,
        formatter: "{value}",
        interval: 1,
      },
      splitLine: {
        lineStyle: {
          type: "dashed", //虚线
          color: "rgba(255, 255, 255, 0.4)",
        },
        show: true, //隐藏
      },
    },
  ],
  series: [
    {
      name: "产销差率",
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      showSymbol: true,
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      name: "漏损率",
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      showSymbol: false,
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
  opts.series[0].data = seriesData[0];
  opts.series[1].data = seriesData[1];
}

const timeChange = (time) => {
  const [start, end] = time;
  if (start && end) {
    const yearsDiff = dayjs(start);
    const monthsDiff = dayjs(end);
    const totalMonths = monthsDiff.diff(yearsDiff, "months");
    if (totalMonths > 12) {
      ElMessage.error("选择的月份范围不能超过12个月");
      selectedMonth.value = []; // 重置为空数组以清除选择
      return;
    }
    selectedMonth.value = time;
    getData();
  }
};
</script>

<template>
  <BasePanel class="component-wrapper change-trend">
    <template v-slot:headerLeft>漏损率产销差分析</template>
    <template v-slot:headerRight>
      <div class="head-right">
        <el-date-picker
          v-model="selectedMonth"
          type="monthrange"
          size="large"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          :editable="false"
          :clearable="false"
          :disabled-date="pickerOptions"
          style="width: 240px"
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
    >
    </ChartView>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.base-panel.component-wrapper.change-trend {
  height: 430px;
  background: @panelBgColor;
  .chartview {
    width: 100%;
    height: 100%;
  }
}
</style>
