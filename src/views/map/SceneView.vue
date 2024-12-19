<!--
 * @Author: fishScola
 * @Date: 2022-06-14 14:04:15
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 15:16:25
 * @Description: SceneView
-->
<script setup>
import FlatLayerList from "./basic/FlatLayerList.vue";
import MapStatus from "./basic/MapStatus.vue";
import SceneMap from "./basic/SceneMap.vue";
import { layersByPath, layersByModule } from "./data/layers.config.js";
import mapConfig from './data/map.config.js'
import { viewConf } from "./data/scene.config.js";
import { globalStore } from "../../store/globalStore";
import UseEffects from "./uses/UseEffects.js";
import UseViewer from './uses/UseViewer.js'
import UseLiaoCheng from "./uses/UseLiaoCheng.js";
import FormatUtil from "./utils/FormatUtil.js";

import UseGlobalMessage from '../common/UseGlobalMessage';
import PopoverBox from './basic/PopoverBox.vue';
import ViewButtons from './basic/ViewButtons.vue';
import ChartPopover from './extend/ChartPopover.vue';
import InfoPopover from './extend/InfoPopover.vue';
import StationPopover from './extend/StationPopover.vue';
import DynamicDrawing from './extend/DynamicDrawing.vue';

import './assets/station.style.css';

const { viewOptions, elevation } = viewConf;
const { loadGlobelMaterial, unloadGlobelMaterial, animateTarget } = UseEffects();
const { zoomToTargetbyParam } = UseViewer()

const {
	loadDistricts,
	unloadDistricts,
	loadPumps,
	unloadPumps,
	loadWaterPlant,
	unloadWaterPlant,
	loadVillages,
	unloadVillages,
} = UseLiaoCheng();
const { showStatus } = defineProps({
	// 显示状态栏
	showStatus: {
		type: Boolean,
		default: function () {
			return false;
		},
	},
});

onMounted(() => {
	// 初始化场景
	initScene();
});

onBeforeUnmount(() => {
	let toEarth = window.earthObj;
	if (toEarth) {
		unloadGlobelMaterial();
		unloadDistricts();
		unloadPumps();
		unloadWaterPlant();
		unloadVillages();
	}
});

const mapRef = ref(null);
const mapStatusbarRef = ref(null);

function initScene() {
	let toRef = mapRef.value;
	if (toRef) {
		let defaultLayers = mapConfig.getScenarioList().filter((item)=>item.isDefault)
		let basicLayers = defaultLayers.flatMap((item)=>{
			return item.layerList.filter((it)=>it.checked)
		})
		toRef.doInit({ sceneList: basicLayers });
	}
}

function sceneLoaded({ sceneList }) {
	// 状态栏初始化
	let statusbarRef = mapStatusbarRef.value;
	if (statusbarRef) {
		statusbarRef.doInit();
	}
	//设置大气属性

	let toEarth = window.earthObj;


	// 关于地形上色
	if (elevation && elevation.enable) {
		loadGlobelMaterial(toEarth, elevation);
	}

	// postProcess
	// const bloom = toEarth.postProcess.bloom;
	// bloom.enabled = false;
	// bloom.glowOnly = false;
	// bloom.contrast = 119;
	// bloom.brightness = 0.4;
	// bloom.delta = 0.9;
	// bloom.sigma = 3.78;
	// bloom.stepSize = 5;
	// bloom.isSelected = false;

	// scene
	const viewer = earthObj._viewer;
	viewer.scene.hdrEnabled = true; //hdr
	// viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
	// viewer.scene.backgroundColor = Cesium.Color.fromBytes(8, 58, 108, 100);
	viewer.scene.sun.show = true; //太阳光
	viewer.scene.moon.show = false; //月亮光
	viewer.scene.skyBox.show = false; //
	// viewer.scene.globe.enableLighting = false; //全局光
	viewer.scene.globe.globeAlpha = 0.001;
	viewer.scene.fxaa = true; //图像改善
	viewer.scene.skyAtmosphere.show = false; //天空

	const fs =
		'uniform sampler2D colorTexture;\n' +
		'varying vec2 v_textureCoordinates;\n' +
		'uniform float scale;\n' +
		'uniform vec3 offset;\n' +
		'void main() {\n' +
		'    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
		'    gl_FragColor = vec4(color.rgb * scale + offset, 1.0);\n' +
		'}\n';
	viewer.scene.postProcessStages.add(
		new Cesium.PostProcessStage({
			fragmentShader: fs,
			uniforms: {
				scale: 1.1,
				offset: function () {
					return new Cesium.Cartesian3(0.1, 0.2, 0.3);
				},
			},
		})
	);

	// 初始化状态标记
	info.initialized = true;

	// 加载业务图层信息
	if (info.layerPath) {
		window.setTimeout(() => {
			info.layerList = layersByModule(info.layerPath);
		}, 2500);
	}
}

