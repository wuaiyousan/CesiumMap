<!--
 * @Author: fishScola
 * @Date: 2022-10-31 15:54:48
 * @LastEditors: duanlian
 * @LastEditTime: 2023-04-12 16:53:57
 * @Description: 图表
-->
<template>
  <div class="component-wrapper chart-view">
    <div class="chart-box" ref="chartRef" v-show="showChart"></div>
    <div class="empty-tips" v-show="!showChart">
      {{ emptyTips }}
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/lib/echarts.js'

export default {
  name: "MonitorChart",
  components: {},
  provide() {
    return {};
  },
  inject: [],
  props: {
    // 图表渲染用数据等
    chartInfo: {
      type: Object,
      default: function () {
        return {
          // 其它输入的内容
          seriesData: [],
        };
      },
    },
    // 图表配置选项
    chartOpt: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // setOption前后预处理
    preHandler: {
      type: Function,
      default: function () {
        return null;
      },
    },
    postHandler: {
      type: Function,
      default: function () {
        return null;
      },
    },
    // 空数据提示
    emptyTips: {
      type: String,
      default: function () {
        return "暂无数据";
      },
    },
  },
  data() {
    return {
      theChart: null,
      showChart: true,
    };
  },
  watch: {
    "chartInfo.seriesData": function (newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.doUpdate(this.chartInfo);
      }
    },
    chartOpt: function (newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.updateByOption();
      }
    },
  },
  mounted() {
    this.updateByOption();
  },
  beforeDestroy() {
    this.clearChart();
    this.showChart = true;
  },
  methods: {
    updateByOption(isClear = true) {
      if (isClear) {
        this.clearChart();
      }
      if (Object.keys(this.chartOpt).length) {
        this.showChart = true;
        this.$nextTick(this.updateChart);
      } else {
        this.showChart = false;
      }
    },
    doUpdate(params) {
      let { seriesData, ...others } = params;
      if (seriesData && seriesData.length) {
        this.updateChart({
          ...others,
          seriesData,
        });
      } else {
        this.clearChart();
      }
    },
    updateChart(inOptions = {}) {
      let theChart = this.theChart;
      if (!theChart) {
        theChart = echarts.init(this.$refs.chartRef);
        this.theChart = theChart;
      }
      let opts = {};
      if (Object.keys(inOptions).length) {
        opts = {
          grid: {
            x: 10,
            y: 28,
            x2: 58,
            y2: 26,
            borderWidth: 1,
          },
          xAxis: {
            type: "category",
            data: inOptions.xData || [],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisLabel: {
              show: true,
              color: "rgba(215, 240, 255, 0.5)",
              fontSize: 16,
              lineHeight: 22,
              interval: 0,
              formatter: "{value}",
            },
            axisTick: {
              show: false,
            },
            // nameGap: 10,
            nameTextStyle: {
              color: "#879ABE",
              lineHeight: 17,
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          series: [
            {
              data: [],
              type: "bar",
              barWidth: 20,
              label: {
                show: true,
                color: "#7DD9FF",
                fontSize: 14,
                lineHeight: 20,
                position: "top",
              },
            },
          ],
        };
      }
      opts = Object.assign({}, opts, this.chartOpt);
      if (typeof this.preHandler === "function") {
        this.preHandler(opts, inOptions);
      }
      theChart.setOption(Object.assign({}, opts));
      if (typeof this.postHandler === "function") {
        this.postHandler(theChart, inOptions, opts);
      }

      // resize
      window.setTimeout(this.doResize, 300);

      theChart.off("click", this.onChartClick);
      theChart.on("click", this.onChartClick);
    },
    onChartClick(param) {
      this.$emit("chart-click", param);
    },
    clearChart() {
      let chart = this.theChart;
      if (chart && !chart.isDisposed()) {
        chart.dispose();
        this.theChart = null;
      }
    },
    doResize() {
      let theChart = this.theChart;
      if (theChart && theChart.resize) {
        theChart.resize();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrapper.chart-view {
  height: 100%;

  .chart-box {
    height: 100%;
  }

  .empty-tips {
    background-color: rgba(180, 180, 180, 0.1);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
