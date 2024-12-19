<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 17:11:55
 * @Description: 管网GIS
-->
<script setup>
import UseGlobalMessage from '@/views/common/UseGlobalMessage';
import UseGlobalSupply from '@/views/common/UseGlobalSupply';
import buildsituation from './buildsituation.vue';
import caliber from './caliber.vue';
import equipment from './equipment.vue';
import pipeAge from './pipeAge.vue';
import pipestatistics from './pipestatistics.vue';
import LegendBox from './components/LegendBox.vue';

const { doEventSubscribe } = UseGlobalMessage();
const { loadPipeHealth, unloadPipeHealth, loadPipeByCaliber, unloadPipeByCaliber } = UseGlobalSupply();
doEventSubscribe('dynamiclayer-change', (info) => {
	let { checked, id: layerId } = info || {};
	if (layerId === 'featlayer_pipenet_caliber') {
		if (checked) {
			loadPipeByCaliber();
		} else {
			unloadPipeByCaliber();
		}
	} else if (layerId === 'datalayer_pipenet_health') {
		if (checked) {
			loadPipeHealth(info);
		} else {
			unloadPipeHealth();
		}
		showLegend.value = checked;
	}
});

let showLegend = ref(false);
</script>

<template>
	<div class="component-wrapper pipe-gis">
		<buildsituation class="buildsituation"></buildsituation>
		<pipestatistics class="pipestatistics"></pipestatistics>
		<pipeAge class="pipeAge"></pipeAge>
		<caliber class="caliber"></caliber>
		<equipment class="equipment"></equipment>
		<!-- 管道健康 - 图例 -->
		<LegendBox class="pipe-legend" v-show="showLegend"></LegendBox>
	</div>
</template>

<style lang="less">
.component-wrapper.pipe-gis {
	position: relative;
	.buildsituation {
		position: absolute;
		top: 100px;
		left: 10px;
	}
	.pipestatistics {
		position: absolute;
		top: 770px;
		left: 10px;
	}
	.pipeAge {
		position: absolute;
		top: 100px;
		right: 10px;
	}
	.caliber {
		position: absolute;
		top: 410px;
		right: 10px;
	}
	.equipment {
		position: absolute;
		top: 720px;
		right: 10px;
	}
	.pipe-legend {
		position: absolute;
		top: 100px;
		left: 600px;
	}
}
</style>
