<script setup>
import { computed, onMounted, watch } from 'vue';
import TimeSelect from '../components/TimeSelect.vue';
import {
	getDeviceDetail,
	getFacilityDetail,
	getInspectionRecord,
} from '@/api/business/supply/PipeOperation.js';
import dayjs from 'dayjs';
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '测站名称',
	},
	deviceType: {
		type: String,
		default: 'device', // device facility
	},
	deviceCode: {
		type: String,
		default: '',
	},
});
const emit = defineEmits(['update:visible']);

let info = reactive({
	type: 'inspectionRecord',
	typeList: [
		{ name: '巡检记录', code: 'inspectionRecord' },
		{ name: '工程属性', code: 'projectProperty' },
	],
});
const tabClick = (type) => {
	info.type = type;
	if (type === 'inspectionRecord') {
		getRecordData();
	} else {
		getDetailData();
	}
};

const visible = computed({
	get() {
		return props.visible;
	},
	set(value) {
		if (!value) {
			props.value = false;
		}
		emit('update:visible', value);
	},
});

//巡检记录
const columns = [
	{
		prop: 'reportTime',
		label: '巡检日期',
	},
	{
		prop: 'reportName',
		label: '上报人',
	},
	{
		prop: 'status',
		label: '巡检状态',
	},
	{
		prop: 'reportDesc',
		label: '描述',
	},
	{
		prop: 'fileUrl',
		label: '照片',
	},
];
const now = new Date();
const dateRange = ref([new Date(now.getFullYear(), now.getMonth(), 1), now]);
const page = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0,
});
const tableList = ref([]);
const getRecordData = async () => {
	const startTime = dayjs(dateRange.value[0]).format('YYYY-MM-DD 00:00:00');
	const endTime = dayjs(dateRange.value[0]).format('YYYY-MM-DD 23:59:59');
	const res = await getInspectionRecord({
		code: props.deviceCode,
		startTime: startTime,
		endTime: endTime,
	});
	tableList.value = res.map((i) => {
		return {
			...i,
			status: i.isFeed == 1 ? '正常' : '异常',
		};
	});
	page.total = res.length || 0;
};

//device facility 属性
const pointList = [
	{
		label: '测站编码',
		prop: 'deviceCode',
		value: '--',
	},
	{
		label: '测站名称',
		prop: 'deviceName',
		value: '--',
	},
	{
		label: '测站类型',
		prop: 'deviceTypeName',
		value: '--',
	},
	{
		label: '行政区划',
		prop: 'regionName',
		value: '--',
	},
	{
		label: '所属水利工程',
		prop: 'facilityName',
		value: '--',
	},
	// {
	// 	label: '生产日期',
	// 	prop: 'manufactureDate',
	// 	value: '--',
	// },
	// {
	// 	label: '生产商',
	// 	prop: 'manufacturer',
	// 	value: '--',
	// },
	{
		label: '站址',
		prop: 'address',
		value: '--',
	},
	// {
	// 	label: '安装日期',
	// 	prop: 'installationDate',
	// 	value: '--',
	// },
	// {
	// 	label: '关联测站',
	// 	prop: 'parentCode',
	// 	value: '--',
	// },
	{
		label: '空间信息',
		prop: 'geometry',
		value: '--',
	},
	// {
	// 	label: '数据接入配置',
	// 	prop: 'dataAccessConfiguration',
	// 	value: '--',
	// },
	// {
	// 	label: '管理单位',
	// 	prop: 'manageUnit',
	// 	value: '--',
	// },
	// {
	// 	label: '图片',
	// 	prop: 'images',
	// 	value: '--',
	// },
];
const engineerList = [
	{
		label: '工程编码',
		prop: 'facilityCode',
		value: '--',
	},
	{
		label: '工程名称',
		prop: 'facilityName',
		value: '--',
	},
	{
		label: '工程属性',
		prop: 'type',
		value: '--',
	},
	{
		label: '工程类型',
		prop: 'facilityTypeName',
		value: '--',
	},
	{
		label: '父级设施',
		prop: 'parentCode',
		value: '--',
	},
	{
		label: '行政区划',
		prop: 'regionName',
		value: '--',
	},
	{
		label: '管理单位',
		prop: 'manageUnit',
		value: '--',
	},
	{
		label: '空间信息',
		prop: 'geometry',
		value: '--',
	},
	{
		label: '工程图片',
		prop: 'picturePath',
		value: '--',
	},
];
const propertyData = reactive({
	point: [],
	engineer: [],
});
const propertyList = computed(() => {
	return props.deviceType === 'device' ? propertyData.point : propertyData.engineer;
});

