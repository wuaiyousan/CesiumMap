<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:16:53
 * @Description: caliber
-->
<template>
  <BasePanel class="component-wrapper caliber">
    <template v-slot:headerLeft>口径统计</template>
    <div class="piebox">
      <ChartView
        class="rank-container"
        :chartInfo="info.chartInfo"
        :chartOpt="chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
  </BasePanel>
</template>

<script setup>
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import { getcaliber } from "@/api/business/supply/PipeOperation.js";

let info = reactive({
  chartInfo: {
    yAxis: [],
    seriesData: [],
  },
});

let chartOpt = {
  // backgroundColor: '#000A18',
  color: ['#00E8FF', '#29FF98', '#FF6A29','#FFC102', '#0095FF', '#FF5754'],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    top: 0,
    x: 10,
    y: 16,
    x2: 26,
    y2: 0,
    right: "65px",
    borderWidth: 1,
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
    position: "bottom",
    splitLine: {
      lineStyle: {
        color: "rgba(255, 255, 255, 0.4)",
        type: "dashed",
        dashOffset: [2, 6],
      },
    },
    name: "",
    nameTextStyle: {
      // x轴name的样式调整
      color: "#DDEEFF",
      fontSize: 12,
    },
    nameGap: 15, // x轴name与横坐标轴线的间距
    nameLocation: "start",
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255, 255, 255, 0.8)",
      },
    },
    //offset: 2,
    axisLabel: {
      showMinLabel: true,
      // color: "#DDEEFF",
      color: "rgba(215, 240, 255, 0.8)",
      margin: 7,
    },
    // 用数据的最大值作为 X 轴最大值，视觉效果更好
    max: "dataMax",
  },
  yAxis: {
    type: "category",
    data: [],
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "rgba(255, 255, 255, 0.8)",
      },
    },
    axisLabel: {
      color: "rgba(215, 240, 255, 0.8)",
      interval: 0,
    },
    // Y轴从下往上是从小到大的排列
    inverse: true,
  },
  series: [
    {
      type: "bar",
      barWidth: 8,
      colorBy: "data",
      data: [],
      label: {
        formatter: "{c} 公里",
        show: true,
        position: "right",
        color: "#fff",
        fontSize: 12,
        rich: {
          title: {
            lineHeight: 24,
            fontSize: 14
          },
          number: {
            fontSize: 22
          }
        }
      },
      realtimeSort: true,
      // showBackground: true,
      // backgroundStyle: {
      //   color: "rgba(143, 203, 255, 0.2)",
      // },
    },
  ],
};

onMounted(() => {
  getcaliber().then(function (result) {
    updataChartInfo(result);
  });
});
// setOption前置处理
function chartPreHandler(opts, inOptions) {
  let { yAxis, seriesData } = inOptions;
  opts.yAxis.data = yAxis;
  opts.series[0].data = seriesData;
}
function updataChartInfo(data) {
  let obj = data;
  let xData = [];
  let yData = [];
  for (let i in obj) {
    let { name, num } = obj[i];
    xData.push(name);
    yData.push({
      value: num,
      itemStyle: {
        color: colorByParams(name),
      },
    });
  }
  let toChartObj = info.chartInfo;
  toChartObj.yAxis = xData;
  toChartObj.seriesData = yData;
}

function colorByParams(val, defColor = "#00E8FF") {
  // 颜色与区间设置
  // #FFAD00 - [300,)
  // #DA40D9 - [100, 300)
  // #40B1ED - [50, 100)
  // #000FE7 - [0, 50)
  // color: ['#00E8FF', '#29FF98', '#0095FF', '#FFC102', '#FF6A29', '#FF5754'],
  let lessIndex = val.lastIndexOf("<");
  if (lessIndex > -1) {
    return (
      {
        300: "#29FF98",
        100: "#0095FF",
        50: "#FFC102",
      }[val.slice(lessIndex + 1)] || defColor
    );
  } else if (val.includes(">=300")) {
    return "#00E8FF";
  }
  return defColor;
}
</script>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.caliber {
  height: 300px;

  .piebox {
    height: 200px;
    position: relative;
    margin-bottom: 20px;

    .rank-container1 {
      height: 200px;
    }
  }
}
</style>
