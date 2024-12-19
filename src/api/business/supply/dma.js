import http from "@/api/http";
import { api } from "@/common/ProjConfig";

// 漏损总览
export const getall = (data) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getDMALeakOverView?date=${data.date}`
  );
};

// 分区个数接口
export const getAreaCount = () => {
  return http.get(`${api}/uarws-dma/bigScreen/getAreaCount`);
};

// 水平衡
export const getWaterBalance = (data) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getDMAWaterBalanceAnalysis?date=${data.date}`
  );
};
// 漏损产销变化趋势
export const getnrw = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getLeakRatioProdMarkDiff?startTime=${params.startTime}&endTime=${params.endTime}`
  );
};
// 夜间流量
export const getNightFlow = () => {
  return http.get(`${api}/uarws-dma/bigScreen/getNightLeastWaterList`);
};
// 漏损排名
export const getRank = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getLeakRatioRankListByMonth?startTime=${params.startTime}&endTime=${params.endTime}&areaLevel=${params.level}`
  );
};
// 漏损排名
export const getRankData = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getLeakRatioRankListByArea?startTime=${params.startTime}&endTime=${params.endTime}&areaLevel=${params.level}`
  );
};

// 分区挂接测站数据;
export const getFlowRelation = (code) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getFlowRelation?areaCode=${code}`
  );
};

// 分区供水量数据;
export const getSupplyWaterAmount = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getSupplyWaterAmount?startTime=${params.startTime}&endTime=${params.endTime}&areaCode=${params.areaCode}`
  );
};

// 分区测站水量数据;
export const getWaterAmount = (params) => {
  return http.get(
    `${api}//uarws-dma/bigScreen/getWaterAmount?startTime=${params.startTime}&endTime=${params.endTime}&deviceCode=${params.deviceCode}`
  );
};

// 分区售水数据;
export const saleWaterAmount = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getSaleWaterAmount?startTime=${params.startTime}&endTime=${params.endTime}&areaCode=${params.areaCode}`
  );
};

// 分区产销差
export const prodMarkDiff = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getProdMarkDiff?startTime=${params.startTime}&endTime=${params.endTime}&areaCode=${params.areaCode}`
  );
};

// 分区夜间最小流量
export const nightLeasWater = (params) => {
  return http.get(
    `${api}/uarws-dma/bigScreen/getNightLeasWater?startTime=${params.startTime}&endTime=${params.endTime}&areaCode=${params.areaCode}`
  );
};

// 获取下级分区信息
export const getSubInfo = (code) => {
  return http.get(`${api}/uarws-dma/low-partition?parentCode=${code}`);
};
