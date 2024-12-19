<script setup>
import ChartView from "@/views/common/components/ChartView.vue";
import BasePanel from "../../components/BasePanel.vue";

import { getUseWater } from "@/api/business/supply/pevenueoverview.js";

let info = reactive({
  chartInfo: {
    seriesData: [],
  },
});

onMounted(() => {
  getUseWater().then((res) => {
    let toChart = info.chartInfo;
    toChart.seriesData = [].concat(res || []).map((item) => {
      return {
        value: item.num,
        name: item.name,
      };
    });
  });
});

let chartOpt = {
  // backgroundColor: "#000A18",
  color: ['#00E8FF', '#29FF98', '#0095FF', '#FFC102', '#FF6A29', '#FF5754'],
  // legend: {
  //     orient: "vertical",
  //     type: "scroll",
  //     right: 2,
  //     bottom: 2,
  //     icon: "circle",
  //     itemWidth: 9,
  //     itemHeight: 9,
  //     textStyle: {
  //         fontSize: 16,
  //         color: "#8BC1CE",
  //     },
  // },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} 万吨（{d}%）",
  },
  xAxis: {
    show: false,
  },
  yAxis: {
    show: false,
  },
  series: [
    {
      type: "pie",
      radius: "65%",
      center: ["50%", "50%"],
      data: [],
      label: {
        formatter: "{b}\n{c} 万吨（{d}%）",
        color: "#00E8FF",
        fontSize: 18,
      },
      labelLine: {
        length: 15,
        length2: 25,
        lineStyle: {
          color: "#02647C",
        },
      },
    },
  ],
};
// setOption前置处理
function chartPreHandler(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}
</script>
<template>
  <BasePanel class="component-wrapper water-analysis">
    <template v-slot:headerLeft>用水分析</template>
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
.component-wrapper.base-panel.component-wrapper.water-analysis {
  height: 290px;
  position: absolute;
  top: 470px;
  left: 10px;

  .content {
    padding-top: 8px;
    height: 0;
  }

  .component-wrapper.chart-view {
    width: 500px;
    height: 100%;
  }

  .chartview {
    width: 100%;
    height: 261px;
  }
}
</style>
