/*
 * @Author: xionghaiying
 * @Date: 2024-06-26 15:31:56
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 14:11:54
 * @FilePath: \visualization\src\views\map\uses\UseEntity.js
 * @Description:  方法集合
 */
import { station } from "../data/icon.config";
import FormatUtil from "../utils/FormatUtil";
import imageImg from "./../assets/images/countyBack.png";

export default function UseEntity() {
  const { getColorRamp } = FormatUtil();
  // 本地图标映射
  const storeMap = {
    imgMap: station,
  };

  function changeEntity({
    entity, 
    iconType,
  }) {
    let icon = storeMap.imgMap[iconType] || ''
    createBillboard(entity, icon)
    return true
  }

  function SetEntity({ entity, classType = '', ds = null }) {
    specialType[classType](entity, ds)
    return true
  }

  let specialType = {
    County: function(entity) {
      createCountyCalss(entity)
      return
    },
    Town: function(entity, ds) {
      createTownCalss(entity, ds)
      return
    },
    Partition: function(entity) {
      createPartitionCalss(entity)
      return
    }
  }

  // --------------------------------------- Billboard属性 start ------------------------------------- //
  function createBillboard(entity,icon) {
    let displayCond = new Cesium.DistanceDisplayCondition(0.0, 100000.0) // float格式
    let theEntity = entity
    let billboard = {
      image: icon,
      scale: 1.5,
      // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 根据具体方案设置是否贴地
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // Make a billboard that is only visible when the distance to the camera is between 10 and 20 meters.
      distanceDisplayCondition: displayCond,
    }
    theEntity.billboard = billboard 
  }
  // --------------------------------------- Billboard属性 end --------------------------------------- //

  // --------------------------------------- Wall属性 start ------------------------------------- //
  function createWall(entity) {
    let theEntity = entity
    let wall = {
      positions: entity.polygon.hierarchy._value.positions,
      material: getColorRamp([0.0, 0.19, 0.46, 0.69, 1.0], true),
    };
    theEntity.wall = wall 
  }
  // --------------------------------------- Wall属性 end --------------------------------------- //

  // --------------------------------------- Point属性 start ------------------------------------- //
  function creatPoint(pos, text){

  }

  // --------------------------------------- Point属性 end --------------------------------------- //

  // --------------------------------------- Polygon属性 start --------------------------------------- //
  function createPolygon(entity) {
    let theEntity = entity
    let polygon = {
      // 需要重新赋值一次？？？？？
      hierarchy: entity.polygon.hierarchy,
      extrudedHeight: 2000,
      perPositionHeight: true,
      material: new Cesium.ImageMaterialProperty({
        image: imageImg,
      }),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    };
    theEntity.polygon = polygon 
  }
  // --------------------------------------- Polygon属性 end --------------------------------------- //

 // --------------------------------------- specialType start ------------------------------------- //
  function createCountyCalss(entity) {
    let theEntity = entity
    let wall = {
      positions: entity.polygon.hierarchy._value.positions,
      material: getColorRamp([0.0, 0.19, 0.46, 0.69, 1.0], true),
    };
    let polygon = {
      // 需要重新赋值一次？？？？？
      hierarchy: entity.polygon.hierarchy,
      extrudedHeight: 2000,
      perPositionHeight: true,
      material: new Cesium.ImageMaterialProperty({
        image: imageImg,
      }),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    };
    theEntity.wall = wall 
    theEntity.polygon = polygon 
  }

  function createTownCalss(entity, ds) {
    let theEntity = entity
    let polyline = {
      positions: entity.polygon.hierarchy._value.positions,
      width: 6,
      // arcType: Cesium.ArcType.RHUMB,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.ORANGE,
        outlineWidth: 1.2,
        outlineColor: Cesium.Color.BLACK,
      }),
    }
    let polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
    let polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
    let label = {
      position: polyCenter,
      label: {
        text: entity.name,
        font: "25px PingFang SC, PingFang SC-500",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    }
    ds.entities.add(label)
    theEntity.polyline = polyline
  }

  function createPartitionCalss(entity) {
    let theEntity = entity
    var positions = entity.polygon.hierarchy._value.positions;
    let polyline = {
      positions: positions,
      width: 3.0,
      material: Cesium.Color.fromCssColorString('#2AE8BD')
    };
    let polygon = {
      hierarchy: entity.polygon.hierarchy,
      extrudedHeight: 1000,
      perPositionHeight: true,
      material: Cesium.Color.fromCssColorString('#00FF7F').withAlpha(0.3),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    }
    theEntity.polyline = polyline;
    theEntity.polygon = polygon 
  }
  
// --------------------------------------- specialType end --------------------------------------- //

  return {
    changeEntity,
    SetEntity,
  }
}