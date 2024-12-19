/*
 * @Author: fishScola
 * @Date: 2022-10-14 15:39:26
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-08 16:57:52
 * @Description: 行政区划
 */
import lcBoundary from '@/assets/json/districts/lc-boundary.json'
import jlNSBD from '@/assets/json/pipeline/jl-NSBD.json' // 南水北调主管网
import jlFCZZGW from '@/assets/json/pipeline/jl-FCZZGW.json' // 分厂至村主管网
import jlXCNZGW from '@/assets/json/pipeline/jl-XCNZGW.json' // 县城内主管网
import lcPump from '@/assets/json/pipeline/lc-pump.json'
import lcVillages from '@/assets/json/pipeline/lc-villages.json'
import lcWaterPlant from '@/assets/json/pipeline/lc-water-plant.json'
import pumpIcon from '../assets/stations/PP.svg'
import FormatUtil from '../utils/FormatUtil'
import UseFeatureService from './UseFeatureService'
import UseServices from './UseServices'

const store = {
  // 行政区划
  region: null,
  pipe_general: {},
  general_primitive: {},
  pipe_all: {},
  pipe_caliber: null,
  pipe_valve: null,
  pipe_pump: null,
  pipe_waterplant: null,
  // 数据缓存
  data: {},
}

export default function UseLiaoCheng() {
  const { getDataSource } = FormatUtil()

  async function loadDistricts(
    polyline = {
      material: Cesium.Color.fromCssColorString('#FFC102'),
      width: 4,
    },
    polygon = {
      material: Cesium.Color.fromCssColorString('rgba(48,215,251, 0.0)'),
    }
  ) {
    if (!lcBoundary) {
      return
    }
    // 清除上次
    unloadDistricts()
    // 设置当前行政区
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(lcBoundary)
    ds.name = 'scene_district'
    toViewer.dataSources.add(ds)
    ds.entities.values.forEach((it) => {
      if (it && it.polygon) {
        it.polygon.material = polygon.material
        it.polyline = {
          positions: it.polygon.hierarchy.getValue().positions,
          width: polyline.width,
          material: polyline.material,
          // material: new Cesium.PolylineGlowMaterialProperty({
          //   glowPower: 0.4, // 一个数字属性，指定发光强度，占总线宽的百分比。
          //   color: Cesium.Color.ORANGERED,
          // }),
        }
        let props = it.properties
        it.label = {
          text: getPropVal(props, 'name'),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(16.0, -2.0),
          font: '18px PingFangSC-Regular, Arial, Helvetica',
          fillColor: Cesium.Color.fromCssColorString('rgba(255,193,2, 0.5)'),
        }
        it.point = {
          pixelSize: 10,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          color: Cesium.Color.fromCssColorString('#FF5754'),
          outlineWidth: 1,
          outlineColor: Cesium.Color.fromCssColorString('#333'),
        }
        it.position = Cesium.Cartesian3.fromDegrees(
          Number(getPropVal(props, 'x')),
          Number(getPropVal(props, 'y'))
        )
      }
    })
    // 记录当前高亮的区划
    store.region = ds
  }

  function getPropVal(props, key) {
    let val = props && props[key] && props[key].getValue()
    if (val !== undefined) {
      return val
    }
    let obj = (props._properties && props._properties._value) || {}
    return obj[key] || '--'
  }

  function unloadDistricts() {
    let toDS = window.earthObj._viewer.dataSources
    if (store.region && toDS.contains(store.region)) {
      toDS.remove(store.region)
      store.region = null
    }
  }

  // pipe-lc-general
  function pipeStyleByType(dno) {
    if (dno == 1) {
      return {
        width: 22,
        // color: '#00e8ff',
        color: 'rgba(10,115,201,1.0)',
      }
    } else if (dno == 2) {
      return {
        width: 15,
        // color: '#00e8ff',
        color: 'rgba(92,231,58,1.0)',
      }
    } else {
      return {
        width: 10,
        // color: '#00e8ff',
        color: 'rgba(92,231,58,1.0)',
      }
    }
  }

  // todo: 入库管线数据，通过接口服务获取FeatureCollection，然后统一管理流动对象和管线对象
  function getJSONbyType(type){
    let FeatureCollection = null;
    switch (type) {
      case 'NSBD':
        FeatureCollection = jlNSBD; 
        break;
      case 'FCZZGW':
        FeatureCollection = jlFCZZGW;     
        break;
      case 'XCNZGW':
        FeatureCollection = jlXCNZGW;
        break;
      default:
        break;
    }
    return FeatureCollection
  }

  async function loadPipeGeneral(layerName = 'general', typeKey = 'dno', isClear = false) {
    let dataObj = getJSONbyType(layerName, true);
    if (!dataObj) {
      return
    }
    let toScene = (window.earthObj && window.earthObj._scene) || null
    if (!toScene) {
      return
    }
    // 清理上次
    if(isClear){
      unloadPipeGeneral()
    }
    // 概化-管网
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(dataObj)
    ds.name = 'scene_pipe_' + layerName
    toViewer.dataSources.add(ds)
    // 流动线
    let primCol = new Cesium.PrimitiveCollection()
    toScene.primitives.add(primCol)
    ds.entities.values.forEach((it) => {
      if (it && it.polyline) {
        let toProp = it.properties[typeKey]
        let { width, color } = pipeStyleByType(toProp && toProp.getValue())
        it.polyline.width = width
        it.polyline.material = new Cesium.PolylineArrowMaterialProperty(
          Cesium.Color.fromCssColorString(color)
        )
        // 流动
        primCol.add(
          addPrimitiveFlowAppear(
            it.polyline.positions._value,
            'rgba(255,255,255,0.6)',
            width * 0.6
          )
        )
      }
    })
    // 记录
    store.pipe_general[layerName] = ds
    store.general_primitive[layerName] = primCol
    animateFlowItem(primCol)
  }
  function unloadPipeGeneral(type, isDynamic = true) {
    let ds_dataObj = store.pipe_general[type];
    let primitive_dataObj = store.general_primitive[type];
    let toDS = window.earthObj._viewer.dataSources
    if (ds_dataObj && toDS.contains(ds_dataObj)) {
      toDS.remove(ds_dataObj)
      ds_dataObj = null
    }
    let toScene = (window.earthObj && window.earthObj._scene) || null
    if (!toScene) {
      return
    }
    if (
      primitive_dataObj &&
      toScene.primitives.contains(primitive_dataObj)
    ) {
      toScene.primitives.remove(primitive_dataObj)
      primitive_dataObj = null
    }
  }

  // 添加流动效果
  function animateFlowItem(groundCol) {
    let timex = 0
    function render() {
      timex += 0.005
      if (timex >= 1) {
        timex = 0 // 控制在0.0到1.0之间
      }
      for (let i = 0, len = groundCol.length, toPri = null; i < len; i++) {
        toPri = groundCol.get(i)
        if (toPri) {
          toPri.appearance.material.uniforms.time.x = timex - 0.003
        }
      }
      Cesium.requestAnimationFrame(render)
    }
    Cesium.requestAnimationFrame(render)
  }

  // 管道分布
  function pipeStyleByCaliber(val) {
    if (val >= 300) {
      // [300,)
      return {
        width: 6,
        material: Cesium.Color.fromCssColorString('#0A73C9'),
      }
    } else if (val >= 100) {
      // [100, 300)
      return {
        width: 4,
        material: Cesium.Color.fromCssColorString('#5CE73A'),
      }
    } else if (val >= 50) {
      // [50, 100)
      return {
        width: 2,
        material: Cesium.Color.fromCssColorString('#5CE73A'),
      }
    } else {
      // [0, 50)
      return {
        width: 1,
        material: Cesium.Color.fromCssColorString('#FFC102'),
      }
    }
  }

  async function loadPipeAll(layerName = 'general', styleKey = 'caliber') {
    let dataObj = getJSONbyType(layerName);
    if (!dataObj) {
      return
    }
    unloadPipeAll()
    // 分布-管网
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(dataObj)
    ds.name = 'scene_pipe_' + layerName
    toViewer.dataSources.add(ds)
    ds.entities.values.forEach((it) => {
      if (it && it.polyline) {
        let toProp = it.properties[styleKey]
        let { width, material } = pipeStyleByCaliber(
          toProp && toProp.getValue()
        )
        it.polyline.width = width
        it.polyline.material = material
      }
    })
    // 记录
    store.pipe_all[layerName] = ds
  }

  function unloadPipeAll(type) {
    let ds_dataObj = store.pipe_all[type];
    let toDS = window.earthObj._viewer.dataSources
    if (ds_dataObj && toDS.contains(ds_dataObj)) {
      toDS.remove(ds_dataObj)
      store.pipe_all[type] = null
    }
  }

  // 管径专题
  async function loadPipeByCaliber(styleKey = 'caliber') {
    if (!lcAll) {
      return
    }
    unloadPipeByCaliber()
    // 分布-管网
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(lcAll)
    ds.name = 'scene_pipe_caliber'
    toViewer.dataSources.add(ds)
    ds.entities.values.forEach((it) => {
      if (it && it.polyline) {
        let toProp = it.properties[styleKey]
        let { width, material } = pipeStyleByCaliber(
          toProp && toProp.getValue()
        )
        it.polyline.width = width
        it.polyline.material = material
      }
    })
    // 记录
    store.pipe_caliber = ds
  }

  function unloadPipeByCaliber() {
    unloadByParams('pipe_caliber')
  }

  function addPrimitiveFlowAppear(pos, color, width) {
    return new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
          positions: pos,
          width: width,
          vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT, //可以不设置，一般会根据 appearance的类型自动默认对应的类型
        }),
        attributes: {
          //color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 1.0, 1.0))
        },
      }),
      appearance: new Cesium.PolylineMaterialAppearance({
        material: Cesium.Material.fromType(Cesium.Material.FadeType, {
          repeat: false,
          fadeInColor: Cesium.Color.fromCssColorString(color).withAlpha(1.0),
          fadeOutColor: Cesium.Color.fromCssColorString(color).withAlpha(0.2),
          time: new Cesium.Cartesian2(100.0, 1.0),
          maximumDistance: 0.15 / 2.5,
          fadeDirection: {
            x: true,
            y: false,
          },
        }),
      }),
    })
  }

  function rangeByList(list, factor = 0.15) {
    let min = Math.min(list)
    let max = Math.max(list)
    let dy = (max - min) * factor
    let toMin = min - dy
    return {
      min: toMin < 0 ? 0 : toMin,
      max: max + dy,
    }
  }

  // 泵站
  async function loadPumps(nameKey = 'name') {
    if (!lcPump) {
      return
    }
    unloadPumps()
    // 分布-泵站
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(lcPump)
    ds.name = 'scene_pipe_pump'
    toViewer.dataSources.add(ds)
    ds.entities.values.forEach((it, pIndex) => {
      if (it && it.billboard) {
        it.label = {
          text: getPropVal(it.properties, nameKey),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(0.0, -32.0),
          font: 'bold 16px PingFangSC-Regular, Arial, Helvetica',
          fillColor: Cesium.Color.fromCssColorString('#FFF777'),
        }
        it.billboard = {
          image: pumpIcon,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(0.0, 2.0),
        }
        it.targetId = `custom_pump_${pIndex}`
      }
    })
    // 记录
    store.pipe_pump = ds
  }

  function unloadPumps() {
    unloadByParams('pipe_pump')
  }

  function unloadByParams(tag) {
    let toDS = window.earthObj._viewer.dataSources
    if (store[tag] && toDS.contains(store[tag])) {
      toDS.remove(store[tag])
      store[tag] = null
    }
  }

  // 水厂
  async function loadWaterPlant(
    option = {
      color: '#A9A9A9',
      outlineColor: '#BC8F8F',
      height: 25,
    }
  ) {
    if (!lcWaterPlant) {
      return
    }
    unloadWaterPlant()
    // 水厂
    let toViewer = window.earthObj._viewer
    let ds = await getDataSource(lcWaterPlant)
    ds.name = 'scene_pipe_waterplant'
    toViewer.dataSources.add(ds)
    ds.entities.values.forEach((it) => {
      if (it && it.polygon) {
        it.polygon.material = Cesium.Color.fromCssColorString(option.color)
        it.polygon.outlineColor = Cesium.Color.fromCssColorString(
          option.outlineColor
        )
        it.polygon.outline = true
        it.polygon.height = 0
        it.polygon.extrudedHeight = option.height || 25
        // 文字标注
        let props = it.properties
        it.label = {
          text: getPropVal(props, 'name'),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: new Cesium.Cartesian2(10.0, -32.0),
          font: 'bold 16px PingFangSC-Regular, Arial, Helvetica',
          fillColor: Cesium.Color.fromCssColorString('#dafdff'),
          pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
            2.0e3,
            4.5,
            5.0e3,
            0.2
          ),
        }
        it.position = Cesium.Cartesian3.fromDegrees(
          Number(getPropVal(props, 'x')),
          Number(getPropVal(props, 'y'))
        )
      }
    })
    // 记录
    store.pipe_waterplant = ds
  }
  function unloadWaterPlant() {
    unloadByParams('pipe_waterplant')
  }

  // 村落
  function loadVillages(tag = 'basic_villages') {
    if (!lcVillages) {
      return
    }
    let cacheObj = store.data
    cacheObj[tag] = lcVillages

    let displayCond = new Cesium.DistanceDisplayCondition(0, 2e4)
    loadPipeByParams({
      tag,
      layer: null,
      entityFn: (ds) => {
        ds.entities.values.forEach((it) => {
          if (it && it.billboard) {
            let itProps = it.properties
            it.label = {
              text: getPropVal(itProps, 'name'),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(6.0, 4.0),
              font: 'bold 16px PingFangSC-Regular, Arial, Helvetica',
              fillColor: Cesium.Color.fromCssColorString('#F5F5F5'),
              distanceDisplayCondition: displayCond,
            }
            it.billboard = null
          }
        })
      },
    })
  }
  function unloadVillages(tag = 'basic_villages') {
    unloadPipeByParams(tag, true)
  }

  // --------------------------- 基础方法 --------------------------- //
  const { getBizList } = UseServices()
  const { loadOGCFeatures, unloadOGCFeatures } = UseFeatureService()
  async function loadPipeByParams({
    tag,
    layer,
    dataFn = toGeojson,
    entityFn = toGeojsonEntity,
    cachable = false,
    isFeature = true,
  }) {
    let cacheObj = store.data
    let toJson = cacheObj[tag]
    if (!toJson) {
      let res = await getBizList(layer.extData)
      let out = dataFn(res)
      if (cachable) {
        cacheObj[tag] = out
      }
      toJson = out
    }
    // 载入
    if (isFeature) {
      await loadOGCFeatures({ tag, data: toJson, entityFn })
    }
    return toJson
  }

  // 接口返回数据格式化 -> geojson
  function toGeojson(data) {
    if (typeof data === 'string') {
      return JSON.parse(data)
    } else {
      return data
    }
  }

  // entity做后置处理
  function toGeojsonEntity(datasource) {
    return true
  }

  function unloadPipeByParams(tag, clearCache = false) {
    unloadOGCFeatures(tag)
    if (clearCache) {
      clearPipeStore(tag)
    }
  }

  // 获取接口数据
  async function loadPipeInfo({ layer, dataFn = toGeojson }) {
    let res = await getBizList(layer.extData)
    return dataFn(res)
  }

  function clearPipeStore(tag) {
    let cacheObj = store.data
    if (tag && cacheObj[tag]) {
      delete cacheObj[tag]
    } else {
      store.data = {}
    }
  }

  // --------------------------- 基础方法 --------------------------- //

  return {
    // 行政区划
    loadDistricts,
    unloadDistricts,
    // 管网
    loadPipeGeneral,
    unloadPipeGeneral,
    // 管线分布
    loadPipeAll,
    unloadPipeAll,
    // 泵站
    loadPumps,
    unloadPumps,
    // pipe
    loadPipeByParams,
    unloadPipeByParams,
    loadPipeInfo,
    clearPipeStore,
    // 水厂
    loadWaterPlant,
    unloadWaterPlant,
    // 管径专题
    loadPipeByCaliber,
    unloadPipeByCaliber,
    // 村落
    loadVillages,
    unloadVillages,
  }
}
