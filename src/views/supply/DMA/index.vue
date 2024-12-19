<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-08-10 16:15:07
 * @Description: DMA
-->
<script setup>
import { getAreaCount, getSubInfo } from "@/api/business/supply/dma.js";
import UseGlobalMessage from "@/views/common/UseGlobalMessage";
import UseGlobalScene from "../../map/uses/UseGlobalScene";
import UseGlobalSupply from "@/views/common/UseGlobalSupply";
import { onBeforeUnmount } from "vue";
import BaseReminder from "../components/BaseReminder.vue";
import AreaDialog from "./components/AreaDialog.vue";
import ChangeTrend from "./ChangeTrend.vue";
import LekageRank from "./LekageRank.vue";
import NightFlow from "./NightFlow.vue";
import WaterBalance from "./WaterBalance.vue";
import WaterLeakage from "./WaterLeakage.vue";
const prop = defineProps({
  isExpendBox: {
    type: Boolean,
    default: true,
  },
});

let info = reactive({
  dialogTitle: "",
  params: {},
  baseTitle: [
    { name: "一级分区", value: "" },
    { name: "二级分区", value: "" },
    { name: "三级分区", value: "" },
  ],
});

onMounted(() => {
  getAreaCount().then((res) => {
    let dataList = [
      { name: "一级分区", value: res.first_level || "--" },
      { name: "二级分区", value: res.second_level || "--" },
      { name: "三级分区", value: res.third_level || "--" },
    ];
    info.baseTitle = dataList;
  });
});

const { doEventSubscribe, doEventSend } = UseGlobalMessage();
const {
  loadPipeAll,
  unloadPipeAll,
  loadPartition,
  unloadPartition,
  showSubPartition,
  getPropVal,
} = UseGlobalSupply();
const partitionList = [
  "datalayer_pipenet_partition01",
  "datalayer_pipenet_partition02",
  "datalayer_pipenet_partition03",
];
doEventSubscribe("dynamiclayer-change", (info) => {
  let { checked, id: layerId } = info || {};
  if (layerId === "featlayer_pipenet_all") {
    if (checked) {
      loadPipeAll();
    } else {
      unloadPipeAll();
    }
  } else if (partitionList.includes(layerId)) {
    if (checked) {
      // 单选 - 去除勾选
      doEventSend(
        "partition-layer-changed",
        partitionList.filter((k) => k !== layerId)
      );
      loadPartition(info);
    } else {
      unloadPartition(info);
    }
    // 判断是否已添加下级分区气泡框
    if (lastOne) {
      showSubPartition({});
    }
  }
});

doEventSubscribe("scene-select-target", (Obj) => {
  console.log("xhy1113", Obj);
  if (Obj.groupType == "dma-partition") {
    dialogVisible.value = true;
    info.dialogTitle = Obj.name;
    info.params = Obj.rawData;
  }
});
// 点击目标物
const { flyToEntity } = UseGlobalScene();
let lastOne = null;
doEventSubscribe("scene-partition-click", ({ entity: ent, ...others }) => {
  if (!ent) {
    showSubPartition({});
    return;
  }
  if (lastOne && lastOne === ent.id) {
    return;
  }
  lastOne = ent.id;
  // 发服务查询当前分区下的下级分区
  showByEntity(ent, others);
});
doEventSubscribe("scene-click-empty", () => {
  if (lastOne) {
    showSubPartition({});
    lastOne = null;
  }
});

function showByEntity(ent, others) {
  let toCode = getPropVal(ent.properties, "code");
  let toName = getPropVal(ent.properties, "name");
  if (toCode) {
    getSubInfo(toCode).then((res) => {
      showSubPartition({
        ...others,
        code: toCode,
        name: toName,
        data: res,
      });
    });
  }
}

onBeforeUnmount(() => {
  lastOne = null;
});

const dialogVisible = ref(false);
const handleClose = (done) => {
  done();
};
</script>

<template>
  <div class="component-wrapper dma-view">
    <BaseReminder :baseTitle="info.baseTitle"></BaseReminder>
    <div class="panel-left" v-if="prop.isExpendBox">
      <WaterLeakage class="panel"></WaterLeakage>
      <WaterBalance class="panel"></WaterBalance>
      <ChangeTrend class="panel"></ChangeTrend>
    </div>
    <div class="panel-right" v-if="prop.isExpendBox">
      <NightFlow class="panel"></NightFlow>
      <LekageRank class="panel"></LekageRank>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="info.dialogTitle"
      width="1413"
      draggable
      :before-close="handleClose"
      :close-on-click-modal="false"
      top="22vh"
    >
      <template #header>
        <div class="custom-header">
          <span class="icon"></span>
          <p>{{ info.dialogTitle }}</p>
        </div>
      </template>
      <area-dialog :params="info.params"></area-dialog>
    </el-dialog>
  </div>
</template>

<style lang="less">
.component-wrapper.dma-view {
  position: relative;
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
