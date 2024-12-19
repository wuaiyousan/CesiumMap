<!--
 * @Author: fishScola
 * @Date: 2022-07-10 12:17:52
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-10 16:13:48
 * @Description: 扁平布局的图层列表
-->
<script setup>
import UseGlobalMessage from "../../common/UseGlobalMessage";
import UseFeatureService from "../uses/UseFeatureService";
import UseServices from "../uses/UseServices";
import UseViewer from "../uses/UseViewer";
import UseDataSource from "../uses/UseDataSource";


const {
  doEventSubscribe,
  doEventSend,
  // doStationUnregist,
  // doStationRegist,
} = UseGlobalMessage();
const { loadWmsLayer, loadWmtsLayer, getFeatureList, unloadMapServiceLayer } = UseServices();
const {
  findEntityLayer,
  toggleEntityLayer,
  createStationByParams,
  updateStationTips,
} = UseViewer();
const { loadDataSourceByParams, hideOrShowLayer,loadTest } = UseDataSource();


const props = defineProps({
  // 待显示的图层
  layerList: {
    type: Array,
    default: function () {
      return [];
    },
  },
  uniqueKey: {
      type: String,
      default: function () {
        return "id";
      },
    },
});

let info = reactive({
  // 在场景中已经添加的图层
  showList: [],
  // 显示的标记
  showObj: {},
  // 当前被选中的图层
  checkList: [],
});

const storeMap = {
  stationTags: ["PP", "PZ", "ZZ", "SG", "VIDEO", "SS", "VWM", "WQ", "ZG", "WATERSOURCE"],
  messageTags: ["PP", "PZ", "ZZ", "SG", "SS", "VWM", "WQ", "ZG"],
};

onMounted(() => {
  watchEffect(() => {
    let layers = props.layerList.flatMap((group) =>
      group.groupList.filter(
        (val) => group.checkList.includes(val.id) 
      )
    );
    if (layers.length) {
      showByParams(layers);
      info.showList = layers;
      info.checkList = layers.filter((it) => it.checked).map((it) => it.id);
    } else {
      showByParams(layers);
      info.showList = [];
      info.checkList = [];
      info.showObj = {};
    }
  });
});

// 直接删除的方式
function showByParams(fromList) {
  // 通过过滤，区分出待删除和待添加的图层，分别予以处理
  // dynamic - 事件抛出 | 其它类型，直接show/hide
  let { addList, delList } = dispartBetween(info.showList, fromList);
  let out = [];
  if (delList.length) {
    out = delList.map(unloadFlatLayer);
  }
  if (addList.length) {
    out = out.concat(addList.map(loadFlatLayer));
  }
  // 图层切换后 - 测站等推送设置
  if (out.length) {
    Promise.all(out).then((arr) => {
      handleWSEvents({ addList, delList });
    });
  }
}

// 测站推送数据回调处理
function handleStationEvent(data) {
  if (data) {
    updateStationTips(data);
  }
}

// 是否监测站
function isStation(type) {
  return storeMap.stationTags.includes(type);
}
// 是否约定有数据推送与更新的监测站
function isMessageStation(type) {
  return storeMap.messageTags.includes(type);
}

async function loadFlatLayer(layerItem) {
  // 图层类型分类第一层[mapservice:地图服务,featuresmap:要素服务,dataservice:接口服务]
  // dynamiclayer - 业务方自己获取数据并处理 ????
  let { toType, dataType, extData } = layerItem;
  if (toType === "dynamiclayer") {
    nextTick(() => {
      doEventSend("dynamiclayer-change", layerItem);
    });
  } else if(dataType === "dataservice" || dataType === "featuresmap") {
    nextTick(() => {
      doEventSend("dynamiclayer-change", layerItem);
    });
    return await loadEntitysByParam(layerItem);
  } else if (dataType === "mapservice") {
    loadMapService(layerItem)
  }
  return true;
}

function loadMapService(layerItem){
  let { type } = layerItem
  if(type === 'wms') {
    loadWmsLayer(layerItem)
  } else if(type === 'wmts') {
    loadWmtsLayer(layerItem)
  }
}

// 加载Entity
async function loadEntitysByParam(layerItem) {
  let toLayer = findEntityLayer(layerItem.id);
  if (toLayer) {
    toLayer.show = true;
  } else {
    let { extData } = layerItem;
    let theType = extData.featureType;
    let res = await getFeatureList(layerItem);//通过后端接口获取数据。
    await loadDataSourceByParams({
      layerItem,
      jsonList: res || {},
      show: true,
    });
  }
  return true;
}