// 图层 - 变更
const info = reactive({
	initialized: false,
	layerPath: '',
	layerList: [],
});
const { doEventSubscribe, doEventSend } = UseGlobalMessage();
// 图层变更消息
doEventSubscribe('scene-layerlist-change', (path) => {
	if (path) {
		if (info.initialized) {
			info.layerPath = path;
			info.layerList = layersByModule(path);
		} else {
			info.layerPath = path;
		}
	}
});

// 点击场景中的测站
const { pixel2Lonlat } = FormatUtil();
doEventSubscribe("scene-left-click", (movement) => {
  // 根据window缩放比例重新计算鼠标位置
  let wScale = globalStore().getScale();
  let newPosition = new Cesium.Cartesian2(
    movement.position.x / wScale,
    movement.position.y / wScale
  );
  let pick = window.earthObj._viewer.scene.pick(newPosition);
  if (pick && pick.id !== undefined) {
    let toEntity = pick.id;
    if (!toEntity || !toEntity.id) {
      return;
    }
    let toCustom = customInfoByEntity(toEntity);
    if (toCustom && toCustom.type) {
      doEventSend("scene-select-target", toCustom);
      // 闪烁
      animateTarget(toEntity);
      // 定位到模型
      let viewer = window.earthObj._viewer
      zoomToTargetbyParam(viewer,toCustom.code)
    }else if(toCustom && toCustom.groupType){
			// todo: polygon,polyline的选中样式
			doEventSend("scene-select-target", toCustom);
		}
  } else {
    doEventSend("scene-click-empty");
  }
});

doEventSubscribe("scene-mouse-move", (movement) => {
      // 根据window缩放比例重新计算鼠标位置
  let wScale = globalStore().getScale();
  let newPosition = new Cesium.Cartesian2(
    movement.endPosition.x / wScale,
    movement.endPosition.y / wScale
  );
	let theViewer = window.earthObj._viewer
  let pick = theViewer.scene.pick(newPosition);
  if (pick && pick.id !== undefined) {
    let toEntity = pick.id;
    if (!toEntity || !toEntity.id) {
      return;
    }
    let toCustom = customInfoByEntity(toEntity);
    if (toCustom && toCustom.type) {
			theViewer._element.style.cursor = 'pointer'
    }else {
			theViewer._element.style.cursor = ''
		}
  } else {
    theViewer._element.style.cursor = ''
  }
})

const { propertyBagToObj } = FormatUtil();
// 获取entity上绑定的自定义信息
function customInfoByEntity(theEntity) {
  let theId = theEntity.id;
  let entity = []
    .concat(theEntity.entityCollection._entities.values)
    .find((it) => it.id === theId);
  if (entity && entity.properties) {
    return propertyBagToObj(entity.properties);
  }
  return null;
}

// 悬浮层
const popoverList = ref([]);
// 需要隐藏的 id 列表（如级别缩放控制气泡框显示或隐藏）
const hideList = ref([]);

