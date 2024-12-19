<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: fishScola
 * @LastEditTime: 2023-05-11 15:55:10
 * @Description: 营业收费
-->
<script setup>
import UseGlobalMessage from "@/views/common/UseGlobalMessage";
import UseGlobalSupply from "@/views/common/UseGlobalSupply";
import BaseReminder from "../components/BaseReminder.vue";
import BalanceSheetAnalysis from "./components/BalanceSheetAnalysis.vue";
import BusinessAnalysis from "./components/BusinessAnalysis.vue";
import MarketingOverview from "./components/MarketingOverview.vue";
import MeterReading from "./components/MeterReading.vue";
import ServiceQuality from "./components/ServiceQuality.vue";
import WaterAnalysis from "./components/WaterAnalysis.vue";

import { getSynthesis } from "@/api/business/supply/pevenueoverview.js";
import { notEmpty } from "@/utils/index.js";

let info = reactive({
  baseTitle: [],
});

onMounted(() => {
  getSynthesis().then((res) => {
    info.baseTitle = makeList(res || {});
  });
});

// 处理返回的数据
function makeList(obj) {
  let out = [];
  let { recoveryRate, sellWater, supplyWater, actualMoney, userNum } = obj || {};
  out.push({
    name: "回收率",
    value: (notEmpty(recoveryRate) && recoveryRate.replace("%", "")) || "--",
    company: "%",
  });
  let toSell = formatVal(sellWater, "万吨");
  out.push({
    name: "售水量",
    value: toSell.value,
    company: toSell.unit,
  });
  let toSupply = formatVal(supplyWater, "万吨");
  out.push({
    name: "供水量",
    value: toSupply.value,
    company: toSupply.unit,
  });
  let toMoney = formatVal(actualMoney, "元", "万", 1.0e4);
  out.push({
    name: "实收金额",
    value: toMoney.value,
    company: toMoney.unit,
  });
  out.push({
    name: "用户数",
    value: (notEmpty(userNum) && userNum) || "--",
    company: "",
  });
  return out;
}

const { doEventSubscribe } = UseGlobalMessage();
const { loadPipeAll, unloadPipeAll, loadRecovery, unloadRecovery } = UseGlobalSupply();
doEventSubscribe("dynamiclayer-change", (info) => {
  let { checked, id: layerId } = info || {};
  if (layerId === "featlayer_pipenet_all") {
    if (checked) {
      loadPipeAll();
    } else {
      unloadPipeAll();
    }
  } else if (layerId === "datalayer_pipenet_recovery") {
    if (checked) {
      loadRecovery(info);
    } else {
      unloadRecovery();
    }
  }
});

// 数值显示格式化
function formatVal(val, unit, limitText = '千', limitValue = 1.0e3) {
  if (val > limitValue) {
    return {
      value: Number(val / limitValue).toFixed(2),
      unit: (unit ? limitText : "") + unit,
    };
  } else {
    return {
      value: val,
      unit: unit,
    };
  }
}
</script>

<template>
  <div class="component-wrapper revenue-overview">
    <BaseReminder :baseTitle="info.baseTitle"></BaseReminder>
    <MarketingOverview></MarketingOverview>
    <WaterAnalysis></WaterAnalysis>
    <BusinessAnalysis></BusinessAnalysis>
    <MeterReading></MeterReading>
    <BalanceSheetAnalysis></BalanceSheetAnalysis>
    <ServiceQuality></ServiceQuality>
  </div>
</template>

<style lang="less">
.component-wrapper.revenue-overview {
  position: relative;
}
</style>
