/*
 * @Author: fishScola
 * @Date: 2022-10-14 10:11:01
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-14 11:02:06
 * @Description: 运维巡检-巡检概况
 */

import http from '@/api/http';
import { api } from '@/common/ProjConfig';

// 巡检概况
export const getOperationOverview = (time) => {
	return http.get(`${api}/swp-base-pipeops/bigScreen/ops/patrol/overview?timeUnit=${time}`);
};

// 巡检历史
export const getOperationHistory = (time) => {
	return http.get(`${api}/swp-base-pipeops/bigScreen/ops/patrol/history?timeUnit=${time}`);
};

// 事件概况
export const getEventOverview = (time) => {
	return http.get(`${api}/swp-base-pipeops/bigScreen/ops/event/overview?timeUnit=${time}`);
};

//测站属性00
export const getDeviceDetailOld = (deviceCode) => {
	return http.get(`${api}/swp-base-device/bigScreen/device/${deviceCode}/details`);
};
//测站属性
export const getDeviceDetail = (deviceCode) => {
	return http.get(`${api}/swp-base-device/bigScreen/device/monitor/real?deviceCode=${deviceCode}`);
};

//工程属性
export const getFacilityDetail = (facilityCode) => {
	return http.get(`${api}/swp-base-device/bigScreen/facility/${facilityCode}/details`);
};

// 巡检记录
export const getInspectionRecord = ({ code, startTime, endTime }) => {
	return http.get(
		`${api}/swp-base-pipeops/bigScreen/ops/patrol/record?equipCode=${code}&startTime=${startTime}&endTime=${endTime}`
	);
};