const getDetailData = async () => {
	if (props.deviceType === 'device') {
		const res = await getDeviceDetail(props.deviceCode);
		propertyData.point = pointList.map((item) => {
			let value = item.value;
			if (item.prop === 'geometry') {
				value = res[0].geometry.coordinates;
			} else if (res[0].properties && res[0].properties[item.prop]) {
				value = res[0].properties[item.prop];
			}
			return {
				...item,
				value: value,
			};
		});
		res[0].properties.values.forEach((item) => {
			propertyData.point.push({
				label: item.name,
				prop: item.key,
				value: item.value + item.unit,
			});
		});
	} else {
		const res = await getFacilityDetail(props.deviceCode);
		propertyData.engineer = engineerList.map((item) => {
			let value = item.value;
			if (item.prop === 'geometry') {
				value = res.geometry.coordinates;
			} else if (res.properties && res.properties[item.prop]) {
				value = res.properties[item.prop];
			}
			return {
				...item,
				value: value,
			};
		});
		res.properties.attributes.forEach((item) => {
			propertyData.engineer.push({
				label: item.attributeName,
				prop: item.attributeKey,
				value: item.attributeValue,
			});
		});
	}
};
onMounted(() => {
	getRecordData();
});
</script>

<template>
	<el-dialog v-model="visible" class="point-dialog" width="1250px" top="22vh" :title="props.title">
		<template #header>
			<div class="custom-header">
				<span class="icon"></span>
				<p>{{ props.title }}</p>
			</div>
		</template>
		<TimeSelect
			class="inspection-time"
			:selection="info.type"
			:timeList="info.typeList"
			@time-change="tabClick"
		></TimeSelect>
		<div class="table" v-show="info.type === 'inspectionRecord'">
			<div class="table-header">
				<span class="table-title">巡检记录</span>
				<span class="table-date-label">日期：</span>
				<div style="width: 250px">
					<el-date-picker
						class="table-date-picker"
						v-model="dateRange"
						type="daterange"
						placeholder="选择日期"
					>
					</el-date-picker>
				</div>
			</div>
			<el-table :data="tableList" stripe>
				<el-table-column
					v-for="opt of columns"
					:key="opt.label"
					:prop="opt.prop"
					:label="opt.label"
				/>
			</el-table>
			<!-- <div class="table-footer">
				<el-pagination
					v-show="page.total !== 0"
					layout="prev, pager, next"
					v-model:current-page="page.currentPage"
					:page-size="page.pageSize"
					:total="page.total"
				/>
			</div> -->
		</div>
		<div class="property" v-show="info.type === 'projectProperty'">
			<div
				class="property-item"
				v-for="(opt, index) of propertyList"
				:key="opt.label"
				:class="
					(index + 1) % 4 === 3 || (index + 1) % 4 === 0 ? 'property-item2' : 'property-item1'
				"
			>
				<p class="item-label">
					{{ opt.label }}
				</p>
				<p class="item-value">{{ opt.value }}</p>
			</div>
		</div>
	</el-dialog>
</template>

<style lang="less">
.point-dialog {
	width: 1400px;
	height: 850px;
	//   .el-dialog__body {
	//     height: calc(100% - 40px);
	//   }
	.table {
		margin: 20px 100px;
		width: calc(~'100% - 240px');
		.table-header {
			padding: 18px;
			display: flex;
			flex-direction: row;
			align-items: center;
			.table-title {
				color: #97cdff;
				font-size: 20px;
				margin-right: 30px;
			}
			.table-date-label {
				color: #eff4ff;
				font-size: 18px;
			}
		}
		.table-footer {
			padding: 12px;
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
		}
	}
	.property {
		color: #fff;
		font-size: 22px;
		margin: 20px 50px;
		width: 1200px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		border: 1.43px solid rgba(239, 244, 255, 0.2);
		.property-item {
			width: 50%;
			height: 50px;
			display: flex;
			flex-direction: row;
			align-items: center;
			text-align: center;
			.item-label {
				line-height: 50px;
				width: 250px;
				border-left: 1.43px solid rgba(239, 244, 255, 0.2);
				border-right: 1.43px solid rgba(239, 244, 255, 0.2);
			}
			.item-value {
				line-height: 44px;
				flex: 1;
			}
		}
		.property-item1 {
			background: rgba(217, 217, 217, 0.1);
		}
		.property-item2 {
			background: transparent;
		}
	}
}
</style>
