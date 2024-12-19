/*
 * @Author: fishScola
 * @Date: 2022-10-15 17:03:58
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 15:29:38
 * @Description: 综合展示
 */
import http from "@/api/http";
import { api } from "@/common/ProjConfig";

// 管网资产
export const getTrendAnalysis = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/synthesis/trend-analysis?date=&type=${params.type}`
  );
};

// 管网资产
export const getPipeAssets = () => {
  return http.get(`${api}/swp-base-device/bigScreen/synthesis/asset`);
};

// 供水服务
export const getSupplyService = () => {
  return http.get(`${api}/swp-base-device/bigScreen/synthesis/supply-analysis`);
};

// 供水监测
export const getSupplyMonitor = () => {
  return http.get(`${api}/swp-base-device/bigScreen/synthesis/supply-monitor`);
};

// 报警分析
export const getAlarmAnalysis = (params) => {
  return http.get(
    `${api}/swp-base-alarm/bigScreen/synthesis/analysis${http.formatParams(
      params
    )}`
  );
};

// 实时报警-分页
export const getSynthesisPage = (params) => {
  return http.get(
    `${api}/swp-base-alarm/bigScreen/synthesis/page${http.formatParams(params)}`
  );
};

// 巡检概况
export const getPatrolOverview = () => {
  return http.get(`${api}/swp-base-pipeops/bigScreen/display/patrol/overview`);
};

// 检漏情况
export const getLeakDetection = (time) => {
  return http.get(`${api}/synthesis/leak-detection?timeUnit=${time}`);
};

// 服务指标排行
export const getServiceRank = () => {
  return http.get(`${api}/synthesis/service-rank`);
};

// 综合参数指标
export const getGeneralIndex = () => {
  return http.get(`${api}/synthesis/system-indicators`);
};

// 分区供水量
export const getPartitionInfo = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/synthesis/area-leak${http.formatParams(params)}`
  );
};
