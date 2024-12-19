<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 15:41:03
 * @Description: 站点监测
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import { getRank, getRankData } from "@/api/business/supply/dma.js";
import TimeSelect from "../components/TimeSelect.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import dayjs from "dayjs";
const pickerOptions = (time) => {
  return time.getTime() > Date.now();
};
let info = reactive({
  // splide
  splideList: [],
  type: "first_level",
  timeList: [
    { name: "一级分区", code: "first_level" },
    { name: "二级分区", code: "second_level" },
    { name: "三级分区", code: "third_level" },
  ],
});
const selectedMonth = ref([
  dayjs().subtract(6, "months").format("YYYY-MM"),
  dayjs().subtract(1, "months").format("YYYY-MM"),
]);
let leakageChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: "#000A18",
    title: {
      text: "漏损水量柱状图",
      left: "center",
      top: "top",
      textStyle: {
        color: "#EFF4FF",
        fontSize: 18,
      },
    },
    grid: {
      x: 8,
      y: 40,
      x2: 8,
      y2: 30,
      borderWidth: 1,
      containLabel: true,
    },
    legend: {
      show: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: [
      {
        type: "category",
        axisLine: {
          show: true,
        },
        axisLabel: {
          show: true,
          color: "eff4ff",
          fontSize: 16,
          lineHeight: 20,
        },
        axisTick: {
          show: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        data: [],
        name: "万m³",
        axisLabel: {
          show: true,
          color: "#eff4ff",
          fontSize: 16,
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            dashOffset: [2, 6],
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        barWidth: 16,
        data: [],
        showBackground: true,
        backgroundStyle: {
          color: "rgba(106,112,124,0.20)",
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#3bffff",
              },
              {
                offset: 1,
                color: "rgba(62,151,255,0.35)",
              },
            ],
          },
        },
      },
    ],
  },
});

function chartPreHandler(opts, inOptions) {
  let { xAxis, seriesData } = inOptions;
  opts.xAxis[0].data = xAxis;
  opts.series[0].data = seriesData;
}

function getBarData() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    level: info.type,
  };
  getRank(params).then((res) => {
    let toChartObj = leakageChart.chartInfo;
    let xData = [],
      series = [];
    for (let i = 0; i < res.length; i++) {
      xData.push(dayjs(res[i].date).format("M月"));
      series.push(res[i].leakWaterConsum);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = series;
  });
  getRankData(params).then((res) => {
    res.forEach((item, index) => {
      item["order"] = index + 1;
    });
    let toArr = res;
    info.splideList = [];
    nextTick(() => {
      info.splideList = toArr;
    });
  });
}
onMounted(() => {
  watchEffect(() => {
    getBarData();
  });
});

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
    getBarData();
  }
};
const tablick = (type) => {
  info.type = type;
  getBarData();
};
import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper lekage-rank">
    <template v-slot:headerLeft>漏损率排名</template>
    <template v-slot:headerRight>
      <div class="head-right">
        <el-date-picker
          v-model="selectedMonth"
          type="monthrange"
          placeholder="选择月份"
          format="YYYY-MM"
          value-format="YYYY-MM"
          style="width: 240px"
          size="large"
          :editable="false"
          :clearable="false"
          :disabled-date="pickerOptions"
          @change="timeChange"
          popper-class="dl-popper"
        >
        </el-date-picker>
      </div>
    </template>
    <div class="tag">
      <TimeSelect
        class="inspection-time"
        :selection="info.type"
        :timeList="info.timeList"
        @time-change="tablick"
      ></TimeSelect>
    </div>
    <div class="wrap">
      <ChartView
        class="chart"
        :chartInfo="leakageChart.chartInfo"
        :chartOpt="leakageChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
    <div class="splide-box">
      <el-table :data="info.splideList" class="top">
        <el-table-column align="center" prop="areaName" label="分区名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="triggerTime"
          width="140"
          label="漏损率(%)"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="nightLeastFlow"
          label="漏损水量(m³)"
          width="160"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="nightLeastFlowRate"
          label="排名"
          width="100"
        >
        </el-table-column>
      </el-table>
      <div class="con">
        <Vue3SeamlessScroll
          class="seamless-warp"
          :list="info.splideList"
          :hover="true"
          :limitScrollNum="8"
          :copyNum="10"
          :wheel="true"
          :step="0.5"
          v-if="info.splideList.length"
        >
          <el-table
            :data="info.splideList"
            stripe
            :show-header="false"
            height="100%"
            class="bottom"
          >
            <el-table-column
              align="center"
              prop="areaName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="leakRatio"
              label="漏损率(%)"
              width="140"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="leakWaterConsum"
              label="漏损水量(m³)"
              width="160"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="order"
              label="排名"
              width="100"
            >
            </el-table-column>
          </el-table>
        </Vue3SeamlessScroll>
        <div v-else class="empty-tips">
          <img class="null-img" :src="NullImg" alt="" />
          暂无数据
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.lekage-rank {
  height: 960px;
  background: @panelBgColor;
  .head-right {
    display: flex;
    align-items: center;
    .inspection-time {
      margin-right: 8px;
    }
  }
  .wrap {
    height: 280px;
  }
  .splide-box {
    height: calc(~"100% - 336px");
    ::v-deep(.top) {
      .el-table__body-wrapper {
        display: none;
      }
    }
    .con {
      height: calc(~"100% - 57px");
    }
    .seamless-warp {
      height: 100%;
      overflow: hidden;
    }
    .empty-tips {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      .null-img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
