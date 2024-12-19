<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:19:27
 * @Description: equipment
-->
<template>
    <BasePanel class="component-wrapper equipment">
      <template v-slot:headerLeft>重点设备</template>
      <div class="statistic-list">
        <div class="statistic-item" v-for="(item, index) in info.list" :key="index">
            <span class='value'>
              {{ item.num }}
            </span>
            <span class="label">{{ item.name }}</span>
        </div>
      </div>
    </BasePanel>
</template>

<script setup>
import BasePanel from "../components/BasePanel.vue";
import { getfacility } from "@/api/business/supply/PipeOperation.js";

let info = reactive({
  list: []
});

onMounted(() => {
  getfacility().then(function (result) {
    info.list = result
  });
});


</script>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.equipment {
    height: 350px;
    .statistic-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 108px;
    padding: 0 20px;

    .statistic-item {
      margin-bottom: 20px;
      width: 140px;
      height: 74px;
      background: rgba(#41cfff, 0.1);
      border-radius: 4px;
      position: static;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      .value {
        font-weight: 500;
        font-size: 26px;
        color: #00E8FF;
        margin-bottom: 10px;

        &.solemn-color {
          color: #898989;
        }
      }

      .label {
        height: 14px;
        font-size: 14px;
        color: #ffffff;
        line-height: 14px;
      }
    }
  }

}
</style>
