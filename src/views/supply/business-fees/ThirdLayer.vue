<script setup>
import BasePanel from '@/views/supply/components/BasePanel.vue';
import NullImg from '@/assets/img/modify/null.png';
import TimeSelect from '@/views/supply/components/TimeSelect.vue';
import {
	getBigWaterUserMonitor,
	getExceptionWaterUserMonitor,
	getUserWaterUseStatistics,
} from '@/api/business/supply/business-fees.js';
import { monitorOption1, monitorOption2 } from './config';
import { nextTick, onUnmounted } from 'vue';
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

const info = reactive({
	splideList1: [],
	splideList2: [],
	monitorOption1,
	monitorOption2,
	selectCode: '',
	timeList: [
		{ name: '长期欠费用户', code: 'arrearage' },
		{ name: '零水量用户', code: 'zeroUse' },
		{ name: '水量异常用户', code: 'userWaterException' },
	],
	waterUsage: '--',
	waterUsageRatio: '--',
});
// 大用水户监控
const getBigWaterUserMonitorData = async () => {
	const res = await getBigWaterUserMonitor();
	info.waterUsage = res.totalUse;
	info.waterUsageRatio = res.ratio;
	info.splideList1 = res.bigWaterUserList;
	handleRowClick1(info.splideList1[0]);
};
let currentRow1 = ref({});
const handleRowClick1 = async (item) => {
	currentRow1.value = item;
	if (item && item.waterUserId) {
		const res = await getUserWaterUseStatistics(item.waterUserId);
		info.monitorOption1.legend.data[0] = item.name;
		info.monitorOption1.series[0].name = item.name;
		info.monitorOption1.xAxis[0].data = res.map((i) => i.times) || [];
		info.monitorOption1.series[0].data = res.map((i) => Number(i.counts)) || [];
	}
};
const handleRowStyle1 = ({ row, rowIndex }) => {
	if (currentRow1.value && currentRow1.value.waterUserId === row.waterUserId) {
		return {
			background: 'rgb(116 214 231 / 30%) !important',
			cursor: 'pointer',
		};
	}
	return { cursor: 'pointer' };
};
// 异常用户监控
const getExceptionWaterUserMonitorData = async () => {
	const res = await getExceptionWaterUserMonitor();
	info.timeList = [
		{
			name: '长期欠费用户（' + res.arrearageTotal + '）',
			code: 'arrearage',
			list: res.arrearageList,
		},
		{
			name: '零水量用户（' + res.zeroUseTotal + '）',
			code: 'zeroUse',
			list: res.zeroUseList,
		},
		{
			name: '水量异常用户（' + res.userWaterExcepionTotal + '）',
			code: 'userWaterException',
			list: res.userWaterExceptionList,
		},
	];
	info.splideList2 = [...res.arrearageList, ...res.zeroUseList, ...res.userWaterExceptionList];
	//   info.timeList.find((i) => i.code === info.selectCode).list || [];
	// handleRowClick2(info.splideList2[0]);
};
let currentRow2 = ref({});
const handleRowClick2 = async (item) => {
	currentRow2.value = item;
	if (item && item.waterUserId) {
		const res = await getUserWaterUseStatistics(item.waterUserId);
		info.monitorOption2.legend.data[0] = item.name;
		info.monitorOption2.series[0].name = item.name;
		info.monitorOption2.xAxis[0].data = res.map((i) => i.times) || [];
		info.monitorOption2.series[0].data = res.map((i) => Number(i.counts)) || [];
	}
};
const handleRowStyle2 = ({ row, rowIndex }) => {
	if (currentRow2.value.waterUserId === row.waterUserId) {
		return {
			background: 'rgb(116 214 231 / 30%) !important',
			cursor: 'pointer',
		};
	}
	return { cursor: 'pointer' };
};
const tabLick = (selectCode) => {
	info.splideList2 = [];
	nextTick(() => {
		info.selectCode = selectCode;
		info.splideList2 = info.timeList.find((i) => i.code === info.selectCode).list || [];
		handleRowClick2(info.splideList2[0]);
	});
};

onMounted(() => {
	getBigWaterUserMonitorData();
	getExceptionWaterUserMonitorData();
});
onUnmounted(() => {});
</script>

