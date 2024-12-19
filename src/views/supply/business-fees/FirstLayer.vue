<script setup>
import BaseData from './components/BaseData.vue';
import BasePanel from '@/views/supply/components/BasePanel.vue';
import { getSaleWaterTrend, getUseWaterAnalysis } from '@/api/business/supply/business-fees.js';
import dayjs from 'dayjs';
const startTime = new Date(new Date().getFullYear(), 0, 1);
const endTime = new Date();
const trendsMonth = ref([startTime, endTime]);
const analysisMonth = ref([startTime, endTime]);

import { trendsOption, analysisOption1, analysisOption2 } from './config';
import { onMounted, reactive } from 'vue';

const waterOption = reactive({
	option0: trendsOption,
	option1: analysisOption1,
	option2: analysisOption2,
});
const getSaleWaterTrendData = async () => {
	let startTime = dayjs(trendsMonth.value[0]).format('YYYY-MM');
	let endTime = dayjs(trendsMonth.value[1]).format('YYYY-MM');
	const res = await getSaleWaterTrend(startTime, endTime);
	waterOption.option0.xAxis[0].data = res.map((i) => i.times);
	waterOption.option0.series = [
		{
			name: '供水量',
			type: 'line',
			data: res.map((i) => Number(i.waterSupply)),
		},
		{
			name: '用水量',
			type: 'line',
			data: res.map((i) => Number(i.waterSale)),
		},
		{
			name: '产销差率',
			type: 'line',
			data: res.map((i) => Number(i.proMarkDiffRate)),
		},
	];
};

const getUseWaterAnalysisData = async () => {
	let startTime = dayjs(analysisMonth.value[0]).format('YYYY-MM');
	let endTime = dayjs(analysisMonth.value[1]).format('YYYY-MM');
	const res = await getUseWaterAnalysis(startTime, endTime);
	waterOption.option1.xAxis[0].data = res.useWaterFeeList.map((i) => i.typeName) || [];
	waterOption.option1.series[0].data = res.useWaterFeeList.map((i) => i.counts) || [];
	waterOption.option2.series[0].data =
		res.useWaterList.map((i) => {
			return {
				name: i.typeName,
				y: Number(i.counts),
			};
		}) || [];
};

const changeTrendDate = () => {
	getSaleWaterTrendData();
};

const changeAnalysisDate = () => {
	getUseWaterAnalysisData();
};

onMounted(() => {
	getSaleWaterTrendData();
	getUseWaterAnalysisData();
});
</script>

<template>
	<div class="layer first-layer">
		<BaseData class="layer-box"></BaseData>
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>供售水分析</template>
			<template v-slot:headerRight>
				<el-date-picker
					v-model="trendsMonth"
					type="monthrange"
					placeholder="选择月份"
					:clearable="false"
					style="width: 250px"
					@change="changeTrendDate"
				>
				</el-date-picker>
			</template>
			<EChart id="trends-chart" class="echart" :option="waterOption.option0"></EChart>
		</BasePanel>
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>用水分析</template>
			<template v-slot:headerRight>
				<el-date-picker
					v-model="analysisMonth"
					type="monthrange"
					placeholder="选择月份"
					format="YYYY-MM"
					:clearable="false"
					style="width: 250px"
					@change="changeAnalysisDate"
				>
				</el-date-picker>
			</template>
			<div class="analysis">
				<EChart id="analysis-chart1" class="echart" :option="waterOption.option1"></EChart>
				<HeightChart3D
					id="analysis-chart2"
					class="echart analysis-chart"
					:option="waterOption.option2"
				></HeightChart3D>
			</div>
		</BasePanel>
	</div>
</template>

<style lang="less" scoped>
.first-layer {
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
		background-position: 50% 78%; /* 将背景图片居中 */
	}
}

</style>
