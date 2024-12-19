<template>
  <div>
    <el-row class="baseInfo">
      <el-col :span="6">
        测站编码：<span>{{ baseData.deviceCode || "--" }}</span>
      </el-col>
      <el-col :span="6">
        测站类型：<span>{{ baseData.deviceTypeName || "--" }}</span>
      </el-col>
      <el-col :span="6">
        行政区划：<span>{{ baseData.regionName || "--" }}</span>
      </el-col>
      <el-col :span="6">
        关联对象：<span>{{ baseData.facilityName || "--" }}</span>
      </el-col>
    </el-row>
    <div class="content">
      <div class="left">
        <div v-for="(it, index) in list" :key="index">
          <span class="overview">{{ it.title || "--" }}</span>
          <div class="descrip-list">
            <div
              class="descrip-item"
              :style="{ width: item.large ? '100%' : '50%' }"
              v-for="(item, key) in it.itemList"
              :key="key"
            >
              <div class="lbl">{{ item.name || "--" }}{{ item.unit }}</div>
              <div
                v-if="item.name == '水位' && item.value == 9.999"
                class="txt"
              >
                0
              </div>
              <div
                v-else
                class="txt"
                :class="
                  item.value == 'ONLINE'
                    ? 'online'
                    : item.value == 'OFFLINE'
                    ? 'offline'
                    : item.value == 'ALARM'
                    ? 'alarm'
                    : item.value == 'NORMAL'
                    ? 'abnormal'
                    : ''
                "
              >
                {{ filterValue(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div>
          <span class="overview">实时报警</span>
        </div>
        <div class="threshold">
          <avue-crud
            :option="option"
            :table-loading="loading"
            :data="tableData"
            ref="crud"
            class="table"
            v-model="form"
            @on-load="getThreshold"
          >
          </avue-crud>
        </div>
        <empty
          class="empty"
          :description="'暂无报警记录'"
          v-if="!realAlarmList.length"
        ></empty>
        <template v-else>
          <div v-for="(it, o) in realAlarmList" :key="o">
            <div class="descrip-list">
              <div class="descrip-item" :style="{ width: '100%' }">
                <div class="lbl">报警类型</div>
                <div class="txt">{{ it.alarmType || "--" }}</div>
              </div>
              <div class="descrip-item" :style="{ width: '100%' }">
                <div class="lbl">报警开始时间</div>
                <div class="txt">{{ it.triggerTime || "--" }}</div>
              </div>
              <div class="descrip-item" :style="{ width: '100%' }">
                <div class="lbl">报警持续时长</div>
                <div class="txt">{{ it.alarmDuration || "--" }}</div>
              </div>
              <div class="descrip-item" :style="{ width: '100%' }">
                <div class="lbl">报警描述</div>
                <div class="txt">
                  监测到{{ it.deviceName
                  }}<span class="color-red">{{ it.alarmType }}</span>
                  <span
                    v-for="(thresholdItem, index) in it.alarmIndicesList"
                    :key="index"
                  >
                    ，{{ thresholdItem.name }}为
                    <span class="color-red">{{ thresholdItem.value }}</span>
                    {{ thresholdItem.unit }}
                  </span>
                </div>
              </div>
            </div>
            <el-table
              class="table"
              border
              :data="it.alarmIndicesList"
              style="width: 90%; margin: 0 auto"
              :header-cell-style="{ background: 'rgba(0,0,0,0.02)' }"
            >
              <el-table-column prop="alarmIndicators" label="报警指标">
                <template slot-scope="scope">
                  <div style="color: #595959">
                    {{ scope.row.unit || "--" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="monitoringValue" label="检测值">
                <template slot-scope="scope">
                  <div style="color: #1677ee">
                    {{ scope.row.value || "--" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="threshold" label="阈值">
                <template slot-scope="scope">
                  <div style="color: #1677ee">
                    {{ scope.row.threshold || "--" }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { getRealList } from "@/api/map/monitor.js";
import { getAlarmDetail, getAlarmThreshold } from "@/api/map/alarm.js";
import empty from "../components/empty.vue";
export default {
  components: { empty },
  name: "RealTime",
  props: {
    baseData: {
      type: Object,
      default: () => {},
    },
  },
  filters: {},
  data() {
    return {
      list: [],
      realAlarmList: [],
      ACCESS_TAG: "DETAILS", //访问模式 - 标识
      tableData: [],
      option: {
        menu: false,
        height: "200px",
        calcHeight: 80,
        tip: false,
        searchShow: false,
        border: true,
        index: true,
        indexLabel: "序号",
        indexWidth: 60,
        header: false,
        column: [
          {
            label: "报警等级",
            prop: "level",
            width: 100,
            dicData: [
              { label: "高", value: "HIGH" },
              { label: "中", value: "MIDDLE" },
              { label: "低", value: "LOW" },
            ],
          },
          {
            label: "报警指标",
            prop: "name",
          },
          {
            label: "阈值",
            prop: "threshold",
          },
          {
            label: "说明",
            prop: "ruleDescription",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRealData();
    this.getAlarmDetail();
  },
  methods: {
    filterValue(item) {
      if (item.valueExplain || item.valueExplain === 0) {
        return item.valueExplain;
      } else {
        return item.value || item.value === 0
          ? this.filterState(item.value)
          : "--";
      }
    },
    filterState(val) {
      let str = "";
      switch (val) {
        case "ONLINE":
          str = "在线";
          break;
        case "OFFLINE":
          str = "离线";
          break;
        case "ALARM":
          str = "报警";
          break;
        case "NORMAL":
          str = "正常";
          break;
        default:
          str = val;
      }
      return str;
    },
    getRealData() {
      getRealList({ deviceCode: this.baseData.deviceCode }).then((res) => {
        if (res.length) {
          let accessMode = this.ACCESS_TAG;
          let arr = (res[0].properties.values || []).filter((t) => {
            return t.accessMode.includes(accessMode);
          });
          this.list = [
            {
              title: "实时监控",
              itemList: arr.concat({
                name: "最新上报时间",
                unit: "",
                value: res[0].properties.mot,
                large: true,
                valueExplain: "",
              }),
            },
            {
              title: "工况",
              itemList: [
                {
                  name: "设备状态",
                  value: res[0].properties.alarmStatus,
                  large: true,
                },
                {
                  name: "通讯状态",
                  value: res[0].properties.commStatus,
                  large: true,
                },
              ],
            },
          ];
        } else {
          this.list = [
            {
              title: "实时监控",
              itemList: [],
            },
            {
              title: "工况",
              itemList: [
                {
                  name: "设备状态",
                  value: "--",
                  large: true,
                },
                {
                  name: "通讯状态",
                  value: "--",
                  large: true,
                },
              ],
            },
          ];
        }
      });
    },
    getAlarmDetail() {
      getAlarmDetail({ deviceCode: this.baseData.deviceCode }).then((res) => {
        this.realAlarmList = res;
      });
    },
    getThreshold() {
      getAlarmThreshold({ deviceCode: this.baseData.deviceCode }).then(
        (res) => {
          this.tableData = res;
          this.tableData.forEach((item, index, arr) => {
            arr[index].level = item.alarmType.level;
            let str = "";
            for (let i = 0; i < item.index.length; i++) {
              if (i == item.index.length - 1) {
                str = str + item.index[i].op + item.index[i].value;
              } else {
                str = str + item.index[i].op + item.index[i].value + ", ";
              }
            }
            arr[index].threshold = str;
          });
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.baseInfo {
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  padding: 10px;

  .label {
    color: #b7f1ff;
  }

  .value {
    color: #00e8ff;
    font-weight: 500;
  }
}

.content {
  display: flex;
  justify-content: space-between;

  .left,
  .right {
    width: 589px;
    background: rgba(22, 119, 255, 0.2);
    border: 1px solid rgba(151, 151, 151, 0.15);
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
  }
  .overview {
    margin-left: 32px;
    box-sizing: border-box;
    padding-top: 16px;
    display: inline-block;
    &::before {
      content: "";
      position: absolute;
      width: 4px;
      height: 20px;
      background-color: #117dee;
      left: 19px;
      border-radius: 10px;
    }
  }

  .left {
    position: relative;
    margin-right: 12px;

    .descrip-list {
      box-sizing: border-box;
      margin: 15px;
      display: flex;
      flex-wrap: wrap;

      .descrip-item {
        display: flex;
        border-bottom: 1px solid #1677ee;
        border-left: 1px solid #1677ee;
        box-sizing: border-box;
        .lbl {
          width: 140px;
          height: 45px;
          background: rgba(22, 119, 255, 0.4);
          display: inline-block;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #b7f1ff;
          line-height: 45px;
          padding-left: 25px;
          box-sizing: border-box;
        }

        .txt {
          height: 45px;
          line-height: 45px;
          padding-left: 25px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          color: #0a84ff;
          box-sizing: border-box;
          display: inline-block;
          background: rgba(22, 119, 255, 0.2);
          flex: 1;
          .color-red {
            color: red;
          }
          &.online {
            color: #67c23a;
          }

          &.offline {
            color: #666666;
          }

          &.alarm {
            color: #ff4d4f;
          }

          &.abnormal {
            color: #67c23a;
          }
        }
      }
    }

    .descrip-item:first-child {
      // border-top: 1px solid #f0f0f0;
    }
  }

  .right {
    position: relative;

    .threshold {
      margin: 8px 10px;
    }
    .empty {
      height: calc(100% - 260px);
    }
    .setting {
      margin-left: 400px;
      font-weight: 400;
      color: #1677ff;
    }

    .overview::before {
      content: "";
      position: absolute;
      width: 4px;
      height: 20px;
      // background-color: #117dee;
      left: 19px;
      border-radius: 10px;
    }

    .descrip-list {
      box-sizing: border-box;
      margin: 15px;
      display: flex;
      flex-wrap: wrap;

      .descrip-item {
        display: flex;

        .lbl {
          width: 140px;
          height: 30px;
          display: inline-block;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          color: #b7f1ff;
          line-height: 30px;
          padding-left: 25px;
          box-sizing: border-box;
          background: rgba(22, 119, 255, 0.4);
        }

        .txt {
          // height: 30px;
          line-height: 30px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          text-align: left;
          color: #00e8ff;
          box-sizing: border-box;
          display: inline-block;
          flex: 1;
          background: rgba(22, 119, 255, 0.2);
          .color-red {
            color: red;
          }
          &.online {
            color: #67c23a;
          }

          &.offline {
            color: #666666;
          }

          &.alarm {
            color: #ff4d4f;
          }

          &.abnormal {
            color: #faad14;
          }

          &.highlight {
            color: #333;
            font-weight: 500;
          }
        }
      }
    }
    .table {
      padding: 0 8px;
      table {
        margin-bottom: 8px;
        border-color: rgba(0, 0, 0, 0.09) !important;
        tr {
          th {
            height: 44px;
            // background: #f7f8fa;
            color: #1d2129;
            font-size: 14px;
            border-color: rgba(0, 0, 0, 0.09) !important;
          }
          td {
            height: 44px;
            // background: #ffffff;
            font-size: 14px;
            color: #4e5969;
            text-align: center;
            border-color: rgba(0, 0, 0, 0.09) !important;
          }
        }
      }
    }
    .table {
      :deep(.el-table) {
        background: #17438a;
        &::before {
          background: #1677ee;
          z-index: 10;
        }
        &::after {
          background: #1677ee;
        }
        .el-table__inner-wrapper {
          &::before {
            background: #1677ee;
          }
          &::after {
            background: #1677ee;
          }
          .el-table__cell {
            border-color: #1677ee;
            background: #17438a;
            .cell {
              color: #b7f1ff;
            }
          }
          .el-table__header {
            .el-table__cell {
              background: #164fa7;
            }
          }
        }
      }
    }
    :deep(.el-table__header-wrapper) {
      thead {
        th {
          div {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #606266;
          }
        }
      }
    }
  }
}
</style>
