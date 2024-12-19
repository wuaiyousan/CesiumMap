<script setup>
import BasePanel from '@/views/supply/components/BasePanel.vue';
import TimeSelect from '@/views/supply/components/TimeSelect.vue';
import dayjs from 'dayjs';
import {
	getChargeType,
	getChargeStatistics,
	getWaterCostAnalysis,
} from '@/api/business/supply/business-fees.js';
import {
	chargeOption1,
	chargeOption2,
	statisticsOption,
	costPieOption,
	costBarOption,
} from './config';

const startTime = new Date(new Date().getFullYear(), 0, 1);
const endTime = new Date();
const chargeMonth = ref([startTime, endTime]);
let info = reactive({
	type: 'month',
	timeList: [
		{ name: '本月', code: 'month' },
		{ name: '本年', code: 'year' },
	],
});
const chartOption = reactive({
	chargeOption1,
	chargeOption2,
	statisticsOption,
	costPieOption,
	costBarOption,
});
// 收费性质分析
const getChargeTypeData = async () => {
	const res = await getChargeType(info.type);
	chartOption.chargeOption1.series[0].data = res.chargeTypeList.map((i) => {
		return {
			y: Number(i.counts),
			name: i.name,
		};
	});
	chartOption.chargeOption2.series[0].data = res.chargeDeptList.map((i) => {
		return {
			y: Number(i.counts),
			name: i.name,
		};
	});
};
const tabLick = (type) => {
	info.type = type;
	getChargeTypeData();
};
// 收费统计
const getChargeStatisticsData = async () => {
	let startTime = dayjs(chargeMonth.value[0]).format('YYYY-MM');
	let endTime = dayjs(chargeMonth.value[1]).format('YYYY-MM');
	const res = await getChargeStatistics(startTime, endTime);
	chartOption.statisticsOption.xAxis[0].data = res.map((i) => i.times) || [];
	chartOption.statisticsOption.series[0].data = res.map((i) => Number(i.counts)) || [];
};

const ChargeStatisticsDate = () => {
	getChargeStatisticsData();
};

// 制水成本分析
const waterCost = ref('--');
const getWaterCostAnalysisData = async () => {
	const res = await getWaterCostAnalysis();
	waterCost.value = res.waterCost;
	chartOption.costPieOption.title.subtext = '{label|总费用}\n{value|' + res.totalFee + '万元}';
	chartOption.costPieOption.series[0].data = res.proCostList.map((i) => {
		return {
			value: Number(i.costCount),
			name: i.typeName,
		};
	});
	chartOption.costBarOption.yAxis[0].data = res.proTotalList.map((i) => i.typeName);
	chartOption.costBarOption.series[0].data = res.proTotalList.map((i) => Number(i.costCount));
};

onMounted(() => {
	getChargeTypeData();
	getChargeStatisticsData();
	getWaterCostAnalysisData();
});
</script>

<template>
	<div class="layer second-layer">
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>收费性质分析</template>
			<template v-slot:headerRight>
				<TimeSelect
					class="inspection-time"
					:selection="info.type"
					:timeList="info.timeList"
					@time-change="tabLick"
				></TimeSelect>
			</template>
			<div class="analysis">
				<HeightChart3D
					id="charge-chart1"
					class="echart analysis-chart"
					:option="chartOption.chargeOption1"
				></HeightChart3D>
				<HeightChart3D
					id="charge-chart2"
					class="echart analysis-chart"
					:option="chartOption.chargeOption2"
				></HeightChart3D>
			</div>
		</BasePanel>
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>收费统计</template>
			<template v-slot:headerRight>
				<el-date-picker
					v-model="chargeMonth"
					type="monthrange"
					placeholder="选择月份"
					:clearable="false"
					style="width: 250px"
					@change="ChargeStatisticsDate"
				>
				</el-date-picker>
			</template>
			<EChart id="statistics-chart" class="echart" :option="chartOption.statisticsOption"></EChart>
		</BasePanel>
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>
				制水成本分析
				<p class="box-tip">吨水成本：{{ waterCost }}元</p>
			</template>
			<div class="analysis">
				<EChart
					id="cost-pie-chart"
					class="echart pie-chart"
					:option="chartOption.costPieOption"
				></EChart>
				<EChart
					id="cost-bar-chart"
					class="echart bar-chart"
					:option="chartOption.costBarOption"
				></EChart>
			</div>
		</BasePanel>
	</div>
</template>

<style lang="less" scoped>
.second-layer {
	.box-tip {
		position: absolute;
		letter-spacing: 1px;
		top: 16px;
		left: 280px;
		font-size: 20px;
		color: #15f1ff;
	}
	.echart {
		width: 100%;
		height: 100%;
	}
	.analysis {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		.echart {
			flex: 1;
		}
	}
	.analysis-chart {
		background: url('../../../assets/img/business-fees/bg2.png') no-repeat; /* 替换为你的图片URL */
		background-size: 70% 70%; /* 让背景图片覆盖整个容器 */
		background-position: 52% 78%; /* 将背景图片居中 */
	}
	.pie-chart {
		background: url('../../../assets/img/business-fees/bg1.png') no-repeat; /* 替换为你的图片URL */
		background-size: 60% 60%; /* 让背景图片覆盖整个容器 */
		background-position: 50% 50%; /* 将背景图片居中 */
	}
}

</style>
