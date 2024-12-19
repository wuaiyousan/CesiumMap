/*
 * @Author: fishScola
 * @Date: 2022-10-14 10:11:01
 * @LastEditors: fishScola
 * @LastEditTime: 2022-12-29 18:22:50
 * @Description: 管网调度
 */
import http from '@/api/http'
import { api } from '@/common/ProjConfig'

// 站点监测
export const getSiteSurvey = (type) => {
  return http.get(`${api}/network-dispatch/site-survey?siteType=${type}`)
}

// 电耗和供水
export const getConsumptionInfo = () => {
  return http.get(`${api}/network-dispatch/water-power-consumption`)
}

// 供水监控
export const getSupplyMonitor = (type) => {
  return http.get(
    `${api}/network-dispatch/supply-water-monitor?waterMonitor=${type}`
  )
}

// 预警信息 - 统计
export const getWaringStatistics = (params = {}) => {
  return http.get(
    `${api}/network-dispatch/warning-count${http.formatParams(params)}`
  )
}

// 预警信息 - 列表
export const getWaringList = (params = {}) => {
  return http.get(
    `${api}/network-dispatch/warning-list${http.formatParams(params)}`
  )
}

// 调度指令
export const getInstructionInfo = () => {
  return http.get(`${api}/network-dispatch/instruction-display`)
}

// 站点运行参数查询
export const getStationParams = (stId) => {
  return http.get(`${api}/network-dispatch/station-params?stId=${stId}`)
}
