<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 10:38:31
 * @Description: 水质监测
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import { getSupplyMonitor } from "@/api/business/supply/general.js";
import dayjs from "dayjs";
import TimeSelect from "../components/TimeSelect.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";

let info = reactive({
  // splide
  splideOption: {},
  splideList: [],
  flowList: [],
  pressureList: [],
  waterQualityList: [],
  type: "waterQuality",
  timeList: [
    { name: "水质", code: "waterQuality" },
    { name: "压力", code: "pressure" },
    { name: "流量", code: "flow" },
  ],
  waterQualityRate: null,
  status: {
    NORMAL: "正常",
    ABNORMAL: "异常",
  },
});

onMounted(() => {
  watchEffect(() => {
    getSupplyMonitor().then((res) => {
      const { flowList, pressureList, waterQualityList, waterQualityRate } =
        res;
      info.splideList = [];
      info.waterQualityList = waterQualityList;
      info.pressureList = pressureList;
      info.flowList = flowList;
      info.waterQualityRate = waterQualityRate;
      nextTick(() => {
        // showByParams(waterQualityList.length);
        info.splideList = waterQualityList;
      });
    });
  });
});

const tablick = (type) => {
  info.type = type;
  if (info.type == "waterQuality") {
    info.splideList = info.waterQualityList;
  } else if (info.type == "pressure") {
    info.splideList = info.pressureList;
  } else if (info.type == "flow") {
    info.splideList = info.flowList;
  }
  // showByParams(info.splideList.length);
};

const tableRowClass = ({ row, rowIndex }) => {
  if (row.status == "ABNORMAL") {
    return "red";
  }
};

import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper supply-monitor">
    <template v-slot:headerLeft>供水监控</template>
    <template v-slot:headerRight>
      <div class="head-right">
        <div class="count" v-if="info.type == 'waterQuality'">
          水质合格率：{{ info.waterQualityRate }}%
        </div>
        <TimeSelect
          class="inspection-time"
          :selection="info.type"
          :timeList="info.timeList"
          @time-change="tablick"
        ></TimeSelect>
      </div>
    </template>

    <div class="splide-box">
      <el-table :data="info.splideList" class="top">
        <el-table-column align="center" type="index" width="60" label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceName"
          label="测站名称"
          width="140"
        >
        </el-table-column>
        <el-table-column
          v-if="info.type == 'waterQuality'"
          align="center"
          prop="indexName"
          label="指标名称"
        >
        </el-table-column>
        <el-table-column align="center" prop="mot" width="140" label="监测时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="value"
          :label="
            info.type == 'flow'
              ? '累计流量(m³)'
              : info.type == 'pressure'
              ? '监测值(MPa)'
              : '监测值'
          "
        >
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="80">
        </el-table-column>
      </el-table>
      <div class="con">
        <Vue3SeamlessScroll
          class="seamless-warp"
          :list="info.splideList"
          :hover="true"
          :limitScrollNum="5"
          :copyNum="10"
          :wheel="true"
          :step="1"
          v-if="info.splideList.length"
        >
          <el-table
            :data="info.splideList"
            stripe
            :show-header="false"
            height="100%"
            :row-class-name="tableRowClass"
            class="bottom"
          >
            <el-table-column align="center" type="index" width="60">
            </el-table-column>
            <el-table-column align="center" width="140" prop="deviceName">
            </el-table-column>
            <el-table-column
              v-show="info.type == 'waterQuality'"
              align="center"
              prop="indexName"
            >
              <template #default="scope">
                <span>{{ scope.row.indexName }}{{ scope.row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="mot"
              label="监测时间"
              width="160"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="value"
              :label="
                info.type == 'flow'
                  ? '累计流量(m³)'
                  : info.type == 'pressure'
                  ? '监测值(MPa)'
                  : '监测值'
              "
            >
            </el-table-column>
            <el-table-column align="center" width="80" prop="status">
              <template #default="scope">
                <span>{{ info.status[scope.row.status] }}</span>
              </template>
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
.component-wrapper.supply-monitor {
  height: 473px;
  background: @panelBgColor;
  .head-right {
    display: flex;
    align-items: center;
    .count {
      height: 30px;
      line-height: 30px;
      margin-right: 20px;
      font-size: @titleSize1;
      color: @active-color;
    }
  }

  .splide-box {
    height: 100%;
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
  ::v-deep(.el-table) .el-table__body .red td.el-table__cell {
    color: @red-color!important;
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
</style>
