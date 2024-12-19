<!--
 * @Author: fishScola
 * @Date: 2022-10-13 21:33:35
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-13 22:35:53
 * @Description:
-->
<script setup>
import TimeSelect from "../../components/TimeSelect.vue";
import TypeSelections from "../components/TypeSelections.vue";
import ChartView from "@/views/common/components/ChartView.vue";
import {
  getFlowRelation,
  getSupplyWaterAmount,
  getWaterAmount,
  saleWaterAmount,
  prodMarkDiff,
  nightLeasWater,
} from "@/api/business/supply/dma.js";
import dayjs from "dayjs";
import { reactive, toRefs } from "vue";
const props = defineProps({
  // 选项列表
  params: {
    type: Object,
    default: function () {
      return {};
    },
  },
});

const pickerOptions = (time) => {
  return time.getTime() > Date.now();
};
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
    getData();
  }
};
let info = reactive({
  // splide
  splideOption: {},
  splideList: [],
  type: "1",
  timeList: [
    { name: "供水量", code: "1" },
    { name: "售水量", code: "2" },
    { name: "产销差", code: "3" },
    { name: "夜间最小流量", code: "4" },
  ],
  defaultStation: [{ name: "供水量", code: "all" }],
  relationStationList: [],
  stationList: [],
  columns: [
    { prop: "date", label: "日期" },
    { prop: "totalWaterSupply", label: "水量（m³）" },
    { prop: "yearChangeRate(%）", label: "同比" },
    { prop: "changeRate(%)", label: "环比" },
  ],
  tableList: [],
});

onMounted(() => {
  // watchEffect(() => {
  getFlowRelation(props.params.code).then((res) => {
    info.stationList = info.defaultStation.concat(
      res.map((item) => ({
        name: item.flowName,
        code: item.flowCode,
      }))
    );
  });
  // tablick("1");
  SupplyWaterAmount();
  // });
});

const getData = () => {
  if (info.type == 1) {
    if (theType.value == "all") SupplyWaterAmount();
    else stationWaterAmount(theType.value);
  } else if (info.type == 2) {
    getsaleWaterAmount();
  } else if (info.type == 3) {
    getProdMarkDiff();
  } else if (info.type == 4) {
    getNightLeasWater();
  }
};
function SupplyWaterAmount() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    areaCode: props.params.code,
  };
  getSupplyWaterAmount(params).then((res) => {
    let toChartObj = leakageChart.chartInfo;
    let xData = [],
      series = [];
    info.tableList = res;
    page.total = res.length;
    for (let i = 0; i < res.length; i++) {
      xData.push(res[i].date);
      series.push(res[i].totalWaterSupply);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = series;
  });
}
function stationWaterAmount(code) {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    deviceCode: code,
  };
  getWaterAmount(params).then((res) => {
    let toChartObj = leakageChart.chartInfo;
    let xData = [],
      series = [];
    info.tableList = res;
    page.total = res.length;
    for (let i = 0; i < res.length; i++) {
      xData.push(res[i].date);
      series.push(res[i].waterAmount);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = series;
  });
}
function getsaleWaterAmount() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    areaCode: props.params.code,
  };
  saleWaterAmount(params).then((res) => {
    let toChartObj = leakageChart.chartInfo;
    let xData = [],
      series = [];
    info.tableList = res;
    page.total = res.length;
    for (let i = 0; i < res.length; i++) {
      xData.push(res[i].date);
      series.push(res[i].meteredWaterConsum);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = series;
  });
}
function getProdMarkDiff() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    areaCode: props.params.code,
  };
  prodMarkDiff(params).then((res) => {
    let toChartObj = leakageChart.chartInfo;
    let xData = [],
      series = [];
    info.tableList = res;
    page.total = res.length;
    for (let i = 0; i < res.length; i++) {
      xData.push(res[i].date);
      series.push(res[i].diffRatio);
    }
    toChartObj.xAxis = xData;
    toChartObj.seriesData = series;
  });
}
function getNightLeasWater() {
  let params = {
    startTime: selectedMonth.value[0],
    endTime: selectedMonth.value[1],
    areaCode: props.params.code,
  };
  nightLeasWater(params).then((res) => {
    info.tableList = res;
    page.total = res.length;
  });
}
const theType = ref("");
// 类型切换

