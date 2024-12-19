<!--
 * @Author: fishScola
 * @Date: 2022-10-15 16:58:29
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:14:29
 * @Description: 巡检概况
-->
<script setup>
import { getInspectionInfo } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import NumberCount from "@/views/common/components/NumberCount.vue";
import TimeSelect from "../components/TimeSelect.vue";

let info = reactive({
  list: [
    // { name: "巡检里程", value: 0, unit: "公里" },
    // { name: "巡检时长", value: 0, unit: "小时" },
    { name: "任务总数", value: 0, unit: "个" },
    { name: "未完成任务数", value: 0, unit: "个" },
    { name: "巡检员", value: 0, unit: "人" },
    { name: "任务完成率", value: 0, unit: "%" },
  ],
  timeType: "",
});

onMounted(() => {
  onTimeChange("YEAR");
});

function onTimeChange(code) {
  info.timeType = code;
  // 数据更新
  getInspectionInfo(code).then((res) => {
    let { totalTask, nonFinish, planFinishRate, processInspector } = res || {};
    let toList = info.list;
    toList[0].value = Number(totalTask);
    toList[1].value = Number(nonFinish);
    toList[2].value = Number(processInspector);
    toList[3].value = Number(planFinishRate.replace("%", ""));
  });
}
</script>

<template>
  <BasePanel class="component-wrapper inspection-overview">
    <template v-slot:headerLeft>巡检概况</template>
    <template v-slot:headerRight>
      <TimeSelect
        class="inspection-time"
        :selection="info.timeType"
        @time-change="onTimeChange"
      ></TimeSelect>
    </template>
    <div class="list">
      <div class="item" v-for="(it, index) in info.list" :key="index">
        <p class="label">{{ it.name }}</p>
        <p class="text">
          <NumberCount class="value" :number="it.value"></NumberCount>
          <span class="unit">{{ it.unit }}</span>
        </p>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.inspection-overview {
  height: 390px;
  .inspection-time {
    width: 90px;
  }

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 20px 50px 20px 45px;
    .item {
      width: 140px;
      font-size: 22px;
      margin-bottom: 30px;

      &:nth-last-child(1),
      &:nth-last-child(2) {
        margin-bottom: 0;
      }

      .label {
        line-height: 50px;
        color: #fff;
        font-size: 22px;
      }

      .text {
        height: 36px;
        color: #57fffc;
        display: flex;

        .value {
          width: fit-content;

          :deep(.number-item > span) {
            background: transparent;
            color: #57fffc;
          }
        }

        .unit {
          margin-top: 4px;
          margin-left: 8px;
          line-height: 30px;
          color: #57fffc;
        }
      }
    }
  }
}
</style>
