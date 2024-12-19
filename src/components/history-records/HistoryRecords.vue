<!--
 * @Author: fishScola
 * @Date: 2022-10-31 14:43:10
 * @LastEditors: duanlian
 * @LastEditTime: 2023-05-16 16:59:26
 * @Description: 历史数据
-->
<template>
  <div class="component-wrapper history-records" v-loading="loading">
    <custom-time
      :params="timeParams"
      class="time-box"
      @time-change="onTimeChange"
    ></custom-time>
    <curve-settings
      ref="curveSettingRef"
      :option="settingOpt"
      class="curve-box"
      @setting-change="onSettingChange"
      @setting-change-by-time="onSettingChangeNotUptdate"
    ></curve-settings>
    <div class="data-types">
      <span class="label">数据类别：</span>
      <el-button-group>
        <el-button
          v-for="(it, index) in dataTypes"
          :key="index"
          :type="it.fieldName === monitorObj.value ? 'primary' : ''"
          @click.stop="onMonitorType(index)"
          size="large"
        >
          {{ it.label }}
        </el-button>
      </el-button-group>
      <slot name="append"></slot>
      <div class="view-group">
        <el-button-group v-show="!monitorObj.extend && viewTypes.length > 1">
          <el-button
            v-for="(it, index) in viewTypes"
            :key="index"
            :type="it.value === viewType ? 'primary' : ''"
            @click.stop="onViewType(index)"
            size="large"
          >
            {{ it.label }}
          </el-button>
        </el-button-group>
        <el-button
          v-show="enableExport"
          class="btn-export"
          size="large"
          icon="el-icon-upload2"
          @click="onExport"
        >
          导出
        </el-button>
      </div>
    </div>
    <div class="major-box">
      <template v-if="monitorObj.extend">
        <slot name="extend" :params="params"></slot>
      </template>
      <template v-else>
        <monitor-chart
          v-if="viewType === 'byChart'"
          class="major-chart"
          :chartOpt="showObj.chartOpt"
          ref="monitorChartRef"
        >
        </monitor-chart>
        <monitor-table
          :tableObj="showObj.table"
          v-show="viewType === 'byTable'"
        ></monitor-table>
      </template>
    </div>
  </div>
</template>

<script>
import CustomTime from "./components/CustomTime.vue";
import CurveSettings from "./components/CurveSettings.vue";
import MonitorChart from "./components/MonitorChart.vue";
// import UseMonitor from './uses/UseMonitor.js'
// const { getMonitorResult } = UseMonitor()
import { getHistoryRecords, exportHistoryRecords } from "./api/index";
import MonitorTable from "./components/MonitorTable.vue";
import dayjs from "dayjs";

