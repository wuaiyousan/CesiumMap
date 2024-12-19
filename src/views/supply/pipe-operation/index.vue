<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-10 16:17:18
 * @Description: 管网运行
-->
<script setup>
import UseGlobalMessage from '@/views/common/UseGlobalMessage';
import UseGlobalSupply from '@/views/common/UseGlobalSupply';

import InspectionOverview from './InspectionOverview.vue';
import InspectionHistory from './InspectionHistory.vue';
import TaskEventOverview from './TaskEventOverview.vue';
import PointDialog from './PointDialog.vue';
import { reactive } from 'vue';

const { doEventSubscribe } = UseGlobalMessage();
const {
	loadPipeAll,
	unloadPipeAll,
	loadInspection,
	unloadInspection,
	loadMaintenance,
	unloadMaintenance,
	loadPeople,
	unloadPeople,
	loadEvent,
	unloadEvent,
} = UseGlobalSupply();

doEventSubscribe('dynamiclayer-change', (info) => {
	let { checked, id: layerId } = info || {};
	if (layerId === 'featlayer_pipenet_NSBD') {
		if (checked) {
			loadPipeAll('NSBD');
		} else {
			unloadPipeAll('NSBD');
		}
	} else if (layerId === 'featlayer_pipenet_FCZZGW') {
		if (checked) {
			loadPipeAll('FCZZGW');
		} else {
			unloadPipeAll('FCZZGW');
		}
	} else if (layerId === 'featlayer_pipenet_XCNZGW') {
		if (checked) {
			loadPipeAll('XCNZGW');
		} else {
			unloadPipeAll('XCNZGW');
		}
	} else if (layerId === 'datalayer_pipenet_inspection') {
		if (checked) {
			loadInspection(info);
		} else {
			unloadInspection();
		}
	} else if (layerId === 'datalayer_pipenet_maintenance') {
		if (checked) {
			loadMaintenance(info);
		} else {
			unloadMaintenance();
		}
	} else if (layerId === 'datalayer_pipenet_people') {
		if (checked) {
			loadPeople(info);
		} else {
			unloadPeople();
		}
	} else if (layerId === 'datalayer_pipenet_event') {
		if (checked) {
			loadEvent(info);
		} else {
			unloadEvent();
		}
	}
});
const prop = defineProps({
	isExpendBox: {
		type: Boolean,
		default: true,
	},
});

// 查看详情弹框
const showDialog = ref(false);
const dialogProp = reactive({
	type: '',
	title: '',
	code: '',
});
doEventSubscribe('scene-select-target', (obj) => {
	if (obj && obj.rawData && obj.rawData.equipCode) {
		showDialog.value = true;
		dialogProp.type = obj.rawData.jobCategory;
		dialogProp.title = obj.rawData.equipName;
		dialogProp.code = obj.rawData.equipCode;
	}
});
</script>

<template>
	<div class="component-wrapper pipe-operation" v-if="prop.isExpendBox">
		<div class="pipe-left">
			<!-- 巡检概况 -->
			<InspectionOverview class="left-box panel"></InspectionOverview>
			<!-- 巡检历史 -->
			<InspectionHistory class="left-box panel"></InspectionHistory>
		</div>
		<!-- 任务事件概况 -->
		<TaskEventOverview class="pipe-right panel"></TaskEventOverview>
		<PointDialog
			v-if="showDialog"
			v-model:visible="showDialog"
			:deviceType="dialogProp.type"
			:title="dialogProp.title"
			:deviceCode="dialogProp.code"
		></PointDialog>
	</div>
</template>

<style lang="less">
.component-wrapper.pipe-operation {
	position: relative;
	.pipe-top {
		position: absolute;
		top: 150px;
		left: 680px;
		width: calc(100% - 1360px);
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		.top-item {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 200px;
			height: 58px;
			line-height: 58px;
			border-radius: 4px;
			background: radial-gradient(#054b8b, #053e81 28%, #001f4e);
			border: 1px solid;
			border-image: linear-gradient(180deg, #119ce6 0%, #004eb8 45%, #02449e 78%, #024eb7 100%)
				1.4333332777023315 1.4333332777023315;
			.label {
				color: #eff4ff;
				font-size: 22px;
			}
			.value {
				margin-left: 12px;
				color: #15f1ff;
				font-size: 35px;
			}
		}
	}
	.pipe-left {
		position: absolute;
		top: 100px;
		left: 10px;
	}
	.left-box {
		background: @panelBgColor;
	}
	.pipe-right {
		position: absolute;
		top: 100px;
		right: 10px;
		background: @panelBgColor;
	}
}
</style>
