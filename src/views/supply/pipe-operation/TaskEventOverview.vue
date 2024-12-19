<!--
 * @Author: 王建博 wangjianbo@automic.com.cn
 * @Date: 2022-06-29 15:14:59
 * @LastEditors: xiaomei
 * @LastEditTime: 2024-06-19 16:05:11
 * @Description: repair
-->
<template>
	<BasePanel class="component-wrapper task">
		<template v-slot:headerLeft>
			<span>任务事件概况</span>
		</template>
		<template v-slot:headerRight>
			<TimeSelect
				class="inspection-time"
				:selection="info.type"
				:timeList="info.timeList"
				@time-change="tablick"
			></TimeSelect>
		</template>
		<div class="title">事件占比图</div>
		<HeightChart3D id="event-chart" class="pie-echart" :option="pieOption"></HeightChart3D>
		<div class="title">事件数量统计</div>
		<ChartView
			class="rank-container"
			:chartInfo="info.chartInfo"
			:preHandler="chartPreHandler"
			:chartOpt="lineOption"
		></ChartView>
	</BasePanel>
</template>

<script setup>
import { getEventOverview } from '@/api/business/supply/PipeOperation.js';
import BasePanel from '../components/BasePanel.vue';
import ChartView from '@/views/common/components/ChartView.vue';
import TimeSelect from '../components/TimeSelect.vue';

let info = reactive({
	// 预警统计图表
	chartInfo: {
		xData: [],
		seriesData: [],
	},
	chartInfo1: {
		yAxis: [],
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
	handleEventOverview();
};

const pieOption = reactive({
	accessibility: {
		enabled: false,
	},
	title: {
		text: '事件总数',
		y: 220,
		style: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 18,
		},
	},
	subtitle: {
		text: '--个',
		y: 250,
		style: {
			fontSize: 28,
			color: '#15F1FF',
		},
	},
	credits: {
		enabled: false,
	},
	chart: {
		type: 'pie',
		backgroundColor: 'transparent',
		marginTop: 20, // 上边距
		marginBottom: 40, // 下边距
		marginLeft: 40,
		marginRight: 40,
		options3d: {
			enabled: true,
			alpha: 60,
		},
	},
	plotOptions: {
		pie: {
			showInLegend: true,
			innerSize: 250,
			depth: 25,
			cursor: 'pointer',
			colors: ['#5D9BF8', '#2AE8BD', '#FF6B3A', '#FFD03B', '#FFDA98'],
			dataLabels: [
				{
					enabled: true,
					connectorShape: 'straight',
					connectorWidth: 1,
					distance: 10,
					format: '{point.percentage:.2f}%',
					style: {
						color: '#EFF4FF',
						fontSize: 18,
					},
				},
			],
		},
	},
	legend: {
		itemStyle: {
			color: '#EFF4FF', // 设置图例文本颜色
			fontSize: 18,
		},
		itemHoverStyle: {
			color: '#EFF4FF', // 设置hover时的字体颜色
		},
	},
	tooltip: {
		style: {
			fontSize: 20,
		},
		pointFormat: '{point.name}: <b>{point.percentage:.2f}%</b> {point.y}',
		// formatter: function () {
		// 	let pointColor = this.point.color || 'gray';
		// 	// 这里的this指向当前数据点，可以使用this.point来获取数据
		// 	return (
		// 		'<span style="color:' + pointColor + '">●</span> ' + this.point.name + ': ' + this.y + ' 个'
		// 	);
		// },
	},
	series: [
		{
			data: [
				// {
				// 	name: '维修事件',
				// 	y: 0,
				// },
				// {
				// 	name: '爆管事件',
				// 	y: 0,
				// },
				// {
				// 	name: '漏点事件',
				// 	y: 0,
				// },
				// {
				// 	name: 'GIS数据错误',
				// 	y: 0,
				// },
			],
		},
	],
});
let lineOption = {
	// backgroundColor: "#000A18",
	color: ['#5D9BF8', '#2AE8BD', '#FF6B3A', '#FFD03B', '#FFDA98'],
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
		y2: 100,
		// bottom: 20,
		borderWidth: 1,
		// containLabel: true,
	},
	legend: {
		show: true,
		bottom: -8,
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
				interval: 0,
				formatter: '{value}',
				margin: 8,
			},
		},
	],
	yAxis: [
		{
			// name: '件',
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
			name: '维修事件',
			type: 'line',
			barWidth: 16,
			// smooth: true,
			data: [],
		},
		{
			name: '爆管事件',
			type: 'line',
			barWidth: 16,
			// smooth: true,
			data: [],
		},
		{
			name: '漏点事件',
			type: 'line',
			barWidth: 16,
			// smooth: true,
			data: [],
		},
		{
			name: 'GIS数据错误',
			type: 'line',
			barWidth: 16,
			// smooth: true,
			data: [],
		},
		{
			name: '其他',
			type: 'line',
			barWidth: 16,
			// smooth: true,
			data: [],
		},
	],
};

onMounted(() => {
	handleEventOverview();
});

const handleEventOverview = () => {
	getEventOverview(info.type).then((res) => {
		pieOption.series[0].data = res.currentMonthYearData.map((i) => {
			return {
				name: i.typeName,
				y: i.count || 0,
			};
		});
		pieOption.subtitle.text = res.count + '个';

		let keys = Object.keys(res.monthlyYearlyMap);
		keys.sort((a, b) => a.slice(5) - b.slice(5));
		info.chartInfo.xData = keys;
		info.chartInfo.seriesData = res.currentMonthYearData.map((item) => {
			return {
				name: item.typeName,
				type: 'line',
				barWidth: 16,
				data: keys.map((key) => {
					let arr = res.monthlyYearlyMap[key] || [];
					let current = arr.find((i) => i.typeName === item.typeName) || null;
					if (current && current.typeName) {
						return current.count || 0;
					}
					return 0;
				}),
			};
		});
	});
};

// setOption前处理
function chartPreHandler(opts, inOptions) {
	let { xData, seriesData } = inOptions;
	opts.xAxis[0].data = xData;
	opts.series = seriesData;
}
</script>

<style lang="less">
.component-wrapper.base-panel.component-wrapper.task {
	height: 1380px;
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
	.pie-echart {
		width: 100%;
		height: 510px;
		margin-bottom: 50px;
		background: url('../../../assets/img/business-fees/bg2.png') no-repeat; /* 替换为你的图片URL */
		background-size: 70% 70%; /* 让背景图片覆盖整个容器 */
		background-position: 52% 78%; /* 将背景图片居中 */
	}
	.rank-container {
		padding-top: 10px;
		height: 600px;
	}
}
</style>
