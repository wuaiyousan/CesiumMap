<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: xiaomei
 * @LastEditTime: 2024-06-19 13:42:47
 * @Description: leak-detection
-->
<template>
	<BasePanel class="component-wrapper history">
		<template v-slot:headerLeft>巡检历史</template>
		<template v-slot:headerRight>
			<TimeSelect
				class="inspection-time"
				:selection="info.type"
				:timeList="info.timeList"
				@time-change="tablick"
			></TimeSelect>
		</template>
		<div class="title">巡检历史统计</div>
		<ChartView
			class="rank-container"
			:chartInfo="info.chartInfo"
			:preHandler="chartPreHandler"
			:chartOpt="chartOpt"
		></ChartView>
	</BasePanel>
</template>

<script setup>
import { getOperationHistory } from '@/api/business/supply/PipeOperation.js';
import dayjs from 'dayjs';
import BasePanel from '../components/BasePanel.vue';
import ChartView from '@/views/common/components/ChartView.vue';
import TimeSelect from '../components/TimeSelect.vue';

let info = reactive({
	// 预警统计图表
	chartInfo: {
		xData: [],
		seriesData: [],
	},
	type: 'MONTH',
	timeList: [
		{ name: '本月', code: 'MONTH' },
		{ name: '本年', code: 'YEAR' },
	],
});
const tablick = (type) => {
	info.type = type;
	handleOperationHistory();
};

let chartOpt = {
	color: ['#FFD03B', '#2AE8BD'],
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
		},
		textStyle: {
			fontSize: 18,
		},
	},
	grid: {
		x: 36,
		y: 40,
		x2: 36,
		y2: 80,
		//   bottom:20,
		borderWidth: 1,
		// containLabel: true,
	},
	legend: {
		show: true,
		bottom: 0,
		itemWidth: 24,
		itemHeight: 14,
		itemGap: 20,
		textStyle: {
			fontSize: 18,
			lineHeight: 24,
			color: '#EFF4FF',
		},
	},
	xAxis: [
		{
			type: 'category',
			boundaryGap: true,
			axisTick: {
				show: false,
			},
			data: [],
			axisLine: {
				lineStyle: {
					color: 'rgba(255, 255, 255, 0.8)',
				},
			},
			axisLabel: {
				show: true,
				color: '#EFF4FF',
				fontSize: 18,
				// interval: 1,
				formatter: '{value}',
				margin: 8,
			},
		},
	],
	yAxis: [
		{
			name: '个',
			nameLocation: 'end',
			// nameRotate: "90",
			nameTextStyle: {
				color: 'rgba(255, 255, 255, 0.8)',
				align: 'right',
				padding: [0, -20, 0, 46],
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(255, 255, 255, 0.4)',
					type: 'dashed',
					dashOffset: [2, 6],
				},
			},
			axisLabel: {
				show: true,
				color: '#EFF4FF',
				fontSize: 18,
			},
		},
	],
	series: [
		{
			name: '巡检上报数',
			type: 'line',
			barWidth: 16,
			smooth: true,
			data: [],
		},
		{
			name: '设备异常数',
			type: 'line',
			barWidth: 16,
			smooth: true,
			data: [],
		},
	],
};

onMounted(() => {
	handleOperationHistory();
});
const handleOperationHistory = () => {
	getOperationHistory(info.type).then(function (res) {
		info.chartInfo.xData = res.map((i) => i.trendDate);
		info.chartInfo.seriesData = [
			{
				name: '巡检上报数',
				data: res.map((i) => {
					return i.count;
				}),
			},
			{
				name: '设备异常数',
				data: res.map((i) => {
					return i.unDone;
				}),
			},
		];
	});
};

// setOption前处理
function chartPreHandler(opts, inOptions) {
	let { xData, seriesData } = inOptions;
	opts.xAxis[0].data = xData;
	opts.series[0].data = seriesData[0].data;
	opts.series[1].data = seriesData[1].data;
}
</script>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.history {
	height: 530px;
	margin-top: 25px;
	.title {
		color: #cbfdff;
		margin-bottom: 20px;
		height: 40px;
		line-height: 40px;
		font-size: 22px;
		font-weight: 500;
		text-align: center;
		background: linear-gradient(
			90deg,
			rgba(162, 210, 255, 0) 0%,
			rgba(115, 173, 255, 0.3) 50%,
			rgba(105, 166, 255, 0) 100%
		);
	}

	.rank-container {
		padding-top: 10px;
		height: 360px;
	}
}
</style>
