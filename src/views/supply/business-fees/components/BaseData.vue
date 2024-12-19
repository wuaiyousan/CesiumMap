<script setup>
import TimeSelect from '@/views/supply/components/TimeSelect.vue';
import BasePanel from '@/views/supply/components/BasePanel.vue';
import YesterdayImg from '@/assets/img/business-fees/yesterday.png';
import MonthImg from '@/assets/img/business-fees/month.png';
import YearImg from '@/assets/img/business-fees/year.png';
import RiseImg from '@/assets/img/business-fees/rise.png';
import DeclineImg from '@/assets/img/business-fees/decline.png';
let info = reactive({
	type: 'month',
	timeList: [
		{ name: '本月', code: 'month' },
		{ name: '本年', code: 'year' },
	],
});
const tabLick = (type) => {
	info.type = type;
	getBaseChargeData();
};

const baseData = reactive({
	waterUse: [
		{
			imgUrl: YesterdayImg,
			label: '昨日用水量',
			value: '',
			unit: '万m³',
			YOY: '',
			QOQ: '',
		},
		{
			imgUrl: MonthImg,
			label: '本月用水量',
			value: '',
			unit: '万m³',
			YOY: '',
			QOQ: '',
		},
	],
	waterCharge: [
		{
			title: '本月应收',
			label: '水费金额',
			value: '',
			unit: '万元',
		},
		{
			title: '本月实收',
			label: '收费金额',
			value: '',
			unit: '万元',
		},
		{
			title: '本月预存',
			label: '水费金额',
			value: '',
			unit: '万元',
		},
		{
			title: '本月水费',
			label: '回收率',
			value: '',
			unit: '%',
		},
	],
});

import { getBaseCharge } from '@/api/business/supply/business-fees.js';
const getBaseChargeData = async () => {
	const res = await getBaseCharge(info.type);
	const date = info.timeList.find((i) => i.code === info.type).name;
	baseData.waterUse = [
		{
			imgUrl: YesterdayImg,
			label: '昨日用水量',
			value: res.useWaterYesterday || '--',
			unit: '万m³',
			YOY: Number(res.useWaterYesterdayYoY) || '--',
			QOQ: Number(res.useWaterYesterdayQoQ) || '--',
			YOYImg: Number(res.useWaterYesterdayYoY) >= 0 ? RiseImg : DeclineImg,
			QOQImg: Number(res.useWaterYesterdayQoQ) >= 0 ? RiseImg : DeclineImg,
			YOYClass: Number(res.useWaterYesterdayYoY) >= 0 ? 'rate-value1' : 'rate-value2',
			QOQClass: Number(res.useWaterYesterdayQoQ) >= 0 ? 'rate-value1' : 'rate-value2',
		},
		{
			imgUrl: info.type === 'month' ? MonthImg : YearImg,
			label: date + '用水量',
			value: res.useWaterTotal || '--',
			unit: '万m³',
			YOY: Number(res.useWaterTotalYoY) || '--',
			QOQ: Number(res.useWaterTotalQoQ) || '--',
			YOYImg: Number(res.useWaterTotalYoY) >= 0 ? RiseImg : DeclineImg,
			YOYClass: Number(res.useWaterTotalYoY) >= 0 ? 'rate-value1' : 'rate-value2',
			QOQImg: Number(res.useWaterTotalQoQ) >= 0 ? RiseImg : DeclineImg,
			QOQClass: Number(res.useWaterTotalQoQ) >= 0 ? 'rate-value1' : 'rate-value2',
		},
	];
	baseData.waterCharge = [
		{
			title: date + '应收',
			label: '水费金额',
			value: res.accountDeductionTotal || '--',
			unit: '万元',
		},
		{
			title: date + '实收',
			label: '收费金额',
			value: res.accountRealTotal || '--',
			unit: '万元',
		},
		{
			title: date + '预存',
			label: '水费金额',
			value: res.accountBalanceTotal || '--',
			unit: '万元',
		},
		{
			title: date + '水费',
			label: '回收率',
			value: res.accountRealRatio || '--',
			unit: '%',
		},
	];
};
getBaseChargeData();
</script>