const tablick = (type) => {
  info.type = type;
  if (type == 1) {
    SupplyWaterAmount();
    info.columns = [
      { prop: "date", label: "日期" },
      { prop: "totalWaterSupply", label: "水量（m³）" },
      { prop: "yearChangeRate", label: "同比(%）" },
      { prop: "changeRate", label: "环比(%)" },
    ];
    leakageChart.chartOpt.yAxis[0].name = "m³";
    leakageChart.chartOpt.series[0].name = "水量";
  } else if (type == 2) {
    getsaleWaterAmount();
    info.columns = [
      { prop: "date", label: "日期" },
      { prop: "meteredWaterConsum", label: "售水量（m³）" },
      { prop: "yearChangeRate", label: "同比(%）" },
      { prop: "changeRate", label: "环比(%)" },
    ];
    leakageChart.chartOpt.yAxis[0].name = "m³";
    leakageChart.chartOpt.series[0].name = "售水量";
  } else if (type == 3) {
    getProdMarkDiff();
    info.columns = [
      { prop: "date", label: "日期" },
      { prop: "waterAmount", label: "出水量（m³）" },
      { prop: "meteredWaterConsum", label: "售水量（m³）" },
      { prop: "prodMarkDiffConsum", label: "产销差水量（m³）" },
      { prop: "diffRatio", label: "产销差率（%）" },
      { prop: "yearChangeRate", label: "同比(%）" },
      { prop: "changeRate", label: "环比(%)" },
    ];
    leakageChart.chartOpt.yAxis[0].name = "%";
    leakageChart.chartOpt.series[0].name = "产销差率";
  } else if (type == 4) {
    getNightLeasWater();
    info.columns = [
      { prop: "date", label: "日期" },
      { prop: "nightLeastWater", label: "夜间最小流量（m³）" },
      { prop: "yearChangeRate", label: "同比(%）" },
      { prop: "changeRate", label: "环比(%）" },
    ];
  }
};
const handleCurrentChange = (val) => {
  page.currentPage = val;
};
const selectedMonth = ref([
  dayjs().subtract(5, "months").format("YYYY-MM"),
  dayjs().format("YYYY-MM"),
]);

function onType(code) {
  if (theType.value === code) {
    return;
  }
  theType.value = code;
  if (code != "all") {
    info.columns[1].prop = "waterAmount";
    stationWaterAmount(code);
  } else {
    info.columns[1].prop = "totalWaterSupply";
    SupplyWaterAmount();
  }
}
let leakageChart = reactive({
  chartInfo: {
    xAxis: [],
    seriesData: [],
  },
  chartOpt: {
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
      textStyle: {
        color: "rgba(215, 240, 255, 0.8)",
        fontSize: "16",
      },
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
        name: "m³",
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
        name: "水量",
        type: "line",
        data: [],
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
const page = reactive({
  currentPage: 1,
  pageSize: 8,
  total: 30,
});
const handlePageChange = (val) => {
  page.currentPage = val;
};
</script>

<template>
  <div class="component-wrapper area-dialog">
    <div class="row">
      <TimeSelect
        class="inspection-time"
        :selection="info.type"
        :timeList="info.timeList"
        @time-change="tablick"
      ></TimeSelect>
    </div>
    <div class="condition">
      <div class="spanList" v-if="info.type == 1">
        <TypeSelections
          :typeList="info.stationList"
          @selection-change="onType"
        ></TypeSelections>
      </div>
      <div class="date">
        <el-date-picker
          v-model="selectedMonth"
          type="monthrange"
          placeholder="选择月份"
          format="YYYY-MM"
          size="large"
          value-format="YYYY-MM"
          style="width: 240px"
          :editable="false"
          :clearable="false"
          :disabled-date="pickerOptions"
          @change="timeChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="charts" v-if="info.type != '4'">
      <ChartView
        class="chart"
        :chartInfo="leakageChart.chartInfo"
        :chartOpt="leakageChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
    <div class="table" :class="{ full: info.type == 4 }">
      <div class="table-con">
        <el-table
          :data="
            info.tableList.slice(
              (page.currentPage - 1) * page.pageSize,
              page.currentPage * page.pageSize
            )
          "
          height="100%"
          stripe
        >
          <el-table-column
            v-for="opt of info.columns"
            align="center"
            :key="opt.label"
            :prop="opt.prop"
            :label="opt.label"
          />
        </el-table>
      </div>
      <div class="table-footer">
        <el-pagination
          v-show="page.total !== 0"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          v-model:current-page="page.currentPage"
          :page-size="page.pageSize"
          :total="page.total"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.area-dialog {
  height: 833px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .row {
    margin-bottom: 13px;
  }
  .condition {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .charts {
    height: 300px;
    width: 100%;
  }
  .table {
    width: 100%;
    height: calc(~"100% - 460px");
    .table-con {
      height: 100%;
    }
    .table-footer {
      padding: 12px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
  .full {
    height: calc(~"100% - 160px");
  }
}
</style>
