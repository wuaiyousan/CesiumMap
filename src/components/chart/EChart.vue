<!--
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2023-04-25 14:55:23
 * @LastEditors: xiaomei
 * @LastEditTime: 2023-09-25 16:58:30
 * @Description: 
-->
<script setup>
// import * as echarts from 'echarts';
import { ref, onMounted, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart, EffectScatterChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LegendComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
	BarChart,
	PieChart,
	LineChart,
	EffectScatterChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
	LegendComponent,
]);
import 'echarts-liquidfill/src/liquidFill.js';
import NullImg from '@/assets/img/modify/null.png';

const { id, option } = defineProps({
	id: {
		type: String,
		default: '',
	},
	option: {
		type: Object,
		default: () => {},
	},
});
const showChart = computed(() => {
	if (option.series && option.series[0] && option.series[0].data && option.series[0].data.length) {
		return true;
	}
	return false;
});
// 基础option配置
const baseOption = {
	color: [
		'#FF9D4D',
		'#5B8FF9',
		'#5AD8A6',
		'#5D7092',
		'#F6BD16',
		'#E8684A',
		'#6DC8EC',
		'#9270CA',
		'#ECCC84',
		'#00E8FF',
		'#1F24CA',
		'#FFA20A',
	],
};

onMounted(() => {
	if (showChart.value) {
		initChart();
	}
});
// echart实例无法使用响应式对象接收
let myChart = null;
const chartId = id ? id : Math.round(Math.random() * 1000) + 'Chart';
const initChart = () => {
	// 初始化图表，设置配
	let dom = document.getElementById(chartId);
	if (dom) {
		if (!myChart) {
			myChart = echarts.init(dom);
		}
		myChart.setOption(option);
		window.addEventListener('resize', handleResize);
	}
};
watch(
	// 引用类型需要使用箭头函数进行监听
	() => option,
	() => {
		if (showChart.value) {
			initChart();
		} else {
			myChart && myChart.clear();
			myChart && myChart.setOption(option);
		}
	},
	{ deep: true }
);
onBeforeUnmount(() => {
	if (!myChart) {
		return;
	}
	myChart.clear();
	window.removeEventListener('resize', handleResize);
});
const handleResize = () => {
	myChart.resize();
};
</script>

<template>
	<div :id="chartId" class="echart">
		<slot>
			<div class="empty-tips" v-show="!showChart">
				<img class="null-img" :src="NullImg" alt="" />
				暂无数据
			</div>
		</slot>
	</div>
</template>

<style lang="less" scoped>
.echart {
	width: 100%;
	height: 100%;

	.empty-tips {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		.null-img {
			width: 80px;
			height: 80px;
		}
	}
}
</style>
