<!--
 * @Author: fishScola
 * @Date: 2022-10-15 16:58:29
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 16:01:41
 * @Description: 供水服务
-->
<script setup>
import { getSupplyService } from "@/api/business/supply/general.js";
import BasePanel from "../components/BasePanel.vue";
import NumberCount from "@/views/common/components/NumberCount.vue";
import supplyIcon1 from "@/assets/img/supply/supplyIcon1.png";
import supplyIcon2 from "@/assets/img/supply/supplyIcon2.png";
import supplyIcon3 from "@/assets/img/supply/supplyIcon3.png";
import supplyIcon4 from "@/assets/img/supply/supplyIcon4.png";
import supplyIcon5 from "@/assets/img/supply/supplyIcon5.png";
import supplyIcon6 from "@/assets/img/supply/supplyIcon6.png";
let info = reactive({
  list: [
    {
      name: "供水覆盖村庄",
      value: 559,
      unit: "个",
      iconUrl: supplyIcon1,
    },
    {
      name: "供水覆盖乡镇",
      value: 11,
      unit: "个",
      iconUrl: supplyIcon2,
    },
    {
      name: "供水保障人口数",
      value: 42.43,
      unit: "万人",
      iconUrl: supplyIcon3,
    },
    {
      name: "供水覆盖率",
      value: 100,
      unit: "%",
      iconUrl: supplyIcon4,
    },
    {
      name: "设计供水能力",
      value: 3,
      unit: "万m³/天",
      iconUrl: supplyIcon6,
    },
    {
      name: "供水负荷率",
      value: 0,
      unit: "%",
      iconUrl: supplyIcon5,
    },
  ],
});

onMounted(() => {
  getSupplyService().then((res) => {
    let {
      designSupply,
      supplyCoverRatio,
      supplyRatio,
      waterSupplyCoverTowns,
      waterSupplyCoverVillage,
      waterSupplyPopulation,
    } = res || {};
    let toList = info.list;
    toList[0].value = Number(waterSupplyCoverVillage);
    toList[1].value = Number(waterSupplyCoverTowns);
    toList[2].value = Number(waterSupplyPopulation);
    toList[3].value = Number(supplyCoverRatio);
    toList[4].value = Number(designSupply);
    toList[5].value = Number(supplyRatio);
  });
});
</script>

<template>
  <BasePanel class="component-wrapper general-supply-service">
    <template v-slot:headerLeft>供水服务</template>
    <div class="list">
      <div class="item" v-for="(it, index) in info.list" :key="index">
        <img :src="it.iconUrl" />
        <div class="data">
          <p class="label">{{ it.name }}</p>
          <p class="text">
            <span class="value">{{ it.value }}</span>
            <span class="unit">{{ it.unit }}</span>
          </p>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.general-supply-service {
  height: 384px;
  .list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0px 20px;
    .item {
      width: 260px;
      font-size: 18px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      img {
        width: 69px;
        height: 61px;
      }
      .label {
        line-height: 50px;
        color: @font-color-major;
        font-size: 22px;
      }
      .text {
        color: #57fffc;
        display: flex;
        align-items: flex-end;
        height: 42px;
        .value {
          background: transparent;
          font-size: 42px;
          color: @font-color-light;
        }
        .unit {
          margin-top: 4px;
          margin-left: 6px;
          line-height: 42px;
          font-size: 26px;
          color: @active-color;
        }
      }
    }
  }
}
</style>
