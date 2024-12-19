<!--
 * @Author: fishScola
 * @Date: 2022-10-13 13:55:00
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 10:38:31
 * @Description: 站点监测
-->
<script setup>
import BasePanel from "../components/BasePanel.vue";
import SplideView from "@/views/common/components/SplideView.vue";
import { getNightFlow } from "@/api/business/supply/dma.js";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import dayjs from "dayjs";

let info = reactive({
  // splide
  splideList: [],
});

onMounted(() => {
  watchEffect(() => {
    getNightFlow().then((res) => {
      let toArr = res.map((it) => {
        return Object.assign({}, it, {
          reportTime:
            (it.reportTime && dayjs(it.reportTime).format("MM-DD HH:mm")) || "",
        });
      });
      info.splideList = [];
      nextTick(() => {
        info.splideList = toArr;
      });
    });
  });
});
import NullImg from "@/assets/img/modify/null.png";
</script>

<template>
  <BasePanel class="component-wrapper night-flow">
    <template v-slot:headerLeft>夜间最小流量监控</template>
    <div class="splide-box">
      <el-table :data="info.splideList" class="top">
        <el-table-column align="center" type="index" width="60" label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="areaName"
          label="分区名称"
          width="140"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="triggerTime"
          width="140"
          label="分区级别"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="nightLeastFlow"
          label="夜间最小流量(m³/h)"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="nightLeastFlowRate"
          label="环比"
          width="80"
        >
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
              type="index"
              width="60"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              align="center"
              width="140"
              prop="areaName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="triggerTime"
              label="分区级别"
              width="140"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span class="poi" v-if="scope.row.areaLevel == 'first_level'"
                  >一级分区</span
                >
                <span
                  class="poi"
                  v-else-if="scope.row.areaLevel == 'second_level'"
                  >二级分区</span
                >
                <span
                  class="poi"
                  v-else-if="scope.row.areaLevel == 'third_level'"
                  >三级分区</span
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="nightLeastFlow"
              label="夜间最小流量(m³/h)"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="nightLeastFlowRate"
              label="环比"
              width="80"
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
.component-wrapper.night-flow {
  height: 392px;
  background: @panelBgColor;
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
