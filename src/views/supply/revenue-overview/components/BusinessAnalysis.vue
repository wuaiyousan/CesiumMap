<script setup>
import ChartView from "@/views/common/components/ChartView.vue";
import BasePanel from "../../components/BasePanel.vue";
import { getBusiness } from "@/api/business/supply/pevenueoverview.js";

let info = reactive({
  chartInfo: {
    seriesData: [],
  },
  total: 0,
  haveDone: 0,
  doing: 0,
});

onMounted(() => {
  getBusiness().then((res) => {
    info.total = res.total;
    info.haveDone = res.haveDone;
    info.doing = res.doing;
    let toChart = info.chartInfo;
    toChart.seriesData = [].concat(res.typeData || []).map((item) => {
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
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} ({d}%)",
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
      center: ["38%", "60%"],
      data: [],
      label: {
        formatter: "{title|{b}}\n{number|{c}} ({d}%)",
        color: "#00E8FF",
        fontSize: 16,
        rich: {
          title: {
            lineHeight: 24,
            fontSize: 16,
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
          color: "#02647C",
        },
      },
    },
  ],
};

function chartPreHandler(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}
</script>
<template>
  <BasePanel class="component-wrapper market-overview">
    <template v-slot:headerLeft>业务受理分析</template>
    <div class="business">
      业务受理总计 <span>{{ info.total }} 单</span>
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
.component-wrapper.base-panel.component-wrapper.market-overview {
  height: 310px;
  position: absolute;
  top: 740px;
  left: 10px;
  .content {
    padding-top: 0 !important;
    height: 0;
  }
  .component-wrapper.chart-view {
    width: 500px;
    height: 180px;
  }
  .rainview {
    position: absolute;
    top: -8px;
    left: 45px;
    height: 29px;
    font-size: 18px;
    font-weight: 500;
    color: #e1feff;
    line-height: 29px;
    letter-spacing: 4px;
  }
  .chartview {
    width: 100%;
    height: 261px;
    margin-bottom: 20px;
  }

  .header-box {
    width: 100%;
    height: 38px;
    background: url("@/assets/img/common/title-bg.png") no-repeat;
    background-size: 100% 100%;
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
