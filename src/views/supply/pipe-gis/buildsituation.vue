<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:21:11
 * @Description: buildsituation
-->
<template>
  <BasePanel class="component-wrapper buildsituation">
    <template v-slot:headerLeft>管网建设情况</template>
    <div class="piebox">
      <div class="piebox_all">
        <p class="value">{{ info.networkTotal }}</p>
        <p class="label">总计</p>
      </div>
      <ChartView
        class="rank-container1"
        :chartInfo="info.chartInfo1"
        :preHandler="chartPreHandler1"
        :chartOpt="chartOpt1"
      ></ChartView>
    </div>
    <div class="weather-info-panel">
      <div class="grid">
        <span class="rain-value panel">{{ info.overallLength }}&nbsp;公里</span>
        <span class="rain-value-name panel">总管长</span>
      </div>
      <span class="line"></span>
      <div class="grid">
        <span class="rain-value panel">{{ info.newCurrentYear }}&nbsp;公里</span>
        <span class="rain-value-name panel">本年新建</span>
      </div>
      <span class="line"></span>
      <div class="grid">
        <span class="rain-value panel">{{ info.abolishCurrentYear }}&nbsp;公里</span>
        <span class="rain-value-name panel">本年变废</span>
      </div>
    </div>

    <ChartView
      class="rank-container"
      :chartInfo="info.chartInfo"
      :preHandler="chartPreHandler"
      :chartOpt="chartOpt"
    ></ChartView>
  </BasePanel>
</template>

<script setup>
import { getconstruction } from "@/api/business/supply/PipeOperation.js";
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";

let info = reactive({
  // 预警统计图表
  chartInfo: {
    xData: [],
    seriesData: [],
  },
  chartInfo1: {
    yAxis: [],
    seriesData: [],
  },
  networkTotal: 0,
  newCurrentYear: "",
  abolishCurrentYear: "",
  overallLength: "",
});

let chartOpt = {
  // backgroundColor: "#000A18",
  color: ["#00E8FF", "#FFC102"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  grid: {
    x: 36,
    y: 30,
    x2: 36,
    y2: 50,
    //   bottom:20,
    borderWidth: 1,
    // containLabel: true,
  },
  legend: {
    show: true,
    bottom: 0,
    itemWidth: 22,
    itemHeight: 14,
    itemGap: 18,
    textStyle: {
      fontSize: 14,
      lineHeight: 24,
      color: "rgba(215, 240, 255, 0.8)",
    },
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      axisTick: {
        show: true,
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
        // interval: 1,
        formatter: "{value}",
        margin: 8,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      name: "公里",
      nameLocation: "end",
      // nameRotate: "90",
      nameTextStyle: {
        color: "#DDEEFF",
        align: "right",
        padding: [0, -20, 0, 46],
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
      name: "新建",
      type: "line",
      showBackground: true,
      // smooth: true,
      data: [],
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
      },
    },
    {
      name: "变废",
      type: "line",
      showBackground: true,
      // smooth: true,
      data: [],
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
      },
    },
  ],
};
let chartOpt1 = {
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
  //         fontSize: 12,
  //         color: "#8BC1CE",
  //     },
  // },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c}公里（{d}%）",
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
      radius: ["45%", "65%"],
      // center: ["36%", "55%"],
      data: [],
      label: {
        formatter: "{title|{b}}\n{number|{c}} 公里（{d}%）",
        color: "#00E8FF",
        fontSize: 14,
        rich: {
          title: {
            lineHeight: 24,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.8)",
          },
          number: {
            fontSize: 20
          }
        }
      },
      labelLine: {
        length: 15,
        length2: 25,
        lineStyle: {
          // color: "#02647C",
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
  ],
};

onMounted(() => {
  getconstruction().then(function (result) {
    updataChartInfo(result);
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
function chartPreHandler(opts, inOptions) {
  let { xData, seriesData } = inOptions;
  opts.xAxis[0].data = xData;
  opts.series[0].data = seriesData[0];
  opts.series[1].data = seriesData[1];
}
// setOption前处理
function chartPreHandler1(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}

function updataChartInfo(data) {
  updatePanel(data.networkTownVOS);
  info.networkTotal = data.networkTotal;
  info.newCurrentYear = data.newCurrentYear;
  info.abolishCurrentYear = data.abolishCurrentYear;
  info.overallLength = data.overallLength;
  let toChartObj = info.chartInfo;
  let obj = data.newBuilt.statisticData;
  let xData = [];
  let yData = [];
  let yData1 = [];
  for (let i in obj) {
    xData.push(i);
    yData.push(obj[i]);
  }
  for (let i in data.abolish.statisticData) {
    yData1.push(data.abolish.statisticData[i]);
  }
  toChartObj.xData = xData;
  toChartObj.seriesData = [yData, yData1];
}
</script>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.buildsituation {
  height: 660px;

  .weather-info-panel {
    position: relative;
    display: flex;
    height: 80px;
    // background: rgba(255, 255, 255, 0.05);
    // border: 1px solid rgba(101, 169, 255, 0.5);
    border-radius: 4px;
    margin-bottom: 12px;

    .line {
      width: 1px;
      height: 48px;
      display: inline-block;
      border-right: 1px dashed #76a8ff;
      margin-top: 16px;
    }

    .grid {
      width: calc(50%);
      height: 100%;
      box-sizing: border-box;
      /*margin-right: 2px;*/

      .panel {
        display: flex;
        width: 100%;
        height: calc(30% - 8px);
        justify-content: center;
        align-content: center;
      }

      .rain-value-name {
        display: inline-block;
        text-align: center;
        height: 26px;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #ffffff;
        margin-top: 10px;
      }

      .rain-value {
        height: 20px;
        font-size: 22px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: #57fffc;
        line-height: 20px;
        margin-top: 16px;
      }
    }
  }

  .title {
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(162, 210, 255, 0) 0%,
      rgba(115, 173, 255, 0.3) 50%,
      rgba(105, 166, 255, 0) 100%
    );
    color: #cbfdff;
  }

  .rank-container {
    height: 230px;
  }
  .piebox {
    height: 220px;
    position: relative;
    margin-bottom: 20px;

    .piebox_all {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;

      .value {
        font-size: 20px;
      }

      .label {
        font-size: 16px;
      }
    }
    .rank-container1 {
      height: 220px;
    }
  }
}
</style>
