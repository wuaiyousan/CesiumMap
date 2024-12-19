import { graphic } from 'echarts';

const color = [
	'#FFDA98',
	'#2AE8BD',
	'#FFA13F',
	'#963110',
	'#FFD03B',
	'#1698F4',
	'#09765E',
	'#D1D6E3',
];
// 供售水趋势图
export const trendsOption = {
	color: color,
	title: {
		text: '供售水趋势图',
		top: 5,
		left: 'center',
		textStyle: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['供水量', '用水量', '产销差率'],
	},
	grid: {
		left: 20,
		right: 20,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	yAxis: {
		name: '万m³',
		type: 'value',
		splitLine: {
			show: true,
			lineStyle: {
				color: ['#999'],
				type: 'dashed',
			},
		},
		axisLine: {
			show: true,
			lineStyle: {
				color: 'rgba(239,244,255,0.8)',
				width: 1.5,
			},
		},
		axisLabel: {
			fontSize: 14,
		},
	},
	series: [
		{
			name: '供水量',
			type: 'line',
			data: [],
		},
		{
			name: '用水量',
			type: 'line',
			data: [],
		},
		{
			name: '产销差率',
			type: 'line',
			data: [],
		},
	],
};
const baseHeightChartOpt = {
	color: color,
	accessibility: {
		enabled: false,
	},
	title: {
		text: '',
	},
	subtitle: {
		text: '',
	},
	credits: {
		enabled: false,
	},
	chart: {
		type: 'pie',
		backgroundColor: 'transparent',
		marginTop: 10, // 上边距
		marginBottom: 10, // 下边距
		marginLeft: 50,
		marginRight: 50,
		options3d: {
			enabled: true,
			alpha: 50,
		},
	},
	tooltip: {
		pointFormat: '{point.name}: <b>{point.percentage:.2f}%</b> {point.y}',
	},
	legend: {
		y: 20,
		itemStyle: {
			color: 'rgba(239,244,255,0.8)', // 设置图例文本颜色为红色
			fontSize: 14,
		},
	},
	series: [],
};
// 不同用水类型水费金额柱状图
export const analysisOption1 = {
	title: {
		text: '不同用水类型水费金额柱状图',
		top: 5,
		left: 'center',
		textStyle: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	grid: {
		left: 20,
		right: 20,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	yAxis: [
		{
			name: '万元',
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: ['#999'],
					type: 'dashed',
				},
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
		},
	],
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['水费金额'],
	},
	series: [
		{
			name: '水费金额',
			type: 'bar',
			barWidth: 30,
			itemStyle: {
				color: '#3AACFF',
				// color: new graphic.LinearGradient(0, 0, 0, 1, [
				// 	{ offset: 0, color: 'rgba(59,255,255,1)' },
				// 	{ offset: 1, color: 'rgba(62,151,255,0.35)' },
				// ]),
			},
			data: [],
		},
	],
};
// 不同用水类型占比
export const analysisOption2 = {
	...baseHeightChartOpt,
	title: {
		text: '不同用水类型占比',
		y: 10,
		style: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	plotOptions: {
		pie: {
			showInLegend: true,
			innerSize: 130,
			depth: 25,
			cursor: 'pointer',
			dataLabels: [
				{
					enabled: true,
					connectorShape: 'straight',
					connectorWidth: 1,
					// distance: 12,
					format: '{point.percentage:.2f}%',
					// format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					style: {
						color: 'rgba(239,244,255,0.8)',
						fontSize: 14,
					},
				},
				// {
				// 	enabled: true,
				// 	distance: '-30%',
				// 	format: '{y} 元',
				// 	style: {
				// 		color: 'rgba(239,244,255,0.8)',
				// 		fontSize: 14,
				// 	},
				// },
			],
		},
	},
	series: [
		{
			data: [],
		},
	],
};
// 不同收费方式占比
export const chargeOption1 = {
	...baseHeightChartOpt,
	title: {
		text: '不同收费方式占比',
		y: 10,
		style: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	plotOptions: {
		pie: {
			showInLegend: true,
			innerSize: 130,
			depth: 25,
			cursor: 'pointer',
			dataLabels: [
				{
					enabled: true,
					connectorShape: 'straight',
					connectorWidth: 1,
					distance: 12,
					format: '{point.percentage:.2f}%',
					style: {
						color: 'rgba(239,244,255,0.8)',
						fontSize: 14,
					},
				},
				// {
				// 	enabled: true,
				// 	distance: '-30%',
				// 	format: '{y} 元',
				// 	style: {
				// 		color: 'rgba(239,244,255,0.8)',
				// 		fontSize: 14,
				// 	},
				// },
			],
		},
	},
	series: [
		{
			data: [
				// { name: '', y: 0 },
				// {
				// 	name: '水资源费',
				// 	y: 9,
				// },
				// {
				// 	name: '电费',
				// 	y: 13,
				// },
				// {
				// 	name: '药剂费',
				// 	y: 6,
				// },
				// {
				// 	name: '人工成本',
				// 	y: 4,
				// },
				// {
				// 	name: '折旧费',
				// 	y: 16,
				// },
			],
		},
	],
};
// 不同机构收费占比
export const chargeOption2 = {
	...baseHeightChartOpt,
	title: {
		text: '不同机构收费占比',
		y: 10,
		style: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	plotOptions: {
		pie: {
			showInLegend: true,
			innerSize: 130,
			depth: 25,
			cursor: 'pointer',
			dataLabels: [
				{
					enabled: true,
					connectorShape: 'straight',
					connectorWidth: 1,
					distance: 12,
					format: '{point.percentage:.2f}%',
					style: {
						color: 'rgba(239,244,255,0.8)',
						fontSize: 14,
					},
				},
				// {
				// 	enabled: true,
				// 	distance: '-30%',
				// 	format: '{y} 元',
				// 	style: {
				// 		color: 'rgba(239,244,255,0.8)',
				// 		fontSize: 14,
				// 	},
				// },
			],
		},
	},
	series: [
		{
			data: [
				// { name: '', y: 0 },
				// {
				// 	name: '自来水公司',
				// 	y: 9,
				// },
				// {
				// 	name: '物资站',
				// 	y: 13,
				// },
			],
		},
	],
};
// 收费统计
export const statisticsOption = {
	title: {
		text: '月度实收水费分析',
		top: 10,
		left: 'center',
		textStyle: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	grid: {
		left: 20,
		right: 20,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	yAxis: [
		{
			name: '万元',
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: ['#999'],
					type: 'dashed',
				},
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
		},
	],
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['收费金额'],
	},
	series: [
		{
			name: '收费金额',
			type: 'bar',
			barWidth: 30,
			itemStyle: {
				color: new graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: 'rgba(59,255,255,1)' },
					{ offset: 1, color: 'rgba(62,151,255,0.35)' },
				]),
			},
			data: [],
		},
	],
};
// 1-5月制水成本占比  总费用  2343.78万元
const nowMonth = new Date().getMonth() + 1;
export const costPieOption = {
	title: {
		text: '1-' + nowMonth + '月制水成本占比',
		top: 0,
		left: 'center',
		textStyle: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
		subtext: '{label|总费用}\n{value|--万元}',
		subtextStyle: {
			align: 'center',
			verticalAlign: 'middle',
			rich: {
				label: {
					padding: [100, 0, 10, 0],
					color: 'rgba(239,244,255,0.8)',
					fontSize: 18,
				},
				value: {
					fontSize: 20,
					color: 'rgba(239,244,255,1)',
				},
			},
		},
	},
	tooltip: {
		trigger: 'item',
		formatter: '{b}: <b>{d}%</b> {c}',
	},
	grid: {
		top: 20,
		left: 25,
		right: 40,
		bottom: 30,
		containLabel: true,
	},
	legend: {
		left: 'center',
		bottom: 0,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
	},
	series: [
		{
			name: 'Access From',
			type: 'pie',
			radius: ['40%', '55%'],
			avoidLabelOverlap: false,
			label: {
				show: true,
				color: 'rgba(239,244,255,0.8)',
				fontSize: 14,
				formatter: '{d}%',
			},
			itemStyle: {
				borderRadius: 4,
				borderColor: 'transparent',
				borderWidth: 2,
			},
			labelLine: {
				show: true,
			},
			data: [
				// { value: 1048, name: '水资源费' },
				// { value: 735, name: '电费' },
				// { value: 580, name: '药剂费' },
				// { value: 484, name: '人工成本' },
				// { value: 300, name: '折旧费' },
				// { value: 240, name: '其他杂费' },
			],
		},
	],
};
// 1-5月制水费用柱状图
export const costBarOption = {
	title: {
		text: '1-' + nowMonth + '月制水费用柱状图',
		top: 10,
		left: 'center',
		textStyle: {
			color: 'rgba(239,244,255,1)',
			fontSize: 22,
		},
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	grid: {
		left: 25,
		right: 40,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'value',
			name: '万元',
			splitLine: {
				show: true,
				lineStyle: {
					color: ['#999'],
					type: 'dashed',
				},
			},
			axisLine: {
				show: false,
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
		},
	],
	yAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['收费金额'],
	},
	series: [
		{
			name: '收费金额',
			type: 'bar',
			barWidth: 10,
			itemStyle: {
				color: new graphic.LinearGradient(1, 0, 0, 0, [
					{ offset: 0, color: 'rgba(255,208,59,1)' },
					{ offset: 1, color: 'rgba(255,109,62,0.35)' },
				]),
			},
			data: [],
		},
	],
};
// 大用水户监控
export const monitorOption1 = {
	color: ['#1FC3C7', ...color],
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['用户名称'],
	},
	grid: {
		left: 20,
		right: 20,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	yAxis: {
		type: 'value',
		splitLine: {
			show: true,
			lineStyle: {
				color: ['#999'],
				type: 'dashed',
			},
		},
		axisLine: {
			show: true,
			lineStyle: {
				color: 'rgba(239,244,255,0.8)',
				width: 1.5,
			},
		},
		axisLabel: {
			fontSize: 14,
		},
	},
	series: [
		{
			name: '用户名称',
			type: 'line',
			data: [],
		},
	],
};
// 异常用户监控
export const monitorOption2 = {
	color: ['#1FC3C7', ...color],
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		bottom: 12,
		textStyle: {
			color: 'rgba(239,244,255,0.8)',
			fontSize: 14,
		},
		data: ['用户名称'],
	},
	grid: {
		left: 20,
		right: 20,
		bottom: 55,
		containLabel: true,
	},
	xAxis: [
		{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: 'rgba(239,244,255,0.8)',
					width: 1.5,
				},
			},
			axisLabel: {
				fontSize: 14,
			},
			data: [],
		},
	],
	yAxis: {
		type: 'value',
		splitLine: {
			show: true,
			lineStyle: {
				color: ['#999'],
				type: 'dashed',
			},
		},
		axisLine: {
			show: true,
			lineStyle: {
				color: 'rgba(239,244,255,0.8)',
				width: 1.5,
			},
		},
		axisLabel: {
			fontSize: 14,
		},
	},
	series: [
		{
			name: '用户名称',
			type: 'line',
			data: [],
		},
	],
};
