/*
 * @Author: xionghaiying
 * @Date: 2024-06-21 15:03:31
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-10 14:12:31
 * @Description: 地图配置
 */
import { api } from '@/common/ProjConfig'

// 本地数据
import generalJson from '@/assets/json/pipeline/lc-general.json'
import allJson from '@/assets/json/pipeline/lc-all.json'
// 地图配置
let mapConf = {
  // 项目自部署iServer
  superMapUrl: "http://222.219.141.174:8090",
  // geoserver地址
  geoserverUrl: "http://39.91.167.36:8090/geoserver",
  // 底图方案 todo:暂时没有用，以后用于做切换底图方案
  getScenarioList: function() {
    return [
      {
        scenarioName: "矢量",
        scenarioType: "vector",
        layerList: [
          {
            uuid: "da8d6ce89ab84a66816b29c5d9902314",
            id: 6,
            code: "600",
            checked: true,
            isBlack: true,
            czmObject: {
              name: "天地图-矢量",
              xbsjType: "Imagery",
              xbsjImageryProvider: {
                XbsjImageryProvider: {
                  url: "https://t6.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=bf3f1bb9496222c7092e4c23f5aee129",
                },
              },
              xbsjZIndex: 1,
              show: true,
            },
            toOpacity: 100,
          },
          {
            uuid: 'da8d6ce89ab84a66816b29c5d9902315',
            id: 7,
            code: '600',
            checked: true,
            czmObject: {
              name: '天地图-矢量标注',
              xbsjType: 'Imagery',
              xbsjImageryProvider: {
                XbsjImageryProvider: {
                  url: 'https://t6.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=bf3f1bb9496222c7092e4c23f5aee129',
                },
              },
              xbsjZIndex: 2,
              show: true,
            },
            toOpacity: 100,
          },
        ],
        isDefault: false
      },
      {
        scenarioName: "影像",
        scenarioType: "image",
        layerList: [
          {
            id: "mapservice_img_w",
            code: '600',
            title: "天地图-影像",
            url: `https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=fd1a28bea0a80604b9b2744ccb6e208a`,
            params: {
              layer: 'tdtBasicLayer',
              style: 'default',
              format: 'tiles',
              tileMatrixSetID: 'GoogleMapsCompatible',
              subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
            },
            opacity: 1,
            zIndex: 0,
            checked: true,
            extData: {
              brightness: 0.3,
            }
          },
          {
            id: "mapservice_cia_w",
            code: '600',
            title: "天地图-影像注记",
            url: `https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=fd1a28bea0a80604b9b2744ccb6e208a`,
            params: {
              layer: 'tdtBasicLayer',
              style: 'default',
              format: 'tiles',
              tileMatrixSetID: 'GoogleMapsCompatible',
              subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
            },
            opacity: 1,
            zIndex: 1,
            checked: false,
            extData: {
              brightness: 0.3,
            }
          },
        ],
        isDefault: true
      },
      {
        scenarioName: "地形",
        scenarioType: "terrian",
        layerList: [
          {
            id: "modelservice_terrain",
            code: '500',
            type: 'CesiumTerrainProvider',
            title: "地形",
            url: '/3dModel/terrians',
            params: {},
            opacity: 1,
            zIndex: 2,
            checked: true,
            extData: {}
          },
        ],
        isDefault: false
      },
    ];
  },
  // 获取图层配置
  getLayers: function() {
    return [
      // 行政区划
      {
        groupName: "行政区划",
        groupType: "district",
        groupList: [
          // geoserver WMS服务
          {
            id: "mapservice_County",
            dataType: "mapservice",
            type: "wms",
            title: "东阿县",
            url: `${mapConf.geoserverUrl}/DongAn/wms`,
            params: {
              layers: "DongAn:County_Level"
            },
            opacity: 1,
            zIndex: 1,
            visible: true,

          },
          // geoserver 要素服务
          {
            id: "featuresmap_County",
            dataType: "featuresmap",
            type: "get",
            title: "东阿县",
            url:`${mapConf.geoserverUrl}/DongAn/ows`,
            params: {
              service: 'WFS',
              version: '1.0.0',
              request: 'GetFeature',
              outputFormat: 'application/json',
              typeName: "DongAn:County_Level",
              maxFeatures: "1000",
            },
            opacity: 1,
            zIndex: 1,
            visible: true,
            extData: {
              classType: 'County'
            }
          },
          // geoserver WMTS服务
          {
            id: "mapservice_Town",
            dataType:"mapservice",
            type:"wmts",
            title: "乡镇",
            url: `${mapConf.geoserverUrl}/gwc/service/wmts/rest/DongAn:Town_Level/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png`,
            params: {
              layer: 'DongAn:Town_Level',
              tileMatrixSetID: 'EPSG:4326',
              format: 'image/png',
              maximumLevel: 21,
              minimumLevel: 5,
            },
            opacity: 1,
            zIndex: 7,
            visible: true,
            extData: {
              rectangles: [116.04431727200006,36.126622534000035,116.54407316300004,36.52445016200006]
            },
          },
          // geoserver 要素服务
          {
            id: "featuresmap_Town",
            dataType: "featuresmap",
            type: "get",
            title: "镇级",
            url:`${mapConf.geoserverUrl}/DongAn/ows`,
            params: {
              service: 'WFS',
              version: '1.0.0',
              request: 'GetFeature',
              outputFormat: 'application/json',
              typeName: "DongAn:Town_Level",
              maxFeatures: "1000",
            },
            opacity: 1,
            zIndex: 1,
            visible: true,
            extData: {
              classType: 'Town',
              liftingHeight: 2030.0
            }
          },
        ],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      },
      // 河流湖泊 
      {
        groupName: "河流湖泊",
        groupType: "water-system",
        groupList: [],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      },
      // DMA分区
      {
        groupName: "DMA分区",
        groupType: "dma-partition",
        groupList: [
          {
            id: "dataservice_fenqu",
            dataType: "dataservice",
            type:"get",
            title: "DMA",
            url:`/api/uarws-dma/bigScreen/partition`,
            params: {
              partitionLevel: "SECONDARY_PARTITION"
            },
            opacity: 1,
            zIndex: 8,
            visible: true,
            extData: {
              classType: 'Partition',
              liftingHeight: 2005.0
            }
          }
        ],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      },
      // 水利工程
      {
        groupName: "水利工程",
        groupType: "water-engineering",
        groupList: [
          // 水厂
          {
            id: "dataservice_shuiyuan",
            dataType: "dataservice",
            type: "get",
            title: "水厂",
            url: `${api}/swp-base-device/facility/glist`,
            params: {
              "facilityTypeCode":"GYHP010",
            }, // 接口请求参数
            opacity: 1,
            zIndex: 21,
            visible: false,
            extData: {
              featureType: "GYHP010",// 对应图标。先取本地图标
              // 标识是否有模型
              isModel: [
                  {
                    code: '532327101207681',
                    url: '/3dModel/3Dtile/DLSC/tileset.json',
                    elevation: 25,
                  },
                  {
                    code: '532327101207682',
                    url: '/3dModel/3Dtile/ZHSC/tileset.json',
                    elevation: 24,
                  },
                ]
            },
          },
        ],
        isIndeterminate: false,
        checkAll: false,
        // 设置图层visible为true,并将其id添加到checkList,整个自动完成加载初始化
        checkList: []
      },
      // 监测站网
      {
        groupName: "监测站网",
        groupType: "stations",
        groupList: [
          {
            id: "dataservice_PZ",
            dataType: "dataservice",
            type: "get",
            title: "水质监测站",
            url: "/api/swp-base-device/device/monitor/real",
            params: {
              deviceType:"WQ001",
            },
            opacity: 1,
            zIndex: 0,
            visible: false,
            extData: {
              featureType: "WQ001"
            },
          }
        ],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      },
      // 供水管网
      {
        groupName: "供水管网",
        groupType: "pipe-network",
        groupList: [
          // 要素服务（geoserver,supermap）
          {
            id: "mapservice_pipeline",
            dataType:"featuresmap",
            type:"get",
            title: "水厂管网",
            url:`${mapConf.geoserverUrl}/DongAn/ows`,
            params: {
              service: 'WFS',
              version: '1.0.0',
              request: 'GetFeature',
              outputFormat: 'application/json',
              typeName: "DongAn:pipeline_center",
              maxFeatures: "1000",
            },
            opacity: 1,
            zIndex: 11,
            visible: true,
            extData: {
              response: generalJson,
              isFlow: true,
            },
          },
          // 要素服务（geoserver,supermap）
          {
            id: "mapservice_pipeline_all",
            dataType:"featuresmap",
            type:"get",
            title: "管网",
            url:`/geoserver/DongAn/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json`,
            params: {
              typeName:"DongAn:pipeline_center",
              maxFeatures:"1000",
            },
            opacity: 1,
            zIndex: 12,
            visible: true,
            extData: {
              response: allJson
            },
          },
          // 接口服务 
          {
            id: "mapservice_pipeline_jk",
            dataType:"dataservice",
            type:"get",
            title: "管网",
            url:`${mapConf.geoserverUrl}/iserver/services/map-gpBaseMapWS/rest/maps/gpCXGSMapDs`,
            params: {
              layersID: "[0:8,10]"
            },
            opacity: 1,
            zIndex: 12,
            visible: true,
            extData: {},
          },
        ],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      },
      //巡检工程
      {
        groupName: "运维巡检",
        groupType: "xj-engineering",
        groupList: [
          {
            id: "dataservice_engineering",
            dataType: "dataservice",
            type: "get",
            title: "巡检工程",
            url: "/api/swp-base-pipeops/bigScreen/ops/patrol/state",
            params: {},
            opacity: 1,
            zIndex: 0,
            visible: false,
            extData: {
              featureType: "XJ"
            },
          }
        ],
        isIndeterminate: false,
        checkAll: false,
        checkList: []
      }
    ];
  }
};

export default mapConf