// 监听需要展示的测站Popover
doEventSubscribe('station-popover-change', (data) => {
	if (data) {
		popoverList.value = [];
		nextTick(() => {
			popoverList.value = data;
		});
	}
});
// 监听需要展示的Popover
let infoObj = {};
doEventSubscribe('dynamic-popover-change', (toInfo) => {
	if (!toInfo) {
		popoverList.value = [];
		infoObj = {};
		return;
	}
	let { type, list, filled } = toInfo;
	if (!type) {
		return;
	}
	// 针对需要做级别控制的内容
	if (filled !== undefined) {
		let ids = [].concat(infoObj[type] || []).map((k) => k.id);
		// 移除当前
		hideList.value = filled
			? hideList.value.concat(ids)
			: hideList.value.filter((k) => !ids.includes(k));
		// 已经有对应type的数据,处于级别控制popover显隐
		if (ids.length) {
			return;
		}
	}
	// 数据缓存处理
	if (infoObj[type] && list.length < 1) {
		infoObj[type] = [];
	} else {
		infoObj[type] = list || [];
	}
	// 记录之前数据
	let nowList = [];
	for (const key in infoObj) {
		if (infoObj[key] && key !== type) {
			nowList = nowList.concat(infoObj[key] || []);
		}
	}
	popoverList.value = nowList;
	nextTick(() => {
		popoverList.value = nowList.concat(infoObj[type]);
	});
});

function isInvisible(it) {
	if (it.id !== undefined && hideList.value.includes(it.id)) {
		return 'invisible';
	}
	return '';
}

// 缩放展开
import { useToolStore } from '@/store/useToolStore.js';
const toolStore = useToolStore();
</script>

<template>
	<div class="component-wrapper scene-view">
		<!-- 场景部分 -->
		<SceneMap :options="viewOptions" class="scene-map" ref="mapRef" @scene-loaded="sceneLoaded">
			<slot name="mapSlot"></slot>
		</SceneMap>
		<!-- 状态栏 -->
		<MapStatus v-if="showStatus" ref="mapStatusbarRef"></MapStatus>
		<!-- 复位与俯视按钮 -->
		<ViewButtons :class="toolStore.isExpendBox ? 'view-buttons' : 'zoom-buttons'"></ViewButtons>
		<!-- 扁平图层列表 -->
		<FlatLayerList
			:class="toolStore.isExpendBox ? 'scene-flat-layers' : 'zoom-layer'"
			:layerList="info.layerList"
      v-show="info.layerList.length"
		></FlatLayerList>
		<!-- 覆盖层-动态方式 -->
		<PopoverBox
			:class="[it.popover || it.sttp, isInvisible(it)]"
			v-for="(it, index) in popoverList"
			:params="it.position"
			:key="index"
		>
			<StationPopover v-if="it.sttp" :params="it"></StationPopover>
			<InfoPopover v-if="it.popover === 'info'" :params="it"></InfoPopover>
			<ChartPopover v-else-if="it.popover === 'chart'" :params="it"></ChartPopover>
		</PopoverBox>
		<!-- 所有动态加载图层，样式方法集合 -->
		<DynamicDrawing></DynamicDrawing>
		<slot></slot>
	</div>
</template>

<style lang="less" scoped>
.component-wrapper.scene-view {
	position: relative;
	width: 100%;
	height: 100%;

	.scene-map {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
	}

	.scene-flat-layers {
		position: absolute;
		bottom: 100px;
		left: 710px;
		z-index: 10;
	}
	.zoom-layer {
		position: absolute;
		bottom: 100px;
		left: 50px;
		z-index: 10;
	}

	.view-buttons {
		position: absolute;
		right: 710px;
		bottom: 100px;
		z-index: 10;
	}
	.zoom-buttons {
		position: absolute;
		right: 50px;
		bottom: 100px;
		z-index: 10;
	}

	.popover-box.invisible {
		display: none;
	}
}
</style>
