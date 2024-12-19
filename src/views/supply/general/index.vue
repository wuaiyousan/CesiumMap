<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-02 14:02:40
 * @Description: 综合展示
-->
<script setup>
import { getGeneralIndex } from "@/api/business/supply/general.js";
import UseGlobalMessage from "@/views/common/UseGlobalMessage";
import UseGlobalSupply from "@/views/common/UseGlobalSupply";
import SupplyService from "./SupplyService.vue";
import PipelineAssets from "./PipelineAssets.vue";
import SupplyMonitor from "./SupplyMonitor.vue";
import StationWarning from "./StationWarning.vue";
import Inspection from "./Inspections.vue";
import TrendAnalysis from "./TrendAnalysis.vue";
import TopItem from "./TopItem.vue";
import Historical from "@/components/history-records/HistoryRecords.vue";
const prop = defineProps({
  isExpendBox: {
    type: Boolean,
    default: true,
  },
});

const { doEventSubscribe } = UseGlobalMessage();
const { loadPipeGeneral, unloadPipeGeneral } = UseGlobalSupply();
doEventSubscribe("dynamiclayer-change", (info) => {
  let { checked, id: layerId } = info || {};
  if (layerId === "featlayer_pipenet_Dynamic_NSBD") {
    if (checked) {
      loadPipeGeneral("NSBD");
    } else {
      unloadPipeGeneral("NSBD");
    }
  } else if (layerId === "featlayer_pipenet_Dynamic_FCZZGW") {
    if (checked) {
      loadPipeGeneral("FCZZGW");
    } else {
      unloadPipeGeneral("FCZZGW");
    }
  } else if (layerId === "featlayer_pipenet_Dynamic_XCNZGW") {
    if (checked) {
      loadPipeGeneral("XCNZGW");
    } else {
      unloadPipeGeneral("XCNZGW");
    }
  }
});

doEventSubscribe("scene-select-target", (Obj) => {
  console.log("xhy003", Obj);
  if (Obj.groupType == "stations") {
    dialogVisible.value = true;
    info.title = Obj.name;
    info.hisParams = {
      deviceCode: Obj.id,
      deviceType: Obj.rawData.deviceType,
    };
    fillHistoryInfo(Obj.values);
  }
});
function fillHistoryInfo(res) {
  if (res && res.length) {
    let indexList = [];
    indexList = res;
    info.hisMonitorTypes = indexList
      .filter((t) => t.accessMode.includes("DETAILS"))
      .map((t) => {
        let { key, name, unit } = t;
        return {
          label: name,
          value: key,
          params: {
            dataFields: key,
            timeField: "mot",
          },
          unit: (unit && `${name}(${unit})`) || "",
        };
      });
  } else {
    info.hisMonitorTypes = [];
  }
}

let info = reactive({
  title: "",
  hisParams: {
    deviceCode: "2307419657",
    deviceType: "MS301",
  },
  hisMonitorTypes: [
    {
      label: "累计正向流量",
      params: { dataFields: "ftotal", timeField: "mot" },
      unit: "累计正向流量(m³)",
      value: "ftotal",
    },
  ],
});
onMounted(() => {});
const dialogVisible = ref(false);
const handleClose = (done) => {
  done();
};
</script>

<template>
  <div class="component-wrapper general-view">
    <top-item></top-item>
    <div class="panel-left" v-if="prop.isExpendBox">
      <TrendAnalysis class="panel"></TrendAnalysis>
      <StationWarning class="panel"></StationWarning>
      <SupplyService class="panel"></SupplyService>
    </div>
    <div class="panel-right" v-if="prop.isExpendBox">
      <SupplyMonitor class="panel"></SupplyMonitor>
      <Inspection class="panel"></Inspection>
      <PipelineAssets class="panel"></PipelineAssets>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="info.title"
      width="1411"
      draggable
      :before-close="handleClose"
      :close-on-click-modal="false"
      top="22vh"
    >
      <template #header>
        <div class="custom-header">
          <span class="icon"></span>
          <p>{{ info.title }}</p>
        </div>
      </template>
      <Historical
        :dataTypes="info.hisMonitorTypes"
        :params="info.hisParams"
      ></Historical>
    </el-dialog>
  </div>
</template>

<style lang="less">
.component-wrapper.general-view {
  position: relative;
  // height: 100%;
  .panel-left {
    position: absolute;
    top: 100px;
    left: 10px;
    .panel {
      background: @panelBgColor;
      margin-bottom: @panelMarginBottom;
    }
  }
  .panel-right {
    position: absolute;
    top: 100px;
    right: 10px;
    .panel {
      background: @panelBgColor;
      margin-bottom: @panelMarginBottom;
    }
  }
}
</style>
