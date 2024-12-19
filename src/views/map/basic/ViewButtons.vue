<!--
 * @Author: fishScola
 * @Date: 2022-07-17 15:57:50
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-25 09:56:10
 * @Description:
-->
<script setup>
import { Switch } from '@element-plus/icons-vue';
import { viewConf } from '../data/scene.config.js';
import { fullscreenToggel } from '@/utils/tools.js';
const { homeView } = viewConf;

// 复位
function onReset() {
	let toR = Cesium.Math.toRadians;
	let theViewer = window.earthObj && window.earthObj._viewer;
	if (theViewer && theViewer.camera) {
		theViewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(homeView.lon, homeView.lat, homeView.height),
			orientation: {
				heading: toR(homeView.heading),
				pitch: toR(homeView.pitch),
				roll: toR(homeView.roll),
			},
			duration: 0.8,
		});
	}
}

// 俯视
function onLookdown() {
	let toViewer = window.earthObj && window.earthObj._viewer;
	let toCamera = toViewer && toViewer.camera;
	if (toCamera) {
		let carto = toCamera.positionCartographic.clone();
		let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
			toCamera.pickEllipsoid(
				new Cesium.Cartesian2(toViewer.canvas.clientWidth / 2, toViewer.canvas.clientHeight / 2)
			)
		);

		toCamera.setView({
			destination: Cesium.Cartesian3.fromRadians(
				curPosition.longitude,
				curPosition.latitude,
				carto.height
			),
			orientation: {
				heading: Cesium.Math.toRadians(0),
				pitch: Cesium.Math.toRadians(-90),
				roll: Cesium.Math.toRadians(homeView.roll),
			},
		});
	}
}

// 全屏
function onFullScreen() {
	fullscreenToggel();
}
// 缩放展开
import { useToolStore } from '@/store/useToolStore.js';
const toolStore = useToolStore();
const onZoomExpand = () => {
	toolStore.setZoomExpendBoxBool();
};
</script>

<template>
	<div class="component-wrapper view-buttons">
		<span class="btn-item reset" title="复位" @click.stop="onReset"></span>
		<span class="btn-item full-screen" title="全屏" @click.stop="onFullScreen"></span>
		<span class="btn-item lookdown" title="俯视" @click.stop="onLookdown"></span>
		<span class="btn-item icon-box" title="缩放" @click.stop="onZoomExpand">
			<el-icon><Switch /></el-icon>
		</span>
	</div>
</template>

<style lang="less">
.component-wrapper.view-buttons {
	display: flex;
	flex-direction: column;

	.icon-box {
		text-align: center;
		line-height: 60px;
		background: rgba(29, 38, 42, 0.3);
		font-size: 28px;
		color: #9afaff;
		border-radius: 0 0 4px 4px;
		&:hover {
			background: rgba(69, 187, 234, 0.5);
			color: #fff;
		}
	}
	.btn-item {
		width: 50px;
		height: 50px;
		margin-bottom: 1px;
		cursor: pointer;

		&:last-child {
			margin-bottom: 0;
		}

		&.reset {
			background: url('../assets/controls/reset.svg') no-repeat;
			background-size: 100% 100%;
			background-position: 100%;

			&:hover {
				background: url('../assets/controls/reset-hover.png') no-repeat;
				background-size: 100% 100%;
				background-position: 100%;
			}
		}

		&.lookdown {
			background: url('../assets/controls/lookdown.svg') no-repeat;
			background-size: 100% 100%;
			background-position: 100%;

			&:hover {
				background: url('../assets/controls/lookdown-hover.png') no-repeat;
				background-size: 100% 100%;
				background-position: 100%;
			}
		}
		&.full-screen {
			background: url('../assets/controls/full-screen.svg') no-repeat;
			background-size: 100% 100%;
			background-position: 100%;

			&:hover {
				background: url('../assets/controls/full-screen-hover.png') no-repeat;
				background-size: 100% 100%;
				background-position: 100%;
			}
		}
	}
}
</style>
