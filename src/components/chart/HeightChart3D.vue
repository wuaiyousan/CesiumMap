<!--
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2023-04-23 16:01:41
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-05-08 11:09:52
 * @Description: 
-->
<script setup>
// 使用HighCharts
import HighCharts from 'highcharts';
import HighCharts3D from 'highcharts/highcharts-3d';
HighCharts3D(HighCharts);
import { ref, onMounted, computed } from 'vue';
import NullImg from '@/assets/img/modify/null.png';

const { id, width, height, option } = defineProps({
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

const chartId = id + 'heightChart';
const myChart = ref();
onMounted(() => {
	if (showChart.value) {
		myChart.value = HighCharts.chart(chartId, option);
	}
});
watch(
	() => option,
	() => {
		myChart.value = HighCharts.chart(chartId, option);
		// 更新option
		HighCharts && HighCharts.setOptions(option);
	},
	{
		deep: true,
	}
);
</script>

<template>
	<div :id="chartId" class="heightChart">
		<slot>
			<div class="empty-tips" v-show="!showChart">
				<img class="null-img" :src="NullImg" alt="" />
				暂无数据
			</div>
		</slot>
	</div>
</template>

<style lang="less" scoped>
.heightChart {
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
