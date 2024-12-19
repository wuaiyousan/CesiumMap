import http from '@/api/http'
import { api } from '@/common/ProjConfig'

//综合数据
export const getSynthesis = () => {
  return http.get(`${api}/revenue/synthesis-analysis-two`)
}
// 营收总览
export const getRevenue = () => {
  return http.get(`${api}/revenue/marketing`)
}
//用水分析
export const getUseWater = () => {
  return http.get(`${api}/revenue/use-water`)
}
//业务处理分析
export const getBusiness = () => {
  return http.get(`${api}/revenue/business-process`)
}
//抄表分析
export const getMeterReading = () => {
  return http.get(`${api}/revenue/meter-reading`)
}
//表务分析
export const getMeterBusiness = () => {
  return http.get(`${api}/revenue/meter-business`)
}
//服务质量
export const getServiceQuality = () => {
  return http.get(`${api}/revenue/service-quality`)
}
