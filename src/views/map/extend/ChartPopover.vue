<!--
 * @Author: fishScola
 * @Date: 2022-09-28 16:15:17
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 15:37:54
 * @Description: Popover
-->
<script setup>
import * as echarts from 'echarts';

const props = defineProps({
	params: {
		type: Object,
		default: function () {
			return {
				option: {},
			};
		},
	},
	// 图表配置选项
	chartOpt: {
		type: Object,
		default: function () {
			return {
				// backgroundColor: "#000A18",
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				legend: {
					show: false,
				},
				grid: {
					left: 0,
					right: 0,
					bottom: 0,
					top: 0,
					// containLabel: true,
				},
				xAxis: [
					{
						show: true,
						type: 'category',
						data: [],
						axisLine: {
							show: false,
						},
						axisLabel: {
							color: 'rgba(215, 240, 255, 0.8)',
							fontSize: 14,
							formatter: '{value}',
							interval: 1,
						},
					},
				],
				yAxis: [
					{
						max: 'dataMax',
						axisLine: {
							show: false,
						},
						splitLine: {
							show: false,
						},
						axisLabel: {
							show: false,
						},
					},
				],
				series: [
					{
						name: '',
						type: 'bar',
						stack: 'chart',
						data: [],
					},
					{
						name: '',
						type: 'bar',
						stack: 'chart',
						data: [],
					},
				],
			};
		},
	},
	// setOption前后预处理
	preHandler: {
		type: Function,
		default: function () {
			return null;
		},
	},
	postHandler: {
		type: Function,
		default: function () {
			return null;
		},
	},
	// 空数据提示
	emptyTips: {
		type: String,
		default: function () {
			return '暂无数据';
		},
	},
});

onMounted(() => {
	watch(
		() => props.params.option,
		(newVal, oldVal) => {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				updateChart();
			}
		}
	);
	// 默认执行一次
	updateChart();
});

onBeforeUnmount(() => {
	clearChart();
});

let chartRef = ref(null);
let theChart = null;
function updateChart() {
	if (!theChart) {
		theChart = echarts.init(chartRef.value);
	}
	let theParams = props.params;
	let opts = Object.assign({}, props.chartOpt, theParams.option);
	if (typeof props.preHandler === 'function') {
		props.preHandler(opts, theParams);
	}
	theChart.setOption(Object.assign({}, opts));
	if (typeof props.postHandler === 'function') {
		props.postHandler(theChart, theParams, opts);
	}

	// resize
	window.setTimeout(doResize, 300);

	theChart.off('click', onChartClick).on('click', onChartClick);
}

// resize
function doResize() {
	if (theChart && theChart.resize) {
		theChart.resize();
	}
}

function clearChart() {
	if (theChart && !theChart.isDisposed()) {
		theChart.dispose();
		theChart = null;
	}
}

// click
const emit = defineEmits();
function onChartClick(param) {
	emit('chart-click', param);
}
import NullImg from '@/assets/img/modify/null.png';
</script>

<template>
	<div class="component-wrapper chart-popover">
		<div class="info-list" ref="chartRef">
			<slot>
				<div class="empty-tips" v-show="!theChart">
					<img class="null-img" :src="NullImg" alt="" />
					{{ props.emptyTips }}
				</div>
			</slot>
		</div>
	</div>
</template>

<style lang="less" scoped>
.component-wrapper.chart-popover {
	min-width: 120px;
	height: 100px;

	.info-list {
		height: 100%;
	}
	.empty-tips {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		.null-img {
			width: 80px;
			height: 80px;
		}
	}
}
</style>
<style lang="less">
.component-wrapper.popover-box.chart {
	background: none;

	&::after {
		display: none;
	}
}
</style>
