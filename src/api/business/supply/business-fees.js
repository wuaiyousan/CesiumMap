import http from '@/api/http';
import { api } from '@/common/ProjConfig';

// 基础收费数据
export const getBaseCharge = (time) => {
	return http.get(`${api}/smcs-water-user/bigScreen/businessFees/basic-charges?type=${time}`);
};

// 供售水趋势图
export const getSaleWaterTrend = (startTime, endTime) => {
	return http.get(
		`${api}/smcs-water-user/bigScreen/businessFees/supply-sale-analysis?startTime=${startTime}&endTime=${endTime}`
	);
};

// 用水分析
export const getUseWaterAnalysis = (startTime, endTime) => {
	return http.get(
		`${api}/smcs-water-user/bigScreen/businessFees/use-water-analysis?startTime=${startTime}&endTime=${endTime}`
	);
};

// 收费性质分析
export const getChargeType = (time) => {
	return http.get(
		`${api}/smcs-water-user/bigScreen/businessFees/charge-type-analysis?type=${time}`
	);
};

// 收费统计
export const getChargeStatistics = (startTime, endTime) => {
	return http.get(
		`${api}/smcs-water-user/bigScreen/businessFees/charge-statistics?startTime=${startTime}&endTime=${endTime}`
	);
};

// 制水成本分析
export const getWaterCostAnalysis = () => {
	return http.get(`${api}/smcs-water-user/bigScreen/businessFees/water-cost-analysis`);
};

// 大用水户监控
export const getBigWaterUserMonitor = () => {
	return http.get(`${api}/smcs-water-user/bigScreen/businessFees/big-waterUser-monitor`);
};

// 异常用户监控
export const getExceptionWaterUserMonitor = () => {
	return http.get(`${api}/smcs-water-user/bigScreen/businessFees/exception-waterUser-monitor`);
};

// 单个用水户详情
export const getUserWaterUseStatistics = (waterUserId) => {
	return http.get(
		`${api}/smcs-water-user/bigScreen/businessFees/month-water-statistics?waterUserId=${waterUserId}`
	);
};
