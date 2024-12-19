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
import dayjs from "dayjs";
const props = defineProps({
  // 选项列表
  typeList: {
    type: Array,
    default: function () {
      return [
        { code: "flow", name: "流量监测点" },
        { code: "pressure", name: "压力监测点" },
        { code: "wq", name: "水质监测点" },
      ];
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
    getBarData();
  }
};
let info = reactive({
  // splide
  splideOption: {},
  splideList: [],
  type: "1",
  timeList: [
    { name: "进水量", code: "1" },
    { name: "出水量", code: "2" },
    { name: "产销差", code: "3" },
    { name: "夜间最小流量", code: "4" },
  ],
});

onMounted(() => {
  watchEffect(() => {});
});

const theType = ref("");
// 类型切换

const tablick = (type) => {
  info.type = type;
};

const selectedMonth = ref([
  dayjs().subtract(5, "months").format("YYYY-MM"),
  dayjs().format("YYYY-MM"),
]);

const emit = defineEmits();
function onType({ code }) {
  if (theType.value === code) {
    return;
  }
  theType.value = code;
  emit("selection-change", code);
}
let leakageChart = reactive({
  chartInfo: {
    xAxis: ["一月", "二月", "三月", "四月", "五月", "六月"],
    seriesData: [21, 38, 35, 31, 32, 35],
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
        name: "进水量",
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
const columns = [
  {
    prop: "date",
    label: "日期",
  },
  {
    prop: "people",
    label: "进水量（m³）",
  },
  {
    prop: "status（%）",
    label: "同比",
  },
  {
    prop: "describe（%）",
    label: "环比",
  },
];
const page = reactive({
  currentPage: 1,
  pageSize: 8,
  total: 30,
});
const tableList = [
  {
    people: "111",
  },
  {
    people: "222",
  },
  {
    people: "333",
  },
];
</script>

<template>
  <div class="component-wrapper station-dialog">
    <div class="row">
      <TimeSelect
        class="inspection-time"
        :selection="info.type"
        :timeList="info.timeList"
        @time-change="tablick"
      ></TimeSelect>
    </div>
    <div class="condition">
      <div class="spanList">
        <TypeSelections></TypeSelections>
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
    <div class="charts">
      <ChartView
        class="chart"
        :chartInfo="leakageChart.chartInfo"
        :chartOpt="leakageChart.chartOpt"
        :preHandler="chartPreHandler"
      ></ChartView>
    </div>
    <div class="table">
      <div class="table-con">
        <el-table :data="tableList" height="100%" stripe>
          <el-table-column
            v-for="opt of columns"
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
          v-model:current-page="page.currentPage"
          :page-size="page.pageSize"
          :total="page.total"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.station-dialog {
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
}
</style>
