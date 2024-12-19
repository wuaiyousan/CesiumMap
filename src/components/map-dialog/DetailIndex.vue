<!--
 * @Author: duanlian
 * @Date: 2023-04-14 15:39:44
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-11-28 17:16:30
 * @Description: 
-->
<template>
  <div class="detaiIndex">
    <div class="empty-box" v-if="isEmpty">该测站没有配置展示信息！</div>
    <template v-else>
      <!-- <div class="topHead">
        <base-header
          class="detailTabs"
          @chooseTime="getTabsValue"
          :btnList="newTabs"
          :active="activeTab"
        >
        </base-header>
      </div> -->
      <div class="content">
        <component
          :is="'Historical'"
          :baseData="params"
          :dataTypes="hisMonitorTypes"
          :params="hisParams"
        ></component>
      </div>
    </template>
  </div>
</template>

<script>
// import BaseHeader from './detail/BaseHeader.vue';
// import RealTime from './detail/RealTime.vue';
// import Alarm from './detail/AlarmInfo.vue';
// import Basic from './detail/BaseInfo.vue';
// import OrderInfo from './detail/OrderInfo.vue';
// import Engineering from './detail/Engineering.vue';
// import Technological from './detail/Technological.vue';
import Historical from "@/components/history-records/HistoryRecords.vue";
// import VideoPlay from './detail/VideoPlay.vue';
// import { getDeviceMenu, getMetadataByDeviceCode } from "@/api/map/monitor.js";
export default {
  name: "DetaiIndex",
  components: {
    // BaseHeader,
    // RealTime,
    // Basic,
    // Alarm,
    // OrderInfo,
    // Engineering,
    // Technological,
    // VideoPlay,
    Historical,
  },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      cmpt: "",
      activeTab: "",
      tabLists: [
        { label: "实时数据", value: "RealTime", code: "REAL_TIME_DATA" },
        { label: "历史数据", value: "Historical", code: "HIS_DATA" },
        { label: "基础信息", value: "Basic", code: "BASIC_DATA" },
        { label: "报警信息", value: "Alarm", code: "ALARM_INFO" },
        { label: "工单信息", value: "OrderInfo", code: "WORK_ORDER" },
        {
          label: "工程三维",
          value: "Engineering",
          code: "ENGINEERING_THREE_DIMENSIONAL",
        },
        {
          label: "工艺流程",
          value: "Technological",
          code: "TECHNOLOGICAL_PROCESS",
        },
        { label: "视频", value: "VideoPlay", code: "VIDEO" },
      ],
      newTabs: [], // 历史数据
      hisParams: {},
      hisMonitorTypes: [],
      isEmpty: true,
    };
  },
  created() {
    // this.getTabs().then((bool) => {
    //   if (bool === false) {
    //     return;
    //   }
    // getMetadataByDeviceCode(this.params.deviceCode).then(this.fillHistoryInfo);
    // });
  },
  beforeDestroy() {
    this.cmpt = "";
    this.activeTab = "";
    this.hisParams = {};
    this.hisMonitorTypes = [];
    this.isEmpty = false;
  },
  methods: {
    getTabs() {
      return getDeviceMenu(this.params.deviceCode).then((res) => {
        if (!res || !res.length) {
          this.isEmpty = true;
          return false;
        }
        let tabKeys = res.map((t) => t.key);
        this.newTabs = this.tabLists.filter((t) => tabKeys.includes(t.code));
        this.activeTab = this.newTabs[0].value;
        this.cmpt = this.newTabs[0].value;
      });
    },
    getTabsValue(val) {
      this.activeTab = val;
      this.cmpt = val;
    },
    fillHistoryInfo(res) {
      let props = res && res.properties;
      if (props) {
        let { deviceCode, deviceType, indices, deviceTypeEntity } = props;
        let indexList = [];
        if (indices && indices.length) {
          indexList = indices;
        } else if (deviceTypeEntity && deviceTypeEntity.indices) {
          indexList = deviceTypeEntity.indices;
        }
        this.hisMonitorTypes = indexList
          .filter((t) => t.accessMode.includes("DETAILS"))
          .map((t) => {
            let { key, name, unit } = t;
            return {
              label: name,
              value: key,
              params: {
                // monitorType: 'pressure',
                dataFields: key,
                timeField: "mot",
              },
              unit: (unit && `${name}(${unit})`) || "",
            };
          });
        this.hisParams = {
          deviceCode,
          deviceType,
        };
      } else {
        this.hisParams = {};
        this.hisMonitorTypes = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.detaiIndex {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 12px;
  box-sizing: border-box;

  .content {
    height: calc(100% - 49px);
    // width: 1200px;
  }

  .empty-box {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
    color: #595959;
  }
}
</style>
