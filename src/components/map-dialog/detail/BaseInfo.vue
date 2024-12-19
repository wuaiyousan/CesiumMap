<template>
	<div class="baseInfo" v-if="baseData.deviceCode">
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">测站编码</div>
			<div class="txt">{{ stationData.deviceCode || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">测站名称</div>
			<div class="txt">{{ stationData.deviceName || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">行政区划</div>
			<div class="txt">{{ stationData.regionName || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">关联对象</div>
			<div class="txt">{{ stationData.facilityName || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">经度</div>
			<div class="txt">
				{{ geometry && geometry.coordinates ? geometry.coordinates[0] : '--' }}
			</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">纬度</div>
			<div class="txt">
				{{ geometry && geometry.coordinates ? geometry.coordinates[1] : '--' }}
			</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">建设日期</div>
			<div class="txt">{{ stationData.installationDate || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '50%' }">
			<div class="lbl">建设单位</div>
			<div class="txt">{{ stationData.manufacturer || '--' }}</div>
		</div>
		<div class="descrip-item" :style="{ width: '100%' }">
			<div class="lbl-pic">现场照片</div>
			<div class="pic">
				<el-image
					v-for="(item, index) in stationData.images"
					:key="index"
					style="width: 100px; height: 140px; margin-right: 10px"
					:src="item.url"
				></el-image>
			</div>
		</div>
		<div class="descrip-item" :style="{ width: '100%' }">
			<div class="lbl">站址</div>
			<div class="txt">{{ stationData.address }}</div>
		</div>
		<template v-if="stationData.attributes">
			<div
				class="descrip-item"
				v-for="item in stationData.attributes"
				:key="item.attributeKey"
				:style="{ width: '50%' }"
			>
				<div class="lbl">{{ item.attributeName || '--' }}</div>
				<div class="txt">{{ item.attributeValue || '--' }}</div>
			</div>
		</template>
	</div>
	<div class="baseInfo" v-else>
		<div
			class="descrip-item"
			v-for="(item, index) in facilityAttribute"
			:key="index"
			:style="{ width: '50%' }"
		>
			<div class="lbl">{{ item.attributeName }}</div>
			<div class="txt">{{ item.attributeValue || '--' }}</div>
		</div>
	</div>
</template>

<script>
import { getAttributeByCode, getMetadataByDeviceCode } from '@/api/map/monitor.js';
export default {
	name: 'BaseInfo',
	props: {
		baseData: {
			type: Object,
			default: function () {
				return {};
			},
		},
	},
	data() {
		return {
			stationData: {},
			geometry: {},
			facilityAttribute: [],
			attributes: [],
		};
	},
	methods: {
		getData() {
			if (this.baseData.deviceCode) {
				getMetadataByDeviceCode(this.baseData.deviceCode).then((res) => {
					this.stationData = res.properties;
					this.stationData.images = this.stationData.images
						? JSON.parse(this.stationData.images)
						: [];
					this.geometry = res.geometry;
					console.log(this.stationData, this.geometry, 'this.stationData');
				});
			} else if (this.baseData.facilityCode) {
				getAttributeByCode(this.baseData.facilityCode).then((res) => {
					this.facilityAttribute = res;
				});
			}
		},
	},
	mounted() {
		this.getData();
	},
};
</script>

<style lang="less" scoped>
.baseInfo {
	position: relative;
	// width: 100%;
	height: 100%;
	overflow-y: auto;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	border: 1px solid #1677ee;
	margin: 0 160px;
	.descrip-item {
		display: flex;
		border-bottom: 1px solid #1677ee;
		align-items: center;
		// border-right: 1px solid #f0f0f0;
		.lbl {
			width: 140px;
			background: rgba(22, 119, 255, 0.4);
			// display: inline-block;
			font-size: 14px;
			font-weight: 400;
			padding: 0 20px;
			color: #b7f1ff;
			display: flex;
			height: 100%;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
		}
		.lbl-pic {
			width: 140px;
			background: rgba(22, 119, 255, 0.4);
			display: inline-block;
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			color: #b7f1ff;
			line-height: 140px;
			padding-left: 25px;
			box-sizing: border-box;
		}
		.txt {
			height: 45px;
			line-height: 45px;
			padding-left: 25px;
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: left;
			color: #0a84ff;
			background: rgba(22, 119, 255, 0.2);
			box-sizing: border-box;
			display: inline-block;
			flex: 1;
		}
		.pic {
			width: 100%;
			height: 100%;
			padding-left: 25px;
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: left;
			color: #0a84ff;
			background: rgba(22, 119, 255, 0.2);
			box-sizing: border-box;
			display: inline-block;
			flex: 1;
		}
	}
}
</style>
