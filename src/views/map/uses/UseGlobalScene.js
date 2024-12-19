/*
 * @Author: fishScola
 * @Date: 2022-07-16 19:29:24
 * @LastEditors: fishScola
 * @LastEditTime: 2023-05-06 17:58:22
 * @Description: UseGlobalScene - 全局场景对外方法与消息
 */
import UseFeatureService from './UseFeatureService.js'
import UseViewer from './UseViewer.js'
import UseDataSource from './UseDataSource.js'
import FormatUtil from '../utils/FormatUtil.js'
import UseGlobalMessage from '../../common/UseGlobalMessage';

export default function UseGlobalScene() {
  const {
    highlightRegion,
    clearHighlightRegion,
    highlightRiver,
    clearHighlightRiver,
    // features
    loadOGCFeatures,
    unloadOGCFeatures,
  } = UseFeatureService()
  const { findStationEntity } = UseViewer()
  const { heightByLonlat, cartesian3ToCarto } = FormatUtil()
  const { findEntityByParam } = UseDataSource()

  const {
    doEventSubscribe,
    doEventSend,
  } = UseGlobalMessage();

  doEventSubscribe("entity-billboard-location", entityBillboardLocation);

  function entityBillboardLocation({key, sourceKey , callback = null}){
    let entity = findEntityByParam({ key, sourceKey })
    console.log('xhy003',entity);
    let flag = typeof callback === 'function'
    if(entity) {
      flyToEntity(entity)
    }else {
      // 回调消息
      if (flag) {
        callback({ success: false, msg: '球体未加载当前要素！' })
      }
    }
  }


  // =================================== 高亮行政区划 =================================== //

  // 飞行至行政区划
  function flyToRegion({ code, name }) {
    highlightRegion(code)
  }

  function clearFlewRegion() {
    clearHighlightRegion()
  }

  // =================================== 高亮行政区划 =================================== //

  // =================================== 聚焦测站 =================================== //

  // 飞行至点
  function flyToPosition({
    code,
    name,
    stId,
    sttp,
    lon,
    lat,
    distance = 2000,
    duration = 0.8,
    callback,
  }) {
    let toViewer = window.earthObj && window.earthObj._viewer
    if (!toViewer) {
      return
    }
    // 依据测站类型和标识
    if (sttp && stId) {
      let stInfo = findStationInfo(sttp, stId)
      if (stInfo) {
        toViewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            stInfo.lon,
            stInfo.lat,
            heightByLonlat({ lon: stInfo.lon, lat: stInfo.lat }) + distance
          ),
          duration: duration,
          complete: function () {
            if (typeof callback === 'function') {
              callback(stInfo)
            }
          },
        })
        return
      }
    }
    // 依据坐标定位
    if (lon && lat) {
      toViewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          lon,
          lat,
          heightByLonlat({ lon, lat }) + distance
        ),
        duration: duration,
        complete: function () {
          if (typeof callback === 'function') {
            callback({ stId, sttp })
          }
        },
      })
      return
    }
  }

  // 找到对应的测站，返回存储的自定义信息
  function findStationInfo(sttp, stId) {
    let entity = findStationEntity(sttp, stId)
    return (entity && JSON.parse(entity.customInfo)) || null
  }

  // 飞行至测站
  function flyToStation({ stId, sttp }) {
    let stInfo = findStationInfo(sttp, stId)
    if (stInfo) {
      let { lon, lat } = stInfo
      flyToPosition({ lon, lat })
    } else {
      console.log('[UseGlobalScene]flyToStation:target entity not found!')
    }
  }

  // 飞行至 entity ,依据入参
  function flyToEntity(ent, opts = {
    distance: 4000,
    duration: 0.8,
    callback: undefined,
  }) {
    if (!ent) {
      return
    }
    let toViewer = window.earthObj && window.earthObj._viewer
    if (!toViewer) {
      return
    }
    let { distance, duration, callback } = opts
    let stInfo = cartesian3ToCarto(ent.position.getValue(), true)
    toViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        stInfo.lon,
        stInfo.lat,
        heightByLonlat({ lon: stInfo.lon, lat: stInfo.lat }) + distance
      ),
      duration: duration,
      complete: function () {
        if (typeof callback === 'function') {
          callback(stInfo)
        }
      },
    })
  }

  // =================================== 聚焦测站 =================================== //

  // =================================== 高亮河流 =================================== //

  // 飞行至河流
  function flyToRiver(riverCode) {
    highlightRiver(riverCode)
  }

  // 清除飞行有记录的河流
  function clearFlewRiver() {
    clearHighlightRiver()
  }

  // =================================== 高亮河流 =================================== //
  // ==================================== 场景事件 ==================================== //
  // 注册 camera[message] 事件
  function onSceneCamera(message, callback) {
    let earthObj = window.earthObj
    let camera = earthObj && earthObj.czm && earthObj.czm.camera
    let theEvent = camera && camera[message]
    if (theEvent) {
      theEvent.addEventListener(callback)
    }
  }
  // 注销
  function offSceneCamera(message, callback) {
    let earthObj = window.earthObj
    let camera = earthObj && earthObj.czm && earthObj.czm.camera
    let theEvent = camera && camera[message]
    if (theEvent) {
      theEvent.removeEventListener(callback)
    }
  }

  return {
    flyToRegion,
    clearFlewRegion,
    flyToPosition,
    heightByLonlat,
    flyToStation,
    flyToEntity,
    flyToRiver,
    clearFlewRiver,
    // features
    loadOGCFeatures,
    unloadOGCFeatures,
    // 场景事件
    onSceneCamera,
    offSceneCamera,
  }
}
