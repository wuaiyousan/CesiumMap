<script setup>
import { getMeterBusiness } from "@/api/business/supply/pevenueoverview.js";
import BasePanel from "../../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
let info = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  total: 0,
  haveDone: 0,
  doing: 0,
});

onMounted(() => {
  getMeterBusiness().then((res) => {
    // 汇总统计数据
    info.total = res.total;
    info.haveDone = res.haveDone;
    info.doing = res.doing;
    // 图表
    let xList = [];
    let yList = [];
    [].concat(res.typeData || []).forEach((it) => {
      if (it) {
        xList.push(it.name);
        yList.push(it.num);
      }
    });
    let toChart = info.chartInfo;
    toChart.xAxis = xList;
    toChart.seriesData = yList;
  });
});

let chartOpt = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    top: 20,
    left: "12%",
    right: 12,
    bottom: 28,
    // containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisLabel: {
        textStyle: {
          color: "rgba(215, 240, 255, 0.8)",
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
    },
  ],
  series: [
    {
      name: "单数",
      type: "bar",
      barWidth: "50%",
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
  <BasePanel class="component-wrapper blancesheet">
    <template v-slot:headerLeft>表务工作总计</template>
    <div class="business">
      表务工作总计 <span>{{ info.total }} 单 </span>
      <span>已办 {{ info.haveDone }} 单</span> <span>在办 {{ info.doing }} 单</span>
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
.component-wrapper.blancesheet {
  height: 330px;
  position: absolute;
  top: 470px;
  right: 10px;

  .chartview {
    width: 100%;
    height: 261px;
  }
}
.business {
  font-size: 16px;
  color: rgba(204, 227, 255, 0.9);
  letter-spacing: 0px;
  line-height: 24px;
  text-align: center;
  width: 100%;
  font-weight: bold;
  span {
    margin: 10px;
  }
}
</style>
