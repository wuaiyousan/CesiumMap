/*
 * @Author: fishScola
 * @Date: 2022-05-07 15:07:39
 * @LastEditors: fishScola
 * @LastEditTime: 2023-02-24 17:42:26
 * @Description: UseFeatureService
 */
import http from '@/api/http'

// 缓存加载到场景中的要素数据等
const store = {
  loaded: {
    riversfeatures: null,
    riverlinePrimitive: [],
    // 行政区划
    regionFeatures: null,
  },
  highlight: {
    river: null,
    region: null,
  },
}

export default function UseFeatureService() {

  // 河流
  function getRiverFeatures() {
    return http.getJson(
      `/RemoteGeoserver/gpBaseData/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gpBaseData%3Ariver&outputFormat=application%2Fjson`
    )
  }

  // 乡镇
  function getTownFeatures() {
    return http.getJson(
      '/RemoteGeoserver/gpBaseData/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gpBaseData%3Atown&maxFeatures=50&outputFormat=application%2Fjson'
    )
  }

  // =================================== 河流定位 =================================== //

  function getDataSource(jsonObject, opts = { clampToGround: true }) {
    return Cesium.GeoJsonDataSource.load(jsonObject, opts).then((ds) => {
      return ds
    })
  }

  // 高亮河流
  async function highlightRiver(riverCode) {
    // 1.找到对应的河流
    if (!store.loaded.riversfeatures) {
      await getRiverFeatures().then((result) => {
        store.loaded.riversfeatures = result.features
      })
    }
    let river = store.loaded.riversfeatures.find(
      (it) => it.properties.code == riverCode
    )
    // 2.河流定位
    if (river) {
      // 清除上次高亮
      clearHighlightRiver()
      // 设置当前河流
      let toViewer = window.earthObj._viewer
      let ds = await getDataSource({
        type: 'FeatureCollection',
        features: [river],
      })
      ds.name = 'highlight_river'
      toViewer.dataSources.add(ds)
      ds.entities.values.forEach((it) => {
        if (it && it.polygon) {
          it.polygon.material = Cesium.Color.WHITE.withAlpha(0.05)
          it.polyline = {
            positions: it.polygon.hierarchy.getValue().positions,
            width: 6,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.4, // 一个数字属性，指定发光强度，占总线宽的百分比。
              color: Cesium.Color.ORANGERED,
            }),
            clampToGround: true,
          }
        }
      })
      // 记录当前高亮的河流
      store.highlight.river = ds
      // 聚焦
      zoomByParam(toViewer, ds.entities)
    }
  }

  function zoomByParam(viewer, target, offset) {
    let toR = Cesium.Math.toRadians
    offset = offset || new Cesium.HeadingPitchRange(toR(360.0), toR(-90.0), 0.0)
    viewer.zoomTo(target, offset)
  }

  // 清除高亮
  function clearHighlightRiver() {
    let toDS = window.earthObj._viewer.dataSources
    let toHigh = store.highlight
    if (toDS.contains(toHigh.river)) {
      toDS.remove(toHigh.river)
      toHigh.river = null
    }
  }
  // =================================== 河流定位 =================================== //

  // 获取要素数据
  function getFeatureList(info) {
    let { type, url, params } = info
    let theType = String(type).toUpperCase()
    if (theType === 'GET') {
      return http.getJson(`${url}${http.formatParams(params)}`)
    } else if (theType === 'POST') {
      return http.postJson(url, params)
    }
  }

  // =================================== 行政区划定位 =================================== //

  async function highlightRegion(regionCode, flyOption = { duration: 0.8 }) {
    // 1.找到对应的行政区
    if (!store.loaded.regionFeatures) {
      await getTownFeatures().then((result) => {
        store.loaded.regionFeatures = result.features
      })
    }
    let region = store.loaded.regionFeatures.find(
      (it) => it.properties.code == regionCode
    )
    // 2.行政区定位
    if (region) {
      // 清除上次高亮
      clearHighlightRegion()
      // 设置当前行政区
      let toViewer = window.earthObj._viewer
      let ds = await getDataSource({
        type: 'FeatureCollection',
        features: [region],
      })
      ds.name = 'highlight_region'
      toViewer.dataSources.add(ds)
      ds.entities.values.forEach((it) => {
        if (it && it.polygon) {
          it.polygon.material = Cesium.Color.WHITE.withAlpha(0.05)
          it.polyline = {
            positions: it.polygon.hierarchy.getValue().positions,
            width: 6,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.4, // 一个数字属性，指定发光强度，占总线宽的百分比。
              color: Cesium.Color.ORANGERED,
            }),
            clampToGround: true,
          }
        }
      })
      // 记录当前高亮的区划
      store.highlight.region = ds
      // 飞行至
      toViewer.flyTo(ds, flyOption)
    }
  }

  // 清除高亮
  function clearHighlightRegion() {
    let toDS = window.earthObj._viewer.dataSources
    let toHigh = store.highlight
    if (toDS.contains(toHigh.region)) {
      toDS.remove(toHigh.region)
      toHigh.region = null
    }
  }

  // =================================== 行政区划定位 =================================== //

  // =================================== 加载要素服务数据 =================================== //
  const ogcInfo = {}

  function entitiesCallback(dataSource) {
    dataSource.entities.values.forEach((it) => {
      if (it) {
        if (it.polygon) {
          it.polygon.material = Cesium.Color.fromCssColorString('#FF0000')
          it.polygon.outline = true
          it.polygon.outlineColor = Cesium.Color.BLACK
        }
      }
    })
  }

  async function loadOGCFeatures({ tag, data, entityFn = entitiesCallback }) {
    if (!tag || !data) {
      return false
    }
    // 1 - 清理
    unloadOGCFeatures(tag)
    // 2 - 载入
    let ds = await getDataSource(data)
    if (!ds || !ds.entities) {
      return false
    }
    // 添加数据源名称
    ds.name = tag
    // 回调处理待加载的内容
    if (entityFn) {
      entityFn(ds)
    }
    // 添加到场景中
    let toDS = window.earthObj._viewer.dataSources
    if (!toDS.contains(ogcInfo[tag])) {
      toDS.add(ds)
      ogcInfo[tag] = ds
    }
  }

  function unloadOGCFeatures(tag) {
    let toDS = window.earthObj._viewer.dataSources
    let ds = ogcInfo[tag]
    if (ds && toDS.contains(ds)) {
      toDS.remove(ds)
      delete ogcInfo[tag]
    }
  }

  // =================================== 加载要素服务数据 =================================== //

  return {
    getFeatureList,
    // river高亮定位
    highlightRiver,
    clearHighlightRiver,
    // region高亮定位
    highlightRegion,
    clearHighlightRegion,
    // json数据源
    getDataSource,
    loadOGCFeatures,
    unloadOGCFeatures,
  }
}
