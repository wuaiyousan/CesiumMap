<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:45:24
 * @Description: TrendAnalysis
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import dayjs from "dayjs";
import TimeSelect from "../components/TimeSelect.vue";
import { getTrendAnalysis } from "@/api/business/supply/general.js";

const eventBus = window.vueInstance.config.globalProperties.$eventBus;
let info = reactive({
  data: {
    waterFeeReceivableAmount: null,
    waterFeeReceivedAmount: null,
    waterFeeRemainingDeposit: null,
    waterSaleVolume: null,
    waterSupplyVolume: null,
    waterSupplySaleDifference: null,
  },
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  type: "1",
  timeList: [
    { name: "年度", code: "1" },
    { name: "月度", code: "2" },
  ],
});
const emit = defineEmits();
const getData = () => {
  const params = {
    type: info.type,
  };
  getTrendAnalysis(params).then((res) => {
    let {
      waterFeeReceivableAmount,
      waterFeeReceivedAmount,
      waterFeeRemainingDeposit,
      waterSaleVolume,
      waterSupplyVolume,
      waterSupplySaleDifference,
      item,
    } = res || {};
    info.data = {
      waterFeeReceivableAmount,
      waterFeeReceivedAmount,
      waterFeeRemainingDeposit,
      waterSaleVolume,
      waterSupplyVolume,
      waterSupplySaleDifference,
    };
    let lineChart = info.chartInfo;
    let xArr = [],
      series = [[], [], []];
    for (let i = 0; i < item.length; i++) {
      xArr.push(item[i].month);
      series[0].push(item[i].waterSupplyVolume);
      series[1].push(item[i].waterSaleVolume);
      series[2].push(item[i].waterSupplySaleDifference);
    }
    lineChart.xAxis = xArr;
    lineChart.seriesData = series;
    eventBus.emit("topItem", info.data);
  });
};

onMounted(() => {
  getData();
});
const tablick = (type) => {
  info.type = type;
  getData();
};
let chartOpt = {
  color: ["#FFD03B", "#EFF4FF", "#2AE8BD"],
  title: {
    text: "供售水量与产销差水量趋势图",
    left: "center",
    top: "top",
    textStyle: {
      color: "#EFF4FF",
      fontSize: 20,
    },
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    icon: "roundRect",
    top: 26,
    data: ["供水量", "售水量", "产销差"],
    textStyle: {
      color: "rgba(215, 240, 255, 0.8)",
      fontSize: "14",
    },
  },
  grid: {
    x: 40,
    y: 50,
    x2: 8,
    y2: 20,
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisLine: {
        show: true,
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
        show: true,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "万m³",
      axisLabel: {
        color: "rgba(215, 240, 255, 0.8)",
      },
      splitLine: {
        lineStyle: {
          type: "dashed", //虚线
          color: "rgba(255, 255, 255, 0.4)",
        },
        show: true, //隐藏
      },
      splitNumber: 4,
    },
  ],
  series: [
    {
      name: "供水量",
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 1,
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
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      name: "售水量",
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 1,
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(239,244,255,0.5)",
            },
            {
              offset: 1,
              color: "rgba(239,244,255,0)",
            },
          ],
        },
      },
      emphasis: {
        focus: "series",
      },
      data: [],
    },
    {
      name: "产销差",
      type: "line",
      smooth: true,
      lineStyle: {
        width: 2,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 1,
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(42,232,189,0.5)",
            },
            {
              offset: 1,
              color: "rgba(42,232,189,0)",
            },
          ],
        },
      },
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
  opts.series[2].data = seriesData[2];
}
</script>

<template>
  <BasePanel class="component-wrapper trend-analysis">
    <template v-slot:headerLeft>
      <div>趋势分析</div>
    </template>
    <template v-slot:headerRight>
      <TimeSelect
        class="inspection-time"
        :selection="info.type"
        :timeList="info.timeList"
        @time-change="tablick"
      ></TimeSelect>
    </template>
    <ChartView
      class="chartview"
      :chartInfo="info.chartInfo"
      :chartOpt="chartOpt"
      :preHandler="chartPreHandler"
    ></ChartView>
    <div class="con">
      <div class="water-volume">
        <span class="quantity"
          >{{ info.data.waterFeeReceivableAmount }}
          <span class="company">万元</span></span
        >
        <span class="water-supply">水费应收金额</span>
      </div>
      <div class="water-volume">
        <span class="quantity"
          >{{ info.data.waterFeeReceivedAmount }}
          <span class="company">万元</span></span
        >
        <span class="water-supply">水费实收金额</span>
      </div>
      <div class="water-volume">
        <span class="quantity"
          >{{ info.data.waterFeeRemainingDeposit }}
          <span class="company">万元</span></span
        >
        <span class="water-supply">剩余预存金额</span>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.trend-analysis {
  height: 400px;
  .con {
    display: flex;
    .water-volume {
      flex: 1;
      margin: 20px 0;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      .water-supply {
        font-size: @titleSize1;
        color: rgb(230, 247, 255);
      }
      .quantity {
        color: @active-color;
        font-size: @titleSize4;
        line-height: 28px;
        font-family: manrope-bold;
        font-weight: bold;
        font-style: normal;
        text-shadow: rgb(19 128 255) 0px 0px 10px;
        .company {
          padding-left: 4px;
          font-size: @titleSize1;
          color: @active-color;
        }
      }
    }
  }
  .chartview {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .header-box {
    width: 100%;
    height: 38px;
    background: url("@/assets/img/common/title-bg.png") no-repeat;
    background-size: 100% 100%;
  }
}
.component-wrapper.base-panel.component-wrapperMeterReading
  .component-wrapper.chart-view {
  width: 500px;
  height: 180px;
}
</style>