<template>
	<div class="layer third-layer">
		<BasePanel class="layer-box">
			<template v-slot:headerLeft>
				大用水户监控
				<p class="box-tip">
					<span class="tip-item">大用水户用水水量：{{ info.waterUsage }}万m³</span>
					<span class="tip-item">大用户用水占比：{{ info.waterUsageRatio }}%</span>
				</p>
			</template>
			<div class="monitor">
				<div class="table-container">
					<el-table :data="info.splideList1" class="top">
						<el-table-column prop="name" label="用户名称" />
						<el-table-column prop="address" label="用户地址" />
						<el-table-column prop="useWater" label="用水量(m³)" />
						<el-table-column prop="month" label="用水月份" />
						<el-table-column prop="waterUseCategory" label="用水性质" />
						<el-table-column prop="rank" label="用水排名" />
					</el-table>
					<div class="con">
						<Vue3SeamlessScroll
							class="seamless-warp"
							:list="info.splideList1"
							:hover="true"
							:limitScrollNum="5"
							:copyNum="1"
							:wheel="true"
							:step="0.5"
							v-if="info.splideList1.length"
						>
							<el-table
								:data="info.splideList1"
								stripe
								height="100%"
								:show-header="false"
								:row-style="handleRowStyle1"
								@row-click="handleRowClick1"
								class="bottom"
							>
								<el-table-column prop="name" label="用户名称" />
								<el-table-column prop="address" label="用户地址" />
								<el-table-column prop="useWater" label="用水量(m³)" />
								<el-table-column prop="month" label="用水月份" />
								<el-table-column prop="waterUseCategory" label="用水性质" />
								<el-table-column prop="rank" label="用水排名" />
							</el-table>
						</Vue3SeamlessScroll>
						<div v-else class="empty-tips">
							<img class="null-img" :src="NullImg" alt="" />
							暂无数据
						</div>
					</div>
				</div>
				<EChart id="monitor-bar-chart1" class="echart" :option="info.monitorOption1"></EChart>
			</div>
		</BasePanel>
		<BasePanel class="layer-box">
			<template v-slot:headerLeft> 异常用户监控 </template>
			<template v-slot:headerRight>
				<TimeSelect
					class="box-time"
					:selection="info.selectCode"
					:timeList="info.timeList"
					@time-change="tabLick"
				></TimeSelect>
			</template>
			<div class="monitor">
				<div class="table-container">
					<el-table :data="info.splideList2" class="top">
						<el-table-column type="index" label="序号" width="80" />
						<el-table-column prop="name" label="用户名称" width="120" />
						<el-table-column prop="address" label="用户地址" width="120" />
						<el-table-column prop="useWater" label="用水量(m³)" width="125" />
						<el-table-column prop="times" label="日期" width="170" />
						<el-table-column prop="waterUseCategory" label="用水性质" width="110" />
						<el-table-column prop="exceptionType" label="异常类型" width="110" />
					</el-table>
					<div class="con">
						<Vue3SeamlessScroll
							class="seamless-warp"
							:list="info.splideList2"
							:hover="true"
							:limitScrollNum="5"
							:copyNum="1"
							:wheel="true"
							:step="0.5"
							v-if="info.splideList2.length"
						>
							<el-table
								:data="info.splideList2"
								stripe
								height="100%"
								:show-header="false"
								:row-style="handleRowStyle2"
								@row-click="handleRowClick2"
								class="bottom"
							>
								<el-table-column type="index" label="序号" width="80" />
								<el-table-column prop="name" label="用户名称" width="120" />
								<el-table-column prop="address" label="用户地址" width="120" />
								<el-table-column prop="useWater" label="用水量(m³)" width="125" />
								<el-table-column prop="times" label="日期" width="170" />
								<el-table-column prop="waterUseCategory" label="用水性质" width="110" />
								<el-table-column prop="exceptionType" label="异常类型" width="110" />
							</el-table>
						</Vue3SeamlessScroll>
						<div v-else class="empty-tips">
							<img class="null-img" :src="NullImg" alt="" />
							暂无数据
						</div>
					</div>
				</div>
				<EChart id="monitor-bar-chart2" class="echart" :option="info.monitorOption2"></EChart>
			</div>
		</BasePanel>
	</div>
</template>

<style lang="less" scoped>
.third-layer {
	.echart {
		width: 100%;
		height: 100%;
	}
	.layer-box {
		width: calc(50% - 10px) !important;
		.box-time {
			justify-content: flex-start;
		}
		.box-tip {
			position: absolute;
			letter-spacing: 1px;
			top: 16px;
			left: 300px;
			font-size: 20px;
			color: #15f1ff;
			.tip-item {
				margin-right: 30px;
			}
		}
	}
	.monitor {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		.echart {
			width: 35%;
			height: 100%;
		}
		.table-container {
			height: 100%;
			width: 65%;
			overflow: hidden;
			position: relative;
			::v-deep(.top) {
				.el-table__body-wrapper {
					display: none;
				}
			}
			.con {
				height: calc('100% - 57px');
			}
			.seamless-warp {
				height: 100%;
				overflow: hidden;
			}
			::v-deep(.el-table) .el-table__body .red td.el-table__cell {
				color: @red-color!important;
			}
			.empty-tips {
				height: 100%;
				margin-top: 40px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				.null-img {
					width: 80px;
					height: 80px;
				}
			}
		}
		.monitor-table {
			cursor: pointer;
		}
	}
}
</style>