async function unloadFlatLayer(layerItem) {
  let { id, toType, dataType, zIndex , extData } = layerItem;
  let toItem = Object.assign({}, layerItem, { checked: false });
  // dynamiclayer - 业务方自己获取数据并处理 | 其它 - 地图上获取数据
  if (toType === "dynamiclayer") {
    doEventSend("dynamiclayer-change", toItem);
  } else if (dataType === "dataservice" || dataType === "featuresmap") {
    doEventSend("stationlayer-change", toItem);
    // todo:部分图层同时加载Entity和Primitive,如何统一处理
    hideOrShowLayer({key: id, show: false, modelCode: extData.isModel ? extData.isModel : false });
  } else if (dataType === 'mapservice') {
    unloadMapServiceLayer(layerItem)
  } else {
    doEventSend("dynamiclayer-change", toItem);
  }
  return true;
}

function dispartBetween(oldList, newList) {
  let oldOnes = oldList.map((it) => `${it.id}`);
  let newOnes = newList.map((it) => `${it.id}`);
  return {
    addList: newList.filter(
      (it) => !oldOnes.includes(`${it.id}`)
    ),
    delList: oldList.filter(
      (it) => !newOnes.includes(`${it.id}`)
    ),
  };
}
// 图层组 - 整体变更
function  groupChange(value, group) {
  // 处理checkbox
  let layerKey = props.uniqueKey;
  let total = group.groupList.map((val) => val[layerKey]);
  group.checkAll = value;
  group.isIndeterminate = false;
  group.checkList = (value && total) || [];
}

// 图层 - 变更
function layerChange(value, item, group) {
    // 图层组 - 全选与选中状态设置
    let count = group.checkList.length;
    let total = group.groupList.length;
    group.checkAll = count === total;
    group.isIndeterminate = count > 0 && count < total;
}


// 图层变更时 - 测站需要订阅和取消订阅推送消息
function handleWSEvents({ addList = [], delList = [], callbackFn = handleStationEvent }) {
  let theObj = info.showObj;
  // if (delList.length) {
  //   delList.forEach((it) => {
  //     let { extData } = it || {};
  //     if (isMessageStation(extData.featureType)) {
  //       let itType = extData.featureType;
  //       doStationUnregist({
  //         type: itType,
  //         ids: theObj[itType] || [],
  //         callbackFn,
  //       });
  //     }
  //   });
  // }
  // if (addList.length) {
  //   addList.forEach((it) => {
  //     let { extData } = it || {};
  //     if (isMessageStation(extData.featureType)) {
  //       let itType = extData.featureType;
  //       doStationRegist({
  //         type: itType,
  //         ids: theObj[itType],
  //         callbackFn,
  //       });
  //     }
  //   });
  // }
}

// 测站图层 - 变更
doEventSubscribe("station-layer-changed", ({ type, select }) => {
  if (type) {
    let lyr = info.showList.find((it) => it.extData && it.extData.featureType === type);
    if (lyr) {
      layerChange(select, lyr);
    }
  }
});

// 分区图层 - 变更
doEventSubscribe("partition-layer-changed", (list) => {
  if (list.length) {
    info.showList.forEach((it) => {
      if (it && list.includes(it.id)) {
        it.checked = false;
      }
    });
    info.checkList = info.checkList.filter((k) => !list.includes(k));
  }
});
</script>

<template>
  <div  class="component-wrapper flat-layerlist">
    <div
      class="layer-list"
      v-for="(groupItem, groupIndex) in layerList"
      :key="groupIndex"
    >
      <el-checkbox
        class="list-group"
        :indeterminate="groupItem.isIndeterminate"
        v-model="groupItem.checkAll"
        @change="groupChange($event, groupItem)"
      >
        {{ groupItem.groupName }}
      </el-checkbox>
      <el-checkbox-group class="group-box" v-model="groupItem.checkList">
        <el-checkbox
          :label="item.id"
          class="group-item"
          v-for="(item, index) in groupItem.groupList"
          :key="index"
          @change="layerChange($event, item, groupItem)"
        >
          <template v-if="item.legend">
            <img
              class="item-img"
              :src="item.legend"
              alt=" "
            />
          </template>
          {{ item.title }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<style lang="less">
.component-wrapper.flat-layerlist {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: rgba(0, 4, 13, 0.3);
  border-radius: 4px;

  .layer-list {
    margin-bottom: 6px;
    //width: 50%;
    margin-right: 5px;
    margin-left: 5px;

    .list-group {
      font-weight: bold;
    }

    .group-box {
      display: flex;
      flex-direction: column;
      margin-left: 16px;

      .group-item {
        display: flex;
        align-items: center;
        width: 100%;
        margin-right: 0;

        ::v-deep .el-checkbox__label {
          display: flex;
          align-items: center;
          color: #909399;
        }

        &.is-checked ::v-deep .el-checkbox__label {
          color: #409eff;
        }

        .item-img {
          width: 20px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
