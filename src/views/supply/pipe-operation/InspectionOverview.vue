<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: xiaomei
 * @LastEditTime: 2024-06-19 12:15:30
 * @Description: inspection
-->
<script setup>
import { getOperationOverview } from '@/api/business/supply/PipeOperation.js';
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
	data: {
		// 任务总数
		totalTask: undefined,
		// 完成任务总数
		completeTask: undefined,
		// 任务完成率
		taskRate: undefined,
	},
});

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
		y: 30,
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
			name: '巡检任务总数',
			type: 'line',
			barWidth: 16,
			smooth: true,
			data: [],
		},
		{
			name: '完成任务数',
			type: 'line',
			barWidth: 16,
			smooth: true,
			data: [],
		},
	],
};

onMounted(() => {
	getOperationOverviewFun();
});
const tablick = (type) => {
	info.type = type;
	getOperationOverviewFun();
};

const getOperationOverviewFun = () => {
	getOperationOverview(info.type).then((res) => {
		info.data.totalTask = res.count;
		info.data.completeTask = res.done;
		info.data.taskRate = res.doneRate;
		info.chartInfo.xData = res.monthlyYearlyData.map((i) => {
			return i.trendDate;
		});
		info.chartInfo.seriesData = [
			{
				name: '巡检任务总数',
				data: res.monthlyYearlyData.map((i) => {
					return i.count;
				}),
			},
			{
				name: '完成任务数',
				data: res.monthlyYearlyData.map((i) => {
					return i.done;
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

<template>
	<BasePanel class="component-wrapper inspection">
		<template v-slot:headerLeft>巡检概况</template>
		<template v-slot:headerRight>
			<TimeSelect
				class="inspection-time"
				:selection="info.type"
				:timeList="info.timeList"
				@time-change="tablick"
			></TimeSelect>
		</template>
		<div class="top">
			<div class="stat-item">
				<p class="item-label">巡检任务总数</p>
				<p class="item-text">{{ info.data.totalTask }}个</p>
			</div>
			<div class="stat-item">
				<p class="item-label">完成任务总数</p>
				<!--TODO 确认字段-->
				<p class="item-text">{{ info.data.completeTask }}个</p>
			</div>
			<div class="stat-item">
				<p class="item-label">任务完成率</p>
				<p class="item-text">{{ info.data.taskRate }}%</p>
			</div>
		</div>
		<ChartView
			class="rank-container"
			:chartInfo="info.chartInfo"
			:preHandler="chartPreHandler"
			:chartOpt="chartOpt"
		></ChartView>
	</BasePanel>
</template>

<style lang="less" scoped>
.component-wrapper.base-panel.component-wrapper.inspection {
	height: 820px;

	.title {
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
		color: #cbfdff;
	}
	.top {
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 40px;
		.stat-item {
			width: 190px;
			height: 149px;
			line-height: 149px;
			margin-bottom: 10px;
			background: linear-gradient(180deg, rgba(6, 84, 177, 0), rgba(29, 115, 255, 0.47) 100%);
			.item-label {
				margin-top: 20px;
				margin-left: 16px;
				font-size: @titleSize7;
				font-weight: 600;
				text-align: center;
				color: @font-color-light;
				line-height: 60px;
			}
			.item-text {
				margin: 6px 0;
				font-size: @titleSize8;
				font-weight: 500;
				text-align: center;
				color: @active-color;
				line-height: 50px;
				text-align: center;
			}
		}
	}
	.rank-container {
		height: 510px;
	}
	.rank-container1 {
		height: 190px;
	}
}
</style>
