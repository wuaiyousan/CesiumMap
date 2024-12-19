<!--
 * @Author: fishScola
 * @Date: 2022-06-23 15:45:47
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 15:39:16
 * @Description: ChartView
-->
<script setup>
import * as echarts from 'echarts';

const props = defineProps({
	// 图表渲染用数据等
	chartInfo: {
		type: Object,
		default: function () {
			return {
				// 其它输入的内容
				seriesData: [],
			};
		},
	},
	// 图表配置选项
	chartOpt: {
		type: Object,
		default: function () {
			return {};
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
		() => props.chartInfo.seriesData,
		(newVal, oldVal) => {
			if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
				doUpdate(props.chartInfo);
			}
		}
	);
	// 默认执行一次
	doUpdate(props.chartInfo);
});

onBeforeUnmount(() => {
	clearChart();
});

const emit = defineEmits();
function onChartClick(param) {
	emit('chart-click', param);
}

let newChartOpts = computed(() => {
	return Object.assign({}, props.chartOpt);
});
let chartRef = ref(null);
let theChart = null;
function updateChart(inOptions) {
	if (!theChart) {
		theChart = echarts.init(chartRef.value);
	}
	let opts = {
		grid: {
			x: 10,
			y: 28,
			x2: 58,
			y2: 26,
			borderWidth: 1,
		},
		xAxis: {
			type: 'category',
			data: inOptions.xData || [],
			axisLine: {
				lineStyle: {
					color: 'rgba(255,255,255,0.2)',
				},
			},
			axisLabel: {
				show: true,
				color: 'rgba(215, 240, 255, 0.8)',
				fontSize: 16,
				lineHeight: 22,
				interval: 0,
				formatter: '{value}',
			},
			axisTick: {
				show: false,
			},
			// nameGap: 10,
			nameTextStyle: {
				color: '#879ABE',
				lineHeight: 17,
			},
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: false,
			},
		},
		series: [
			{
				data: [],
				type: 'bar',
				barWidth: 20,
				label: {
					show: true,
					color: '#7DD9FF',
					fontSize: 14,
					lineHeight: 20,
					position: 'top',
				},
			},
		],
	};
	opts = Object.assign({}, opts, newChartOpts.value);
	if (typeof props.preHandler === 'function') {
		props.preHandler(opts, inOptions);
	}
	theChart.setOption(Object.assign({}, opts));
	if (typeof props.postHandler === 'function') {
		props.postHandler(theChart, inOptions, opts);
	}

	// resize
	window.setTimeout(doResize, 300);

	theChart.off('click', onChartClick).on('click', onChartClick);
}

function clearChart() {
	if (theChart && !theChart.isDisposed()) {
		theChart.dispose();
		theChart = null;
	}
}

function doUpdate(params) {
	let { seriesData, ...others } = params;
	if (seriesData && seriesData.length) {
		updateChart({
			...others,
			seriesData,
		});
	} else {
		clearChart();
	}
}

// resize
function doResize() {
	if (theChart && theChart.resize) {
		theChart.resize();
	}
}

// 对外公开的方法
defineExpose({
	doResize,
});
import NullImg from '@/assets/img/modify/null.png';
</script>

<template>
	<div class="component-wrapper chart-view" ref="chartRef">
		<slot>
			<div class="empty-tips" v-show="!theChart">
				<img class="null-img" :src="NullImg" alt="" />
				{{ props.emptyTips }}
			</div>
		</slot>
	</div>
</template>

<style lang="less" scoped>
.component-wrapper.chart-view {
	width: 100%;
	height: 100%;

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
