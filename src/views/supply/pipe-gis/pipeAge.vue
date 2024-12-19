<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:19:58
 * @Description: pipeAge
-->
<template>
  <BasePanel class="component-wrapper pipe-age">
    <template v-slot:headerLeft>管龄统计</template>
    <ChartView
      class="rank-container1"
      :chartInfo="info.chartInfo1"
      :preHandler="chartPreHandler1"
      :chartOpt="chartOpt1"
    ></ChartView>
  </BasePanel>
</template>

<script setup>
import { getpipeage } from "@/api/business/supply/PipeOperation.js";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";

let info = reactive({
  chartInfo1: {
    yAxis: [],
    seriesData: [],
  },
});

let chartOpt1 = {
  // backgroundColor: "#000A18",
  color: ['#00E8FF', '#29FF98', '#0095FF', '#FFC102', '#FF6A29', '#FF5754'],
  legend: {
    show: false,
    orient: "vertical",
    type: "scroll",
    right: 2,
    bottom: 2,
    icon: "circle",
    itemWidth: 9,
    itemHeight: 9,
    textStyle: {
      fontSize: 12,
      color: "#8BC1CE",
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} 公里 ({d}%)",
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
      // radius: ["45%", "70%"],
      center: ["50%", "60%"],
      data: [],
      label: {
        formatter: "{title|{b}}\n{number|{c}} 公里 ({d}%)",
        color: "#00E8FF",
        fontSize: 14,
        rich: {
          title: {
            lineHeight: 24,
            fontSize: 14
          },
          number: {
            fontSize: 20
          }
        }
      },
      labelLine: {
        length: 20,
        length2: 25,
        lineStyle: {
          color: "#02647C",
        },
      },
    },
  ],
};

onMounted(() => {
  getpipeage().then(function (result) {
    updatePanel(result);
  });
});
// 获取数据后，渲染
function updatePanel(res) {
  let toChart = info.chartInfo1;
  toChart.seriesData = [].concat(res || []).map((item) => {
    return {
      value: item.num,
      name: item.name,
    };
  });
}

// setOption前处理
function chartPreHandler1(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}
</script>

<style lang="less" scoped>
.component-wrapper.pipe-age {
  height: 300px;

  .rank-container1 {
    height: 100%;
  }
}
</style>
