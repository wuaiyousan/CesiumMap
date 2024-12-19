/*
 * @Author: xionghaiying
 * @Date: 2024-06-26 15:31:56
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-10 16:08:10
 * @FilePath: \visualization\src\views\map\uses\UseDataSource.js
 * @Description: DataSource 方法集合
 */
import FormatUtil from "../utils/FormatUtil";
import UsePrimitive from "./UsePrimitive";
import UseEntity from "./UseEntity";

export default function UseDataSource() {
  const { cartesian3ToCarto, addElevationInGeojson } = FormatUtil();
  const { loadPrimitiveByParams, hideOrShowPrimitiveLayer, load3Dtile } = UsePrimitive();
  const { changeEntity, SetEntity } = UseEntity();

  async function loadDataSourceByParams({ layerItem, jsonList, show , height = 2000.2}) {
    // 判断数据是否为空
    let dataList = null;
    let {
      id,
      title,
      extData: { featureType ,isModel, classType, liftingHeight},
      groupType,
      zIndex,
    } = layerItem;
    if (jsonList.features.length) {
      let finalHeight = liftingHeight ? liftingHeight : height
      dataList = addElevationInGeojson(jsonList, finalHeight , groupType)
    }else {
      return;
    }
    // 判断球体是否已有当前DataSource
    const DataSource = findDataSourceByName(id);
    if (DataSource) {
      hideOrShowLayer({ key: id, show, modelCode: isModel ? isModel : false });
      return;
    }
    const viewer = window.earthObj._viewer;
    // 创建GeoJSON数据源
    const geoJsonDataSource = new Cesium.GeoJsonDataSource();
    // 加载GeoJSON数据
    geoJsonDataSource
      .load(dataList, {
        // 可以在这里指定样式选项，例如:
        stroke: Cesium.Color.BLUE.withAlpha(0.0),
        fill: Cesium.Color.PINK.withAlpha(0.0),
        strokeWidth: 0.0,
        clampToGround: false,
      })
      .then(function (dataSource) {
        // 用ID来唯一DataSource对象，因为DataSourceS暂时只要getByName()方法
        dataSource.name = id;
        // 补充属性
        dataSource.tag = featureType;
        dataSource.title = title;
        dataSource.show = show;
        // 将数据源添加到Cesium Viewer
        viewer.dataSources.add(dataSource);
        // 遍历实体并进行处理
        dataSource.entities.values.forEach(function (entity) {
          if (entity.polygon) {
            SetEntity({entity, classType, ds: dataSource})
          } else if (entity.polyline) {
            // 处理线
            let typeKey = "pipeLevel";
            let toProp = entity.properties[typeKey];
            let { width, color } = pipeStyleByType(toProp && toProp.getValue());
            entity.polyline.width = width;
            entity.polyline.material = new Cesium.PolylineArrowMaterialProperty(
              Cesium.Color.fromCssColorString(color)
            );
            loadPrimitiveByParams({ id, width, zIndex, entity });
          } else if (entity.billboard || entity.point) {
            let iconType = "";
            if (
              layerItem.extData &&
              layerItem.extData.hasOwnProperty("featureType")
            ) {
              iconType = layerItem.extData.featureType;
              //获取图标类型，针对巡检数据
              if(iconType==="XJ")
              {
                iconType=getIconType(entity,iconType);
              }
            }
            changeEntity({ entity, iconType });
            // 判断是否有模型 todo:应当给要素绑定是否加载模型属性，而不是通过图层配置
            let graphic = cartesian3ToCarto(entity.position._value);
            if (layerItem.extData && layerItem.extData.isModel) {
              let isModel  = layerItem.extData.isModel;
              isModel.forEach((item) => {
                let { code, url, elevation } = item;
                load3Dtile({
                  code,
                  url,
                  elevation: graphic.height + elevation,
                });
              });
            }
          }
        });
      });
  }

  function getIconType(entity,iconType)
  {
      let reportTime=entity.properties.reportTime.valueOf();
      let isFeed=entity.properties.isFeed.valueOf();
      if(isToday(reportTime))
      {
         return iconType;
      }
      else{
        return iconType+"_"+Number(isFeed);
      }


  }
  
  function isToday(dateString) {
    let date= new Date(dateString)
    return new Date().toDateString() === date.toDateString();
  }

  // pipe-lc-general
  function pipeStyleByType(dno) {
    if (dno == 1) {
      return {
        width: 22,
        // color: '#00e8ff',
        color: "rgba(10,115,201,1.0)",
      };
    } else if (dno == 2) {
      return {
        width: 15,
        // color: '#00e8ff',
        color: "rgba(92,231,58,1.0)",
      };
    } else {
      return {
        width: 10,
        // color: '#00e8ff',
        color: "rgba(92,231,58,1.0)",
      };
    }
  }

  // 卸载
  function unloadDataSourceLayer(key) {
    const DataSources = window.earthObj._viewer.dataSources;
    let theDS = findDataSourceByName(key);
    DataSources.remove(theDS[0]);
  }

  // 隐藏
  function hideOrShowDataSourceLayer(key, show) {
    let theDS = findDataSourceByName(key);
    if (theDS) {
      theDS.show = show;
    }
  }

  // 根据name获取DataSoure
  function findDataSourceByName(key) {
    const DataSources = window.earthObj._viewer.dataSources;
    let theDS = DataSources.getByName(key);
    if (theDS.length === 1) {
      return theDS[0];
    }
    return false;
  }

  // 根据属性获取DataSoure
  function findDataSourceByParam(key, keyVal = 'tag') {
    let out = null
    const DataSources = window.earthObj._viewer.dataSources;
    for (let i = 0, len = DataSources.length, t = null; i < len; i++) {
      t = DataSources.get(i)
      if (t[keyVal] === key) {
        out = t
        break
      }
    }
    return out
  }
  // 显影图层
  function hideOrShowLayer({key ,show, modelCode = false }) {
    // DataSoure
    hideOrShowDataSourceLayer(key, show);
    // Primitive
    if (modelCode && modelCode.length) {
      modelCode.forEach((item) => {
        hideOrShowPrimitiveLayer(key, item.code, show);
      });
    } else {
      hideOrShowPrimitiveLayer(key, modelCode, show);
    }
  }

  // 通过参数获取相应类型测站
  function findEntityByParam({key, keyVal = 'id', sourceKey}) {
    let ToViewer = (window.earthObj && window.earthObj._viewer) || null;
    if (!ToViewer) {
      return false;
    }
    let theDs = findDataSourceByParam(sourceKey)
    if(theDs) {
      let theEntity = null;
      if(keyVal === 'id') {
        theEntity = theDs.entities.getById(key)
      }else {
        theEntity = theDs.entities.values.find((entity)=> entity.properties.getValue()[keyVal] === key )
      }
      return theEntity
    }
    return false
  }

  return {
    findEntityByParam,
    loadDataSourceByParams,
    unloadDataSourceLayer,
    hideOrShowDataSourceLayer,
    hideOrShowLayer,
  };
}
