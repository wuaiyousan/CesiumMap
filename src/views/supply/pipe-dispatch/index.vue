<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-25 10:06:36
 * @Description: 管网调度
-->
<script setup>
import { getConsumptionInfo } from "@/api/business/supply/dispatch.js";
import UseGlobalSupply from "@/views/common/UseGlobalSupply";
import UseGlobalMessage from "@/views/common/UseGlobalMessage";
import UseGlobalScene from "../../map/uses/UseGlobalScene";
import BaseReminder from "../components/BaseReminder.vue";
import DispatchOrder from "./DispatchOrder.vue";
import PumpView from "./PumpView.vue";
import StationMonitor from "./StationMonitor.vue";
import SupplyMonitor from "./SupplyMonitor.vue";
import WarningInfo from "./WarningInfo.vue";

// 管网调度 - 统计
const statList = ref([
  { name: "今日供水量", value: 36, company: "吨" },
  { name: "今日电耗", value: 115.20, company: "千瓦时" },
  { name: "吨水电耗", value: 3.2, company: "千瓦时/吨" },
]);

onMounted(() => {
  getConsumptionInfo().then((res) => {
    let { powerConsumptionToday, tonsOfWaterConsumption, waterSupplyToday } = res || {};
    statList.value = [
      { name: "今日供水量", value: waterSupplyToday, company: "吨" },
      { name: "今日电耗", value: powerConsumptionToday, company: "千瓦时" },
      { name: "吨水电耗", value: tonsOfWaterConsumption, company: "千瓦时/吨" },
    ];
  });
});

onBeforeUnmount(() => {
  if (highlight) {
    highlight.value = null;
  }
});

const highlight = ref(null);
// 点击目标物 - 泵站 或 其它
const { doEventSubscribe } = UseGlobalMessage();
const { flyToEntity } = UseGlobalScene();
doEventSubscribe("scene-target-change", (ent) => {
  if (!ent) {
    return;
  }
  if (ent.targetId && String(ent.targetId).startsWith("pump_")) {
    // 泵站
    highlight.value = getEntityProps(ent);
  } else {
    // 其它
    flyToEntity(ent);
  }
});

const {
  loadPipeGeneral,
  unloadPipeGeneral,
  loadPoiByParams,
  unloadPoiByParams,
  getEntityProps,
} = UseGlobalSupply();
doEventSubscribe("dynamiclayer-change", (info) => {
  let { checked, id: layerId } = info || {};
  if (layerId === "featlayer_pipenet_general") {
    if (checked) {
      loadPipeGeneral();
    } else {
      unloadPipeGeneral();
    }
  } else if (layerId === "datalayer_point_sg") {
    if (checked) {
      loadPoiByParams({
        layer: info,
        showFields: [
          { code: "detectionPointName", name: "监测点", value: "", append: "" },
          { code: "currentValue", name: "流量", value: "", append: "m³/h" },
          { code: "updateTime", name: "监测时间", value: "", append: "" },
        ],
        tag: "sg",
      });
    } else {
      unloadPoiByParams({ tag: "sg" });
    }
  } else if (layerId === "datalayer_point_stress") {
    if (checked) {
      loadPoiByParams({
        layer: info,
        showFields: [
          { code: "detectionPointName", name: "监测点", value: "", append: "" },
          { code: "currentValue", name: "压力", value: "", append: "MPa" },
          { code: "updateTime", name: "监测时间", value: "", append: "" },
        ],
        tag: "stress",
      });
    } else {
      unloadPoiByParams({ tag: "stress" });
    }
  } else if (layerId === "datalayer_point_wq") {
    if (checked) {
      loadPoiByParams({
        layer: info,
        showFields: [
          { code: "detectionPointName", name: "监测点", value: "", append: "" },
          { code: "turbidity", name: "浊度", value: "", append: "NTU" },
          { code: "residualChlorine", name: "余氯", value: "", append: "mg/L" },
          { code: "ph", name: "PH", value: "", append: "" },
          { code: "updateTime", name: "监测时间", value: "", append: "" },
        ],
        tag: "wq",
      });
    } else {
      unloadPoiByParams({ tag: "wq" });
    }
  } else if (layerId === "datalayer_point_pp") {
    if (checked) {
      loadPoiByParams({
        layer: info,
        showFields: [
          { code: "deviceName", name: "监测点", value: "", append: "" },
          { code: "rainfall", name: "监测值", value: "0.00", append: "" },
          { code: "updateTime", name: "监测时间", value: "--", append: "" },
        ],
        tag: "pp",
      });
    } else {
      unloadPoiByParams({ tag: "pp" });
    }
  } else if (layerId === "datalayer_point_nsdbsc") {
    if (checked) {
      loadPoiByParams({
        layer: info,
        showFields: [
          { code: "deviceName", name: "名称", value: "", append: "" },
          { code: "rainfall", name: "地址", value: "0.00", append: "" },
        ],
        tag: "nsdbsc",
      });
    } else {
      unloadPoiByParams({ tag: "nsbdsc" });
    }
  }
});

function onDialogClose() {
  highlight.value = null;
}
</script>

<template>
  <div class="component-wrapper pipe-dispatch">
    <StationMonitor class="dispatch-station"></StationMonitor>
    <SupplyMonitor class="dispatch-supply"></SupplyMonitor>
    <DispatchOrder class="dispatch-order"></DispatchOrder>
    <WarningInfo class="warning-info"></WarningInfo>
    <PumpView
      v-if="highlight"
      :params="highlight"
      class="dispatch-pump"
      @dialog-close="onDialogClose"
    ></PumpView>
    <BaseReminder large :baseTitle="statList"></BaseReminder>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.pipe-dispatch {
  position: relative;

  .dispatch-station {
    position: absolute;
    top: 100px;
    left: 10px;
  }

  .dispatch-supply {
    position: absolute;
    top: 530px;
    left: 10px;
  }

  .dispatch-order {
    position: absolute;
    top: 710px;
    right: 10px;
  }

  .warning-info {
    position: absolute;
    top: 100px;
    right: 10px;
  }

  .dispatch-pump {
    position: absolute;
    top: 640px;
    right: 660px;
    // left: 600px;
    width: 800px;
  }
}
</style>
