import { graphic } from 'echarts';
// 柱状图
const barOption = {
	grid: {
		height: 83,
		top: 20,
	},
	xAxis: {
		type: 'category',
		data: ['5月11', '5月12', '5月13', '5月14', '5月15', '5月16', '5月17', '5月18'],
		axisTick: {
			show: false,
		},
		axisLabel: {
			fontSize: 10,
			color: 'rgba(255, 255, 255, 0.6)',
		},
		axisLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
	},
	yAxis: {
		type: 'value',
		min: 0,
		splitLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
		axisLabel: {
			fontSize: 10,
			color: 'rgba(255, 255, 255, 0.6)',
		},
	},
	series: [
		{
			type: 'bar',
			barWidth: '10',
			itemStyle: {
				// color: linear-gradient(0deg,rgba(13,44,58,0.50), #00e3fa 95%),
				color: new graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: '#00e3fa' },
					{ offset: 1, color: 'rgba(13, 44, 58, 0.5)' },
				]),
			},
			data: [2560, 4100, 3200, 2100, 3700, 4480, 2400, 3450],
		},
	],
};
// 柱状折线图
const barLineOption = {
	grid: {
		height: '70%',
		with: '80%',
		top: 40,
		left: '12%',
	},
	xAxis: {
		type: 'category',
		data: ['x镇', 'x镇', 'x镇', 'x镇', 'x镇', 'x镇', 'x镇', 'x镇'],
		axisTick: {
			show: false,
		},
		axisLabel: {
			fontSize: 13,
			color: 'rgba(255, 255, 255, 0.6)',
		},
		axisLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
	},
	yAxis: [
		{
			name: '单位(次)',
			type: 'value',
			nameTextStyle: {
				align: 'right',
				color: '#999',
			},
			min: 0,
			splitLine: {
				lineStyle: {
					color: '#0a4665',
				},
			},
			axisLabel: {
				fontSize: 10,
				color: 'rgba(255, 255, 255, 0.6)',
			},
		},
		{
			name: '100%',
			nameTextStyle: {
				color: '#999',
			},
			type: 'value',
			min: 0,
			alignTicks: true,
			splitLine: {
				lineStyle: {
					color: '#0a4665',
				},
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#0a4665',
				},
			},
			axisLabel: {
				formatter: '',
			},
		},
	],
	series: [
		{
			name: 'barChart',
			type: 'bar',
			barWidth: '10',
			itemStyle: {
				// color: linear-gradient(0deg,rgba(13,44,58,0.50), #00e3fa 95%),
				color: new graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: '#00e3fa' },
					{ offset: 1, color: 'rgba(13, 44, 58, 0.5)' },
				]),
			},
			data: [2560, 4100, 3200, 2100, 3700, 4480, 2400, 3450],
		},
		{
			name: 'lineChart',
			type: 'line',
			yAxisIndex: 1,
			itemStyle: {
				color: '#FF6A29',
			},
			lineStyle: {
				color: '#FF6A29',
			},
			data: [2300, 3900, 3200, 4100, 2900, 1900, 3600, 4200],
		},
	],
};
// 饼图
const pieOption = {
	title: {
		text: '{a|11}{b|万亩}',
		textStyle: {
			rich: {
				a: {
					color: '#B7F1FF',
					fontSize: 23,
				},
				b: {
					fontSize: '12px',
					color: '#eee',
				},
			},
		},
		top: 'center',
		left: 170,
	},
	tooltip: {
		trigger: 'item',
	},
	legend: {
		orient: 'vertical',
		left: 'right',
		align: 'left',
		textStyle: {
			color: '#fff',
			fontSize: '12px',
			fontWeight: 300,
		},
		icon: 'circle',
		itemWidth: 12,
	},
	series: [
		{
			type: 'pie',
			radius: ['40%', '70%'],
			data: [
				{ value: 1048, name: '项目1' },
				{ value: 735, name: '项目2' },
				{ value: 580, name: '项目3' },
				{ value: 484, name: '项目4' },
				{ value: 300, name: '项目5' },
				{ value: 200, name: '项目6' },
				{ value: 280, name: '项目7' },
			],
			label: {
				formatter: '{d}%',
				color: '#B7F1FF',
				fontSize: 16,
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
	],
};
// 饼图折线图
const PieLineOptions = {
	title: {
		text: '{a|120}{b|个}',
		textStyle: {
			rich: {
				a: {
					fontSize: '22px',
					color: '#B7F1FF',
				},
				b: {
					fontSize: '12px',
					color: '#eee',
				},
			},
		},
		top: '21%',
		left: '44%',
	},
	grid: {
		top: '50%',
		left: '12%',
		height: 110,
		with: 425,
	},
	xAxis: {
		type: 'category',
		data: ['5.11', '5.12', '5.13', '5.14', '5.15', '5.16'],
		axisTick: {
			show: false,
		},
		axisLabel: {
			fontSize: 11,
			color: 'rgba(255, 255, 255, 0.6)',
		},
		axisLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
	},
	yAxis: {
		nameTextStyle: {
			color: '#999',
		},
		type: 'value',
		min: 0,
		splitLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
		axisLine: {
			lineStyle: {
				color: '#0a4665',
			},
		},
		axisLabel: {
			fontSize: 11,
			color: 'rgba(255, 255, 255, 0.6)',
		},
	},
	series: [
		{
			name: 'lineChart',
			type: 'line',
			itemStyle: {
				color: '#61DCFF',
			},
			lineStyle: {
				color: '#61DCFF',
			},
			data: [23, 39, 32, 48, 29, 19],
		},
		{
			type: 'pie',
			radius: ['22%', '36%'],
			center: ['50%', '25%'],
			label: {
				formatter: (params) => {
					const { percent, name } = params;
					return '{value|' + percent + '}{percent|%}\n{label|' + name + '}';
				},
				rich: {
					value: {
						color: '#00E8FF',
						fontSize: '19px',
					},
					percent: {
						color: '#00E8FF',
						fontSize: '12px',
					},
					label: {
						color: '#B7F1FF',
						fontSize: '12px',
					},
				},
			},
			itemStyle: {
				borderColor: '#0f1f2e',
				borderWidth: 4,
			},
			data: [
				{
					value: 90,
					name: '在线设备',
					itemStyle: {
						color: new graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#0a73ff' },
							{ offset: 1, color: '#2024ca' },
						]),
					},
				},
				{
					value: 30,
					name: '离线设备',
					itemStyle: {
						color: new graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#5ff3d9' },
							{ offset: 1, color: '#00a583' },
						]),
					},
				},
			],
		},
	],
};
// 3D饼图
const Pie3DOption = {
	chart: {
		type: 'pie',
		backgroundColor: 'rgba(0,0,0,0)',
		height: 130,
		marginBottom: 0,
		marginTop: 0,
		options3d: {
			enabled: true,
			alpha: 45,
			beta: 0,
		},
	},
	credits: {
		enabled: false,
	},
	title: { text: '' },
	tooltip: {
		enabled: false,
	},
	legend: {
		align: 'right',
		verticalAlign: 'top',
		layout: 'vertical',
		x: 10,
		y: 0,
		itemMarginTop: 2,
		itemMarginBottom: 2,
		itemStyle: {
			color: '#fff',
			fontSize: '10px',
			fontWeight: 300,
		},
		itemHoverStyle: {
			color: '#B7F1FF',
			fontSize: '10px',
			fontWeight: 300,
		},
	},
	plotOptions: {
		pie: {
			showInLegend: true,
			cursor: 'pointer',
			depth: 12,
			size: 90,
			startAngle: 90,
			dataLabels: {
				enabled: true,
				crookDistance: '10%', // 转折线长度
				format: '{point.name}<br>{point.y}',
				style: {
					color: '#B7F1FF',
					fontSize: '10px',
				},
				connectorShape: function (labelPosition, connectorPosition, options) {
					var touchingSliceAt = connectorPosition.touchingSliceAt,
						alignment = labelPosition.alignment,
						left = 0,
						right = 0;
					if (alignment == 'left') {
						left = labelPosition.x + this.dataLabel.bBox.width - 36;
						right = labelPosition.x - 16;
					} else {
						left = labelPosition.x - this.dataLabel.bBox.width + 36;
						right = labelPosition.x + 16;
					}
					return ['M', left, labelPosition.y, 'L', right, labelPosition.y, 'L', touchingSliceAt.x, touchingSliceAt.y];
				},
			},
		},
	},
	series: [
		{
			type: 'pie',
			color: ['#5AD8A6', '#F6BD16', '#6DC8EC', '#5B8FF9', '#5D7092'],
			data: [
				{
					name: '热线事件',
					y: 136,
					color: '#5AD8A6',
				},
				{
					name: '巡检事件',
					y: 126,
					color: '#F6BD16',
				},
				{
					name: '防汛事件',
					y: 64,
					color: '#6DC8EC',
				},
				{
					name: '灌区事件',
					y: 129,
					color: '#5B8FF9',
				},
				{
					name: '供水事件',
					y: 88,
					color: '#5D7092',
				},
			],
		},
	],
};
