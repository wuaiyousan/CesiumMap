/*
 * @Author: fishScola
 * @Date: 2022-10-14 20:57:11
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-04-02 13:13:14
 * @Description: 供水
 */
import eventIcon from '@/assets/img/supply/event.svg'
import peopleIcon from '@/assets/img/supply/people.svg'
import { randomOneFromList, altitudeToZoom } from '@/utils/index'
import UseLiaoCheng from '../map/uses/UseLiaoCheng'
import UseHeatmap from '../map/uses/UseHeatmap'
import FormatUtil from '../map/utils/FormatUtil'
import UseGlobalMessage from './UseGlobalMessage'
import UseGlobalScene from '../map/uses/UseGlobalScene'

// 缓存加载的官网相关图层
const store = {}

// 更新poi
const poiUpdate = {}

export default function UseGlobalSupply() {
  const {
    loadPipeGeneral,
    unloadPipeGeneral,
    loadPipeAll,
    unloadPipeAll,
    loadPipeByParams,
    unloadPipeByParams,
    loadPipeByCaliber,
    unloadPipeByCaliber,
  } = UseLiaoCheng()

  const { loadHeatmap, unloadHeatmap } = UseHeatmap()

  const { doEventSend } = UseGlobalMessage()
  const { cartesian3ToCarto } = FormatUtil()
  const { onSceneCamera, offSceneCamera } = UseGlobalScene()

  // 管道健康
  function loadPipeHealth(
    it,
    option = { typeKey: '使用状况', lineWidth: 5 },
    tag = 'pipe_health'
  ) {
    if (store[tag]) {
      return
    }
    let typeField = option.typeKey
    let toWidth = option.lineWidth
    let healthyColor = {
      1: '#FF5754',
      2: '#FFC102',
    }
    loadPipeByParams({
      tag,
      layer: it,
      entityFn: (ds) => {
        ds.entities.values.forEach((it) => {
          if (it && it.polyline) {
            let toColor =
              healthyColor[getPropVal(it.properties, typeField)] || '#29FF98'
            it.polyline.width = toWidth
            it.polyline.material = Cesium.Color.fromCssColorString(toColor)
          }
        })
      },
    }).then(() => {
      store[tag] = true
    })
  }

  function unloadPipeHealth(tag = 'pipe_health') {
    unloadPipeByParams(tag)
    if (store[tag]) {
      delete store[tag]
    }
  }

  function getPropVal(props, key) {
    let val = props && props[key] && props[key].getValue()
    if (val !== undefined) {
      return val
    }
    let obj = (props._properties && props._properties._value) || {}
    return obj[key] || '--'
  }

  function getEntityProps(ent, excluding = []) {
    if (!ent) {
      return null
    }
    let obj = {}
    let props = ent.properties;
    [].concat(props.propertyNames).forEach((it) => {
      if (it && !excluding.includes(it)) {
        obj[it] = getPropVal(props, it)
      }
    })
    return obj
  }

  // 分区
  let partitionList = [
    'datalayer_pipenet_partition01',
    'datalayer_pipenet_partition02',
    'datalayer_pipenet_partition03',
  ]
  function loadPartition(it) {
    let toId = it.id
    if (!partitionList.includes(toId)) {
      return
    }
    if (store[toId]) {
      return
    }
    // 移除
    partitionList.forEach((id) => {
      if (id) {
        unloadPartition({ id })
      }
    })
    let toColor = [
      '',
      '#8A2BE2',
      (it, index) => {
        return [
          '#FFAD00',
          '#DA40D9',
          '#40B1ED',
          '#000FE7',
          '#00939C',
          '#E17449',
        ][index % 6]
      },
      () => {
        let color = [
          '#00939C',
          '#65B3BA',
          '#A2D4D7',
          '#C1E6C6',
          '#F5B097',
          '#E17449',
          '#C22E00',
          '#8B0000',
        ]
        return randomOneFromList(color)
      },
    ][Number(toId.slice(-2))]
    // 新增
    loadPipeByParams({
      tag: toId,
      layer: it,
      entityFn: (ds) => {
        ds.entities.values.forEach((it, index) => {
          if (it && it.polygon) {
            let fillColor = getPropVal(it.properties, 'color')
            if (fillColor) {
              it.polygon.material =
                Cesium.Color.fromCssColorString(fillColor).withAlpha(0.6)
            } else {
              it.polygon.material = Cesium.Color.fromCssColorString(
                typeof toColor === 'string' ? toColor : toColor(it, index)
              ).withAlpha(0.5)
            }
            it.targetId = `partition_${toId}_${index}`
          }
        })
      },
    }).then(() => {
      store[toId] = true
    })
  }

  function unloadPartition(it) {
    let toId = it.id
    if (!partitionList.includes(toId)) {
      return
    }
    unloadPipeByParams(toId)
    if (store[toId]) {
      delete store[toId]
    }
  }

  // -- 巡检
  async function loadInspection(it, tag = 'pipe_inspection') {
    if (store[tag]) {
      return
    }
    let res = await loadPipeByParams({
      tag,
      layer: it,
      isFeature: false,
    })
    loadHeatmap(tag, res || [], {
      xKey: 'lon',
      yKey: 'lat',
      zKey: 'val',
    }).then((flag) => {
      if (flag) {
        store[tag] = true
      }
    })
  }

  function unloadInspection(tag = 'pipe_inspection') {
    if (store[tag]) {
      unloadHeatmap(tag)
      delete store[tag]
    }
  }

  // -- 维修
  function loadMaintenance(it, tag = 'pipe_maintenance') {
    let conf = {
      label: 'area',
      opts: { color: ['#FFA500', '#88B379'] },
      series: [
        {
          code: 'complete',
          name: '完成',
          type: 'bar',
          barWidth: '40%',
          stack: 'chart',
          // data: [getPropVal(itProps, 'complete')],
        },
        {
          code: 'received',
          name: '接收',
          type: 'bar',
          barWidth: '40%',
          stack: 'chart',
          // data: [getPropVal(itProps, 'received')],
        },
      ],
    }
    loadByParams({ it, tag, conf })
  }
  function unloadMaintenance(tag = 'pipe_maintenance') {
    unloadByTag(tag)
  }

  function loadByParams({ it, tag = 'pipe_maintenance', conf }) {
    if (store[tag]) {
      return
    }
    let arr = []
    loadPipeByParams({
      tag: tag,
      layer: it,
      entityFn: (ds) => {
        let { label, opts, series } = conf
        ds.entities.values.forEach((it) => {
          if (it && it.billboard) {
            let itProps = it.properties
            it.label = {
              text: getPropVal(itProps, label),
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(0.0, 10.0),
              font: 'bold 16px PingFangSC-Regular, Arial, Helvetica',
              fillColor: Cesium.Color.fromCssColorString('#FFF777'),
            }
            it.billboard = null
            if (it.position) {
              let { lon, lat } = cartesian3ToCarto(it.position.getValue(), true)
              arr.push({
                position: { lon, lat },
                popover: 'chart',
                option: Object.assign({}, opts, {
                  xAxis: [
                    {
                      show: true,
                      type: 'category',
                      data: [getPropVal(itProps, label)],
                      axisLine: {
                        show: false,
                      },
                      axisLabel: {
                        color: 'rgba(215, 240, 255, 0.5)',
                        fontSize: 14,
                        formatter: '{value}',
                        interval: 1,
                      },
                    },
                  ],
                  series: series.map((k) => {
                    let { code, ...others } = k
                    return Object.assign({}, others, {
                      data: [getPropVal(itProps, code)],
                    })
                  }),
                }),
              })
            }
          }
        })
      },
    }).then(() => {
      // 加载popover
      store[tag] = arr
      doEventSend('dynamic-popover-change', { type: tag, list: arr })
    })
  }

  function unloadByTag(tag) {
    unloadPipeByParams(tag)
    if (store[tag]) {
      delete store[tag]
      doEventSend('dynamic-popover-change', { type: tag, list: [] })
    }
  }

  // -- 人员 | 图层处于加载时，每半分钟刷新一次位置
  function loadPeople(
    it,
    showFields = [
      { code: 'name', name: '姓名', value: '', append: '' },
      { code: 'time', name: '巡检时长', value: '', append: '小时' },
      { code: 'mileage', name: '巡检里程', value: '', append: '公里' },
    ],
    tag = 'pipe_people'
  ) {
    let arr = []
    loadPipeByParams({
      tag: tag,
      layer: it,
      entityFn: (ds) => {
        ds.entities.values.forEach((it) => {
          if (it && it.billboard) {
            it.billboard = {
              image: peopleIcon,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(0.0, 32.0),
            }
            if (it.position) {
              let itProps = it.properties
              let itFields = []
              showFields.forEach((field) => {
                if (field) {
                  itFields.push({
                    label: field.name,
                    value: field.value || getPropVal(itProps, field.code),
                    unit: field.append,
                  })
                }
              })
              let { lon, lat } = cartesian3ToCarto(it.position.getValue(), true)
              arr.push({
                position: { lon, lat },
                title: '',
                list: itFields,
                popover: 'info',
              })
            }
          }
        })
      },
    }).then(() => {
      // 加载popover
      store[tag] = arr
      doEventSend('dynamic-popover-change', { type: tag, list: arr })
      if (!poiUpdate[tag]) {
        poiUpdate[tag] = window.setInterval(() => {
          if (poiUpdate[tag]) {
            loadPeople(it, showFields, tag)
          }
        }, 30000)
      }
    })
  }
  function unloadPeople(tag = 'pipe_people') {
    if (poiUpdate[tag]) {
      window.clearInterval(poiUpdate[tag])
      delete poiUpdate[tag]
    }
    unloadByTag(tag)
  }

  // -- 事件
  function loadEvent(
    it,
    showFields = [
      { code: 'eventCode', name: '事件编码', value: '', append: '' },
      { code: 'reportName', name: '上报人', value: '', append: '' },
      {
        code: 'reportTime',
        name: '上报时间',
        value: '',
        append: '',
      },
    ],
    tag = 'pipe_event'
  ) {
    if (store[tag]) {
      return
    }
    let arr = []
    loadPipeByParams({
      tag: tag,
      layer: it,
      entityFn: (ds) => {
        ds.entities.values.forEach((it) => {
          if (it && it.billboard) {
            it.billboard = {
              image: eventIcon,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(0.0, 32.0),
            }
            if (it.position) {
              let itProps = it.properties
              let itFields = []
              showFields.forEach((field) => {
                if (field) {
                  itFields.push({
                    label: field.name,
                    value: field.value || getPropVal(itProps, field.code),
                    unit: field.append,
                  })
                }
              })
              let { lon, lat } = cartesian3ToCarto(it.position.getValue(), true)
              arr.push({
                position: { lon, lat },
                title: getPropVal(itProps, 'eventType'),
                list: itFields,
                popover: 'info',
              })
            }
          }
        })
      },
    }).then(() => {
      // 加载popover
      store[tag] = arr
      doEventSend('dynamic-popover-change', { type: tag, list: arr })
    })
  }

  function unloadEvent(tag = 'pipe_event') {
    unloadByTag(tag)
  }

  // -- 乡镇回收率
  function loadRecovery(it, tag = 'pipe_recovery') {
    let conf = {
      label: 'areaName',
      opts: { color: ['#FFCE7A', '#9AF5FF'] },
      series: [
        {
          code: 'deductionAmount',
          name: '应收',
          type: 'bar',
          barWidth: '40%',
        },
        {
          code: 'realDeductionAmount',
          name: '实收',
          type: 'bar',
          barWidth: '40%',
        },
      ],
    }
    loadByParams({ it, tag, conf })
  }
  function unloadRecovery(tag = 'pipe_recovery') {
    unloadByTag(tag)
  }

  // 加载POi监测点
  let poiDataFn = (dt) => {
    let list = []
      .concat(dt)
      .map((it) => {
        if (it) {
          let { geometry, ...others } = it
          return { type: 'Feature', properties: others, geometry }
        }
        return null
      })
      .filter((k) => k)
    return {
      type: 'FeatureCollection',
      features: list,
    }
  }
  function loadPoiByParams({ layer, showFields, tag }) {
    let theTag = `pipe_poi_${tag}`
    let icon = layer.icon
    if (!icon) {
      console.log('@loadPoiByParams:icon not found!')
      return
    }
    if (store[theTag]) {
      return
    }
    let arr = []
    loadPipeByParams({
      tag: theTag,
      layer: layer,
      dataFn: poiDataFn,
      entityFn: (ds) => {
        ds.entities.values.forEach((it, idx) => {
          if (it && it.billboard) {
            it.billboard = {
              image: icon,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              pixelOffset: new Cesium.Cartesian2(0.0, 36.0),
            }
            if (it.position) {
              arr.push({
                title: '',
                popover: 'info',
                id: `${theTag}.${idx}`,
                ...poiInfoByParams(it, showFields),
              })
            }
            it.targetId = `custom_${theTag}.${idx}`
          }
        })
      },
    }).then(() => {
      // 加载popover
      store[theTag] = arr
      if (arr.length) {
        if (!store[`camera_changed_${theTag}`]) {
          let handlerFn = (store[`camera_changed_${theTag}`] =
            handleDynamicPopover({
              type: theTag,
              list: arr,
            }))
          onSceneCamera('changed', store[`camera_changed_${theTag}`])
          // 触发一次
          handlerFn()
        }
      }
    })
  }
  function handleDynamicPopover({ type, list, levelLimit = 16.8 }) {
    let earthObj = window.earthObj
    let camera = earthObj && earthObj.czm && earthObj.czm.camera
    // 预防重复触发dynamic-popover-change事件和重复渲染
    let filled = false
    return () => {
      let level = altitudeToZoom(camera.positionCartographic.height)
      if (level >= levelLimit) {
        if (!filled) {
          doEventSend('dynamic-popover-change', { type, list, filled })
          filled = true
        }
      } else {
        if (filled) {
          doEventSend('dynamic-popover-change', { type, list: [], filled })
          filled = false
        }
      }
    }
  }
  function unloadPoiByParams({ tag }) {
    let theTag = `pipe_poi_${tag}`
    unloadPipeByParams(theTag)
    if (store[`camera_changed_${theTag}`]) {
      offSceneCamera('changed', store[`camera_changed_${theTag}`])
      delete store[`camera_changed_${theTag}`]
    }
    if (store[theTag]) {
      delete store[theTag]
      doEventSend('dynamic-popover-change', { type: theTag, list: [] })
    }
  }

  // 获取信息
  function poiInfoByParams(it, showFields) {
    let itProps = it.properties
    let itFields = []
    showFields.forEach((field) => {
      if (field) {
        itFields.push({
          label: field.name,
          value: field.value || getPropVal(itProps, field.code),
          unit: field.append,
        })
      }
    })
    let { lon, lat } = cartesian3ToCarto(it.position.getValue(), true)
    return {
      position: { lon, lat },
      list: itFields,
    }
  }

  function showSubPartition(obj, tag = 'dma_partition_sub') {
    let unloadSub = () => {
      if (store[tag]) {
        delete store[tag]
        doEventSend('dynamic-popover-change', { type: tag, list: [] })
      }
    }

    let loadSub = () => {
      let { code, name, data, position } = obj;
      let list = [].concat(data).map(t => {
        let props = t.properties || {};
        return {
          label: props.code,
          value: props.name,
          unit: ''
        }
      })
      let out = [{
        position,
        title: `${name}（${code}）`,
        popover: 'info',
        list
      }]
      // 加载popover
      store[tag] = out

      doEventSend('dynamic-popover-change', { type: tag, list: out })
    }

    if (Object.keys(obj).length) {
      loadSub();
    } else {
      unloadSub();
    }

  }



  return {
    loadPipeGeneral,
    unloadPipeGeneral,
    loadPipeAll,
    unloadPipeAll,
    // 管道健康
    loadPipeHealth,
    unloadPipeHealth,
    // 分区
    loadPartition,
    unloadPartition,
    // 管网
    loadInspection,
    unloadInspection,
    loadMaintenance,
    unloadMaintenance,
    loadPeople,
    unloadPeople,
    loadEvent,
    unloadEvent,
    loadRecovery,
    unloadRecovery,
    // 管径
    loadPipeByCaliber,
    unloadPipeByCaliber,
    // 监测点
    loadPoiByParams,
    unloadPoiByParams,
    getEntityProps,
    // 加载下级分区
    showSubPartition,
    getPropVal,
  }
}
