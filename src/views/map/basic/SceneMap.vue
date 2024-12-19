<!--
 * @Author: fishScola
 * @Date: 2020-12-22 10:45:09
 * @LastEditors: fishScola
 * @LastEditTime: 2023-02-23 14:15:41
 * @Description: SceneMap
-->
<script setup>
import UseScene from '../utils/UseScene.js';
import '../utils/projection.js';

const { basicSetting, initOthers, initEvents, flyToDefault } = UseScene();

const emit = defineEmits();
function doInit({ sceneList }) {
  return Promise.resolve(initContainer({ sceneList })).then(() => {
    emit('scene-loaded', { sceneList });
  });
}

// 对外公开的方法
defineExpose({
  doInit,
});

onBeforeUnmount(() => {
  if (window.earthObj) {
    window.earthObj = window.earthObj.destroy();
    window.earthObj = null;
  }
});

const { options, defaultOptions } = defineProps({
  options: {
    type: Object,
    default: function () {
      return {};
    },
  },
  defaultOptions: {
    type: Object,
    default: function () {
      return {
        animation: false,
        homeButton: true,
        // 是否显示3D/2D选择器,与scene3DOnly不能同时为true
        // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        scene3DOnly: false,
        sceneModePicker: true,
        requestRenderMode: true,
        fullscreenButton: true,
        vrButton: false,
        infoBox: false,
        navigationHelpButton: true,
      };
    },
  },
});

const earthContainerRef = ref(null);
function initContainer({ sceneList }) {
  // 创建地球
  let earth = new XE.Earth(
    earthContainerRef.value,
    Object.assign({}, defaultOptions, options)
  );

  // 基础场景设置
  basicSetting(earth);

  // 绑定场景树内容,必须有czmObject配置信息
  // earth.sceneTree.root = {
  //   children: sceneList.filter((val) => val.czmObject),
  // };
  
  // 依据配置将场景树中的“地形”等进行初始化
  initOthers(earth, sceneList);

  // 初始化事件
  initEvents(earth);

  // 加载显示默认的场景并聚焦默认视图
  nextTick(() => {
    flyToDefault(earth);
  });

  // 保存实例到全局
  window.earthObj = earth;

  return true;
}
</script>

<template>
  <div class="component-wrapper scene-container" ref="earthContainerRef">
    <slot></slot>
  </div>
</template>

<style lang="less">
.component-wrapper.scene-container {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
// 重置默认样式
.cesium-viewer {
  // 全屏
  .cesium-viewer-fullscreenContainer {
    right: 25px;
    bottom: 55px;
    width: 32px;
    height: 32px;
    border-radius: 14%;
  }

  // 工具栏
  .cesium-viewer-toolbar {
    right: 22px;
    bottom: 87px;
    top: unset;
    text-align: right;

    .cesium-home-button {
      display: inline-block;
    }
    .cesium-navigationHelpButton-wrapper {
      display: block;
      clear: both;

      .cesium-navigation-help-instructions {
        text-align: center;
      }
    }

    .cesium-sceneModePicker-wrapper {
      display: block;
      width: auto;

      .cesium-sceneModePicker-selected {
        float: right;
        margin: 0;
      }
      .cesium-sceneModePicker-dropDown-icon {
        float: left;
        margin: 0 4px;
      }
    }

    .cesium-navigation-help {
      top: unset;
      right: 40px;
      bottom: 0;
      border-radius: 4px;
      transform-origin: 100% 100%;

      .cesium-navigation-button-left {
        border-radius: 4px 0 0 0;
      }
      .cesium-navigation-button-right {
        border-radius: 0 4px 0 0;
      }
      .cesium-navigation-help-instructions {
        border-radius: 0 0 4px 4px;
      }
    }
  }

  .cesium-viewer-timelineContainer {
    display: none;
  }
}

// cesium外部插件 - 指北针和比例尺
.cesium-widget-cesiumNavigationContainer {
  .distance-legend {
    display: none;
    z-index: 9;
    bottom: 0 !important;
    left: 0 !important;
    background: transparent !important;
    border: none !important;
    user-select: none;

    .distance-legend-label {
      color: #d6d6d6;
    }
    .distance-legend-scale-bar {
      border-color: #d6d6d6;
    }
  }

  #navigationDiv {
    & > div:first-child {
      transform: scale(0.8);
      right: -6px !important;
      bottom: 250px;
      top: unset !important;

      .compass-outer-ring {
        fill: rgba(237, 255, 255, 1);
      }
    }

    .navigation-controls {
      display: block;
      top: unset;
      bottom: 191px;
      right: 27px;
      border: none;

      // 隐藏插件中的复位
      & > div:nth-child(2) {
        display: none;
      }

      .navigation-control-icon-zoom-in,
      .navigation-control-icon-zoom-out {
        border-radius: 14%;
      }

      .navigation-control,
      .navigation-control-last {
        &:hover {
          color: #fff;
          fill: #fff;
          background: #48b;
          border-color: #aef;
          box-shadow: 0 0 8px #fff;
        }
      }

      .navigation-control {
        margin-bottom: 2px;
      }

      .navigation-control-icon-zoom-in {
        padding-bottom: 0;
      }
      .navigation-control,
      .navigation-control-last {
        width: 32px;
        background: #303336;
        border: 1px solid #444;
        color: #edffff;
        border-radius: 14%;
      }
    }

    // 陀螺仪 - hover颜色
    .compass-gyro-active,
    .compass-gyro-background:hover + .compass-gyro {
      fill: #aaeeff;
    }
  }
}
</style>
