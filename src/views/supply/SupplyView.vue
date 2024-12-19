<!--
 * @Author: fishScola
 * @Date: 2022-04-21 17:59:00
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-10 09:53:54
 * @Description: 供水大屏
-->
<script setup>
import ThematicTabs from '../common/ThematicTabs.vue';
import GeneralView from './general/index.vue'; //综合展示
import BusinessOverview from './business-fees/index.vue'; //营业收费
import DMAView from './DMA/index.vue'; //DMA计量
import PipeOperation from './pipe-operation/index.vue'; //运维巡检
// import PipeGIS from "./pipe-gis/index.vue";
// import PipeDispatch from "./pipe-dispatch/index.vue";

import UseGlobalMessage from '../common/UseGlobalMessage';
const { doEventSend } = UseGlobalMessage();

import { useToolStore } from '@/store/useToolStore.js';
import { onUnmounted, onMounted } from 'vue';
const toolStore = useToolStore();

let info = reactive({
	// 二级主图Tab
	tabList: [
		{ type: 'comprehensive', name: '综合展示' },
		{ type: 'business', name: '营业收费' },
		{ type: 'DMA', name: 'DMA计量' },
		{ type: 'om-inspection', name: '运维巡检' },
		// { type: 'pipe-gis', name: '管网GIS' },
		// { type: 'pipe-dispatch', name: '管网调度' },
	],
	// tab选中项
	tab: '',
});
// 二级主题切换
// 缩放展开控制
const emit = defineEmits();
function onTabChange(type) {
	setTimeout(() => {
		emit('handle-show-map', type !== 'business');
		info.tab = type;
		doEventSend('scene-layerlist-change', `/supply/${type}`);
	}, 300);
}

onMounted(() => {
	// 态势感知 - 默认项
	onTabChange('comprehensive');
});
</script>

<template>
	<div class="component-wrapper supply-view">
		<!-- 综合展示 -->
		<GeneralView
			v-if="info.tab === 'comprehensive'"
			class="perception-view"
			:isExpendBox="toolStore.isExpendBox"
		></GeneralView>
		<!-- 营业收费 -->
		<BusinessOverview v-else-if="info.tab === 'business'" class="business-view"></BusinessOverview>
		<!-- DMA -->
		<DMAView
			v-else-if="info.tab === 'DMA'"
			class="emergency-response"
			:isExpendBox="toolStore.isExpendBox"
		></DMAView>
		<!-- 运维巡检 -->
		<PipeOperation
			v-else-if="info.tab === 'om-inspection'"
			class="planmap-view"
			:isExpendBox="toolStore.isExpendBox"
		></PipeOperation>
		<!-- 管网GIS -->
		<!-- <PipeGIS v-else-if="info.tab === 'pipe-gis'" class="future-rain-view"></PipeGIS> -->
		<!-- 管网调度 -->
		<!-- <PipeDispatch
			v-else-if="info.tab === 'pipe-dispatch'"
			class="moutain-flood-view"
		></PipeDispatch> -->

		<!-- 二级主题Tab -->
		<ThematicTabs
			:tabList="info.tabList"
			:defaultTab="info.tab"
			@thematic-tab-changed="onTabChange"
		></ThematicTabs>
		<img class="img-foot" src="../../assets/img/common/foot-bg.png" alt="" />
	</div>
</template>

<style lang="less" scoped>
.component-wrapper.supply-view {
	position: relative;
	height: 100%;
	.perception-view {
		position: relative;
		z-index: 12;
	}
	.future-rain-view,
	.moutain-flood-view,
	.emergency-response,
	.planmap-view {
		position: relative;
		z-index: 11;
	}
	.img-foot {
		position: absolute;
		z-index: 2;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 32px;
	}
}
</style>
