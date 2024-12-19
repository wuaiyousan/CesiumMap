<!--
 * @Author: fishScola
 * @Date: 2022-09-28 13:21:54
 * @LastEditors: fishScola
 * @LastEditTime: 2022-09-28 18:08:46
 * @Description: 测站Popover
-->
<script setup>
import { notEmpty } from "@/utils/index.js";
import FormatUtil from "../utils/FormatUtil";

const { heightByLonlat } = FormatUtil();

const { params, offset } = defineProps({
  params: {
    type: Object,
    default: function () {
      return {
        lon: null,
        lat: null,
      };
    },
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 0];
    },
  },
});

let info = reactive({
  scratch: null,
  position: null,
  listening: false,
});

let toScene = null;

const overlayRef = ref(null);

onMounted(() => {
  toScene = (window.earthObj && window.earthObj._scene) || null;

  watchEffect(() => {
    let obj = params || {};
    if (obj.lon && obj.lat) {
      initOverlay(obj.lon, obj.lat);
    }
  });
});

onBeforeUnmount(() => {
  // 移除事件监听
  if (toScene) {
    toScene.preRender.removeEventListener(overlayHandlerFn);
  }
  if (info) {
    info.scratch = null;
    info.position = null;
    info.listening = false;
  }
});

function initOverlay(lon, lat) {
  if (!toScene) {
    return;
  }
  if (notEmpty(lon) && notEmpty(lat)) {
    info.position = Cesium.Cartesian3.fromDegrees(lon, lat, heightByLonlat({ lon, lat }));
  }
  info.scratch = new Cesium.Cartesian2();
  if (info.listening) {
    toScene.preRender.removeEventListener(overlayHandlerFn);
  }
  toScene.preRender.addEventListener(overlayHandlerFn);
  info.listening = true;
}

function overlayHandlerFn() {
  let { position, scratch } = info;
  if (!toScene || !scratch) {
    return;
  }
  let toCanvas = toScene.cartesianToCanvasCoordinates(position, scratch);
  if (Cesium.defined(toCanvas)) {
    let dom = overlayRef.value;
    dom.style.top = `${toCanvas.y + offset[1]}px`;
    dom.style.left = `${toCanvas.x + offset[0]}px`;
  }
}
</script>

<template>
  <div class="component-wrapper popover-box" ref="overlayRef">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.popover-box {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(4, 16, 37, 0.6);
  border-radius: 10px;
  user-select: none;

  &::after {
    content: "";
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top: 10px solid rgba(4, 16, 37, 0.6);
    border-bottom: 0;
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
  }
}
</style>
