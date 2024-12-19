<!--
 * @Author: fishScola
 * @Date: 2022-10-15 17:01:23
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 15:16:08
 * @Description: 测站预警
-->
<script setup>
import UseGlobalMessage from "../../common/UseGlobalMessage";
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import {
  getAlarmAnalysis,
  getSynthesisPage,
} from "@/api/business/supply/general.js";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import dayjs from "dayjs";
let info = reactive({
  splideList: [],
});
onMounted(() => {
  watchEffect(() => {
    let params = {
      alarmState: "UNTREATED,TREATING",
      startDate: dayjs().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    getAlarmAnalysis(params).then((res) => {
      let pieCharts = pieChart.chartInfo;
      let pieSeries = [];

      let lineChart = leakageChart.chartInfo;
      let xArr = [],
        series = [];
      for (let i = 0; i < res.length; i++) {
        xArr.push(res[i].alarmType);
        series.push(res[i].alarmTypeNum);
        pieSeries.push({
          name: res[i].alarmType,
          value: res[i].alarmTypeNum,
          type: res[i].type,
        });
      }
      pieCharts.seriesData = pieSeries;
      lineChart.xAxis = xArr;
      lineChart.seriesData = series;
    });

    const params2 = {
      alarmState: "UNTREATED,TREATING",
      startDate: dayjs().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      current: 1,
      size: 1000,
    };
    getSynthesisPage(params2).then((result) => {
      info.splideList = [];
      for (let i = 0; i < result.records.length; i++) {
        result.records[
          i
        ].alarmDescribe = `监测${result.records[i].alarmIndicesList[0].name}${result.records[i].alarmIndicesList[0].value}${result.records[i].alarmIndicesList[0].unit}高于预警值${result.records[i].alarmIndicesList[0].threshold}${result.records[i].alarmIndicesList[0].unit}`;
      }
      nextTick(() => {
        info.splideList = result.records;
      });
    });
  });
});

const getDataListByType = (type) => {
  const params2 = {
    alarmState: "UNTREATED,TREATING",
    startDate: dayjs().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    alarmType: type,
    current: 1,
    size: 1000,
  };
  getSynthesisPage(params2).then((result) => {
    info.splideList = [];
    for (let i = 0; i < result.records.length; i++) {
      result.records[
        i
      ].alarmDescribe = `监测${result.records[i].alarmIndicesList[0].name}为${result.records[i].alarmIndicesList[0].value}${result.records[i].alarmIndicesList[0].unit}`;
    }
    nextTick(() => {
      info.splideList = result.records;
    });
  });
};
let pieChart = reactive({
  chartInfo: {
    seriesData: [],
  },
  chartOpt: {
    color: ["#FF6A3A", "#2AE8BD", "#618DFF", "#FFD03B", "#FFDA98"],
    title: {
      text: "不同预警类型占比",
      left: "center",
      top: "top",
      textStyle: {
        color: "#EFF4FF",
        fontSize: 20,
      },
    },
    legend: {
      show: true,
      top: 30,
      textStyle: {
        color: "rgba(215, 240, 255, 0.8)",
        fontSize: "14",
      },
    },
    grid: {
      x: 8,
      y: 40,
      x2: 8,
      y2: 2,
      borderWidth: 1,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} :（{d}%）",
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        radius: ["40%", "55%"],
        center: ["50%", "60%"],
        type: "pie",

        label: {
          show: true,
          color: "#ffffff",
          position: "outside",
          formatter: function (parms) {
            return parms.percent + "%";
          },
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: "#fff",
          },
          length: 10,
          length2: 20,
        },
        data: [],
      },
    ],
  },
});

let leakageChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
    // backgroundColor: "#000A18",
    title: {
      text: "不同类型预警数量",
      left: "center",
      top: "top",
      textStyle: {
        color: "#EFF4FF",
        fontSize: 20,
      },
    },
    grid: {
      x: 8,
      y: 40,
      x2: 8,
      y2: 20,
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
        data: [],
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
        name: "个",
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
        barWidth: 20,
        data: [],
        showBackground: true,
        backgroundStyle: {
          color: "rgba(106,112,124,0.20)",
        },
        itemStyle: {
          color: "rgba(58,172,255,0.9)",
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

function chartPreHandler1(opts, inOptions) {
  let { seriesData } = inOptions;
  opts.series[0].data = seriesData;
}

const { doEventSend } = UseGlobalMessage();
function handleRowClick(row) {
  doEventSend("entity-billboard-location", {
    key: "3715241103",
    sourceKey: "WQ001",
  });
}
function chartClick(params) {
  console.log("1111", params);
  getDataListByType(params.data.type);
}
import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper station-warning">
    <template v-slot:headerLeft>测站预警</template>
    <div class="wrap">
      <ChartView
        class="chart"
        :chartInfo="pieChart.chartInfo"
        :chartOpt="pieChart.chartOpt"
        :preHandler="chartPreHandler1"
        @chart-click="chartClick"
      ></ChartView>
      <ChartView
        class="chart"
        :chartInfo="leakageChart.chartInfo"
        :chartOpt="leakageChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
    <div class="splide-box">
      <el-table :data="info.splideList" class="top">
        <el-table-column align="center" type="index" width="60" label="序号">
        </el-table-column>
        <el-table-column align="center" prop="deviceName" label="测站名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceTypeName"
          width="100"
          label="指标名称"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="triggerTime"
          width="140"
          label="预警时间"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="alarmIndicesList"
          width="80"
          label="监测值"
        >
        </el-table-column>
        <el-table-column align="center" prop="alarmDescribe" label="预警描述">
        </el-table-column>
      </el-table>
      <div class="con">
        <Vue3SeamlessScroll
          class="seamless-warp"
          :list="info.splideList"
          :hover="true"
          :limitScrollNum="2"
          :copyNum="10"
          :wheel="true"
          :step="0.5"
          v-if="info.splideList.length"
        >
          <el-table
            :data="info.splideList"
            stripe
            :show-header="false"
            :row-style="{ cursor: 'pointer' }"
            height="100%"
            class="bottom"
            @row-click="handleRowClick"
          >
            <el-table-column
              align="center"
              type="index"
              width="60"
              label="序号"
            >
            </el-table-column>
            <el-table-column align="center" prop="deviceName">
            </el-table-column>
            <el-table-column align="center" width="100">
              <template #default="scope">
                <span>
                  {{ scope.row.alarmIndicesList[0].name }}
                  {{ scope.row.alarmIndicesList[0].unit }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="triggerTime"
              label="预警时间"
              width="140"
            >
            </el-table-column>
            <el-table-column align="center" width="80">
              <template #default="scope">
                <span> {{ scope.row.alarmIndicesList[0].value }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="alarmDescribe">
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
.component-wrapper.station-warning {
  height: 563px;
  .wrap {
    height: 240px;
    display: flex;
  }
  .splide-box {
    height: calc(~"100% - 240px");
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
  .chart {
    flex: 1;
    height: 260px;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>