<template>
	<BasePanel class="base">
		<template v-slot:headerLeft>基础收费数据</template>
		<template v-slot:headerRight>
			<TimeSelect
				class="inspection-time"
				:selection="info.type"
				:timeList="info.timeList"
				@time-change="tabLick"
			></TimeSelect>
		</template>
		<div class="base-body">
			<div class="body-top">
				<div class="water-item" v-for="opt of baseData.waterUse" :key="opt.label">
					<div class="item-top">
						<img :src="opt.imgUrl" alt="" />
						<div class="top-right">
							<p class="top-right-title">{{ opt.label }}</p>
							<p class="top-right-data">
								<span class="data-value">{{ opt.value }}</span>
								<span class="data-unit">{{ opt.unit }}</span>
							</p>
						</div>
					</div>
					<div class="item-bottom">
						<span class="bottom-rate">
							<span class="rate-label">同比：</span>
							<span opt.YOY :class="opt.YOYClass">{{ opt.YOY }}%</span>
							<img :src="opt.YOYImg" alt="" />
						</span>
						<span class="bottom-rate">
							<span class="rate-label">环比：</span>
							<span :class="opt.QOQClass">{{ opt.QOQ }}%</span>
							<img :src="opt.QOQImg" alt="" />
						</span>
					</div>
				</div>
			</div>
			<div class="body-bottom">
				<div class="water-box" v-for="opt of baseData.waterCharge" :key="opt.title">
					<img src="../../../../assets//img/business-fees/bg3.png" alt="" />
					<p class="box-title">{{ opt.title }}</p>
					<p class="box-label">{{ opt.label }}</p>
					<p class="box-data">
						<span class="data-value">{{ opt.value }}</span>
						<span class="data-unit">{{ opt.unit }}</span>
					</p>
				</div>
			</div>
		</div>
	</BasePanel>
</template>

<style lang="less" scoped>
.base {
	.base-body {
		.body-top {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
		.body-bottom {
			margin-top: 20px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.water-box {
				width: 195px;
				height: 158px;
				background: linear-gradient(180deg, rgba(6, 84, 177, 0.1), rgba(29, 115, 255, 0.2) 100%);
				position: relative;
				text-align: center;
				img {
					position: absolute;
					top: 20px;
					left: 15px;
					width: 165px;
					height: 140px;
				}
				.box-title {
					color: rgba(239, 244, 255, 0.6);
					font-size: 22px;
				}
				.box-label {
					color: rgba(239, 244, 255, 0.6);
					font-size: 22px;
				}
				.box-data {
					color: #15f1ff;
					.data-value {
						font-size: 35px;
					}
					.data-unit {
						font-size: 25px;
					}
				}
			}
		}
		.water-item {
			width: 390px;
			.item-top {
				height: 113px;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-items: center;
				background: linear-gradient(180deg, rgba(6, 84, 177, 0.1), rgba(29, 115, 255, 0.2) 100%);
				img {
					width: 93px;
					height: 93px;
				}
				.top-right {
					.top-right-title {
						font-weight: 400;
						font-size: 22px;
						color: rgba(239, 244, 255, 0.6);
					}
					.data-value {
						font-size: 35px;
						color: #15f1ff;
					}
					.data-unit {
						font-size: 25px;
						color: #15f1ff;
						margin-left: 4px;
					}
				}
			}
			.item-bottom {
				height: 45px;
				background: rgba(128, 186, 255, 0.2);
				display: flex;
				padding-left: 10px;
				.bottom-rate {
					line-height: 45px;
					font-size: 22px;
					flex: 1;
					.rate-label {
						color: #eff4ff;
					}
					.rate-value1 {
						color: #ff6a3a;
					}
					.rate-value2 {
						color: #2ae8bd;
					}
					img {
						margin-left: 4px;
						width: 34px;
						height: 16px;
					}
				}
			}
		}
	}
}
</style>