export default {
  name: "HistoryRecords",
  components: {
    CustomTime,
    CurveSettings,
    MonitorChart,
    MonitorTable,
  },
  props: {
    dataTypes: {
      type: Array,
      default: function () {
        return [
          {
            label: "雨量",
            value: "RAIN",
            params: {
              monitorType: "RAIN",
              dataFields: "hourW",
              timeField: "hour",
            },
            responseFn: null,
          },
          {
            label: "水位",
            value: "WATER_REGIMEN",
            params: {
              monitorType: "WATER_REGIMEN",
              dataFields: "z",
              timeField: "mot",
            },
            responseFn: null,
          },
        ];
      },
    },
    // 查看方式
    viewTypes: {
      type: Array,
      default: function () {
        return [
          { label: "曲线", value: "byChart" },
          { label: "表格", value: "byTable" },
        ];
      },
    },
    // 测站参数
    params: {
      type: Object,
      default: function () {
        return {
          deviceCode: "",
        };
      },
    },
    // 请求历史记录
    recordHandler: {
      type: Function,
    },
    // 显示提示信息
    showMsg: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
    // 抽稀时，为ADD的监测指标项列表
    dilutionAddTags: {
      type: Array,
      default: function () {
        return ["waterSupply", "electricityConsumption", "waterAmount"];
      },
    },
    // 是否启用导出
    enableExport: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
  },
  data() {
    return {
      // 展示方式
      viewType: "byChart",
      monitorObj: {
        value: "",
      },
      showObj: {
        chartOpt: {
          legend: {
            data: ["闸阀流量"],
          },
          xAxis: {
            type: "category",
            data: [],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "闸阀流量",
              data: [],
              type: "line",
              smooth: true,
            },
          ],
        },
        table: {},
      },
      condition: {
        // 时间选择
        startTime: "",
        endTime: "",
        contemporaneous: [],
        // 曲线设置
        filterOutliers: true,
        dataDilute: null,
      },
      loading: false,
      // 时间参数
      timeParams: {
        majorType: "customize",
        customType: "",
        customDate: [],
      },
      // 缓存的附加条件
      cacheParams: {},
    };
  },
  computed: {
    settingOpt() {
      let fromParams = this.monitorObj.params || {};
      if (this.dilutionAddTags.includes(fromParams.dataFields)) {
        return {
          dilution: { action: "ADD" },
        };
      } else {
        return { dilution: null };
      }
    },
  },
  watch: {
    "params.deviceCode": function (newVal) {
      if (newVal) {
        this.onMonitorType(0);
      }
    },
  },
  created() {
    console.log("111", this.dataTypes);
    // 默认加载一个月数据
    this.fillDefault();
    this.onMonitorType(0, false);
  },
  methods: {
    // 历史数据，查询时间过滤
    fillDefault() {
      let today = dayjs();
      this.timeParams.customDate = [
        today.startOf("month").format("YYYY-MM-DD 00:00:00"),
        today.format("YYYY-MM-DD 23:59:59"),
      ];
    },
    updateSearch(val, keyProp = "dataFields", defVal = "") {
      if (val !== undefined) {
        let info = this.monitorObj;
        info.params = Object.assign({}, info.params, {
          [keyProp]: (defVal || info.value) + val,
        });
        this.cacheParams = {
          keyProp: keyProp,
          defVal: defVal,
          value: val,
        };
        // 更新数据
        this.doUpdate();
      }
    },
    onTimeChange({ period, customize }) {
      if (period) {
        this.condition.contemporaneous = period.list || [];
        this.condition.startTime = "";
        this.condition.endTime = "";
        // 更新数据
        this.doUpdate();
      } else if (customize) {
        let { startTime, endTime } = customize;
        this.condition.startTime = startTime || "";
        this.condition.endTime = endTime || "";
        this.condition.contemporaneous = [];
        // 更新数据
        this.doUpdate();
      }
    },
    onSettingChangeNotUptdate({ filterOutliers, dataDilute }) {
      this.condition.filterOutliers = filterOutliers;
      this.condition.dataDilute = Object.assign({}, dataDilute);
    },
    onSettingChange({ filterOutliers, dataDilute }) {
      this.condition.filterOutliers = filterOutliers;
      this.condition.dataDilute = Object.assign({}, dataDilute);
      // 更新数据
      this.doUpdate();
    },
    onViewType(index) {
      let it = this.viewTypes[index];
      this.viewType = (it && it.value) || "";
    },
    onMonitorType(index, follow = true) {
      let to = this.dataTypes[index] || {};
      // this.monitorObj.value = to.fieldName;
      // this.showObj.chartOpt.legend.data = [to.indexName];
      // this.showObj.chartOpt.xAxis.data = to.hisData.map(
      //   (item) => item.appear_time
      // );
      // this.showObj.chartOpt.series[0].data = to.hisData.map(
      //   (item) => item[to.fieldName]
      // );
      // this.showObj.chartOpt.series[0].name = to.indexName;

      this.monitorObj = to;
      // 是否有附加属性
      if (Object.keys(to).length && this.$slots.append) {
        let { keyProp, defVal, value } = this.cacheParams || {};
        if (keyProp) {
          this.monitorObj.params[keyProp] = (defVal || to.value) + value;
        }
      }
      // 切换监测指标 - 更新数据;
      if (follow && Object.keys(to).length && !to.extend) {
        this.$nextTick(() => {
          this.$refs.curveSettingRef.settingChange();
        });
      }
    },
    doUpdate() {
      // let params = {
      //   endTime: this.condition.endTime,
      //   intevalAmount: this.condition.dataDilute,
      //   startTime: this.condition.startTime,
      //   stationId: this.params.id,
      //   timeType: 3,
      // };
      let params = this.getParams();
      if (!params) {
        return;
      }
      this.loading = true;
      if (typeof this.recordHandler === "function") {
        return this.recordHandler(params)
          .then((recordsRes) => {
            let resObj = this.showObj;
            let { status, data, msg } = recordsRes || {};
            if (status) {
              let { option, table } = data;
              resObj.chartOpt = option;
              resObj.table = table;
            } else {
              resObj.chartOpt = {};
              resObj.table = [];
              if (this.showMsg) {
                this.$message.warning(msg);
              }
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        return getHistoryRecords(params)
          .then((res) => {
            let theObj = this.monitorObj;
            let resObj = this.showObj;
            let dataFn = theObj.responseFn || getMonitorResult;
            if (typeof dataFn !== "function") {
              return;
            }
            let { status, data, msg } = dataFn({
              data: res.data.data || {},
              params,
              monitorObj: theObj,
            });
            if (status) {
              let { option, table } = data;
              resObj.chartOpt = option;
              resObj.table = table;
            } else {
              resObj.chartOpt = {};
              resObj.table = [];
              if (this.showMsg) {
                this.$message.warning(msg);
              }
            }
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    getParams() {
      let theObj = this.monitorObj;
      // 0.校验
      if (!theObj.value || theObj.extend !== undefined) {
        return null;
      }
      // 1.组装参数后查询
      let {
        startTime,
        endTime,
        contemporaneous,
        filterOutliers,
        dataDilute,
        supplement,
      } = this.condition;
      let params = Object.assign({}, this.params, theObj.params || {});
      if (startTime) {
        params.startTime = startTime;
      }
      if (endTime) {
        params.endTime = endTime;
      }
      if (contemporaneous.length) {
        params.contemporaneous = contemporaneous;
      }
      let setting = {};
      setting.filterOutliers = filterOutliers;
      if (dataDilute) {
        setting.dataDilute = dataDilute;
      }
      setting.supplement = supplement;
      if (Object.keys(setting).length) {
        params.querySetting = setting;
      }
      return params;
    },
    onExport() {
      let params = this.getParams();
      if (params) {
        exportHistoryRecords(params);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrapper.history-records {
  height: 807px;
  user-select: none;

  .time-box,
  .curve-box,
  .data-types {
    height: 50px;
    line-height: 50px;
  }
  .data-types {
    position: relative;
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
      font-size: 18px;
      color: #ffffff;
    }
    .view-group {
      position: absolute;
      right: 0;

      .btn-export {
        margin-left: 16px;
        padding: 6px 10px;
      }
    }
  }

  .major-box {
    padding-top: 8px;
    height: calc(100% - 108px);
    box-sizing: border-box;

    .major-chart {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
