<!--
 * @Author: fishScola
 * @Date: 2020-12-24 15:41:34
 * @LastEditors: fishScola
 * @LastEditTime: 2022-06-14 20:44:25
 * @Description: MapStatus
-->
<script setup>
let _disposers = [];
onBeforeUnmount(() => {
  if (_disposers && _disposers.length) {
    _disposers.forEach((d) => d());
    _disposers.length = 0;
  }
});

// 对外公开的方法
defineExpose({
  doInit,
});

const info = reactive({
  fpsString: "",
  cameraString: "",
});
function doInit() {
  if (!window.earthObj) {
    return;
  }
  let earthObj = window.earthObj;

  let scene = earthObj.czm.scene;
  let camera = earthObj.czm.camera;

  const td = Cesium.Math.toDegrees;

  const updateCameraString = () => {
    info.cameraString = `经度：${td(camera.positionCartographic.longitude).toFixed(
      5
    )}°  纬度：${td(camera.positionCartographic.latitude).toFixed(
      5
    )}°  高度：${camera.positionCartographic.height.toFixed(2)}米  偏航角：${td(
      camera.heading
    ).toFixed(2)}°  俯仰角：${td(camera.pitch).toFixed(2)}°  翻滚角：${td(
      camera.roll
    ).toFixed(2)}°`;
  };

  _disposers = [];
  _disposers.push(camera.changed.addEventListener(updateCameraString));

  updateCameraString();

  // 帧率的计算借助了Cesium中的东西，需要开启debugShowFramesPerSecond
  scene.debugShowFramesPerSecond = true;
  const tempDisposer = scene._postRender.addEventListener(() => {
    tempDisposer();
    scene._performanceContainer.style.visibility = "hidden"; // 隐藏默认的帧率显示窗口
  });

  _disposers.push(
    scene._postRender.addEventListener(() => {
      if (scene._performanceDisplay) {
        info.fpsString = `帧率：${scene._performanceDisplay._fpsText.nodeValue}  `;
      } else {
        info.fpsString = "";
      }
    })
  );
}
</script>

<template>
  <div class="component-wrapper map-status">
    {{ info.fpsString }} {{ info.cameraString }}
  </div>
</template>

<style lang="less" scoped>
.component-wrapper.map-status {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  text-align: right;
  background: @panelBgColor;
  color: @colorMinorOnWhite;
  user-select: none;
}
</style>
