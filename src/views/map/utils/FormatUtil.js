/*
 * @Author: fishScola
 * @Date: 2022-07-13 18:33:55
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-07-09 14:58:50
 * @Description: 数据格式化
 */

export default function FormatUtil() {

  // 获取点位对应的高程
  function heightByLonlat({ carto, lon, lat, dz = 5 }) {
    let toScene = window.earthObj && window.earthObj._scene
    if (toScene) {
      return (
        toScene.globe.getHeight(
          carto || new Cesium.Cartographic.fromDegrees(lon, lat)
        ) + dz
      )
    }
    return 0
  }

  // cartesian3转球面坐标
  function cartesian3ToCarto(cartesian3, byDegrees = false) {
    let toEarth = window.earthObj
    let scene = toEarth._scene
    let cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian3)
    if (byDegrees) {
      let toD = Cesium.Math.toDegrees
      return {
        lon: toD(cartographic.longitude),
        lat: toD(cartographic.latitude),
        height: cartographic.height,
      }
    }
    return {
      lon: cartographic.longitude,
      lat: cartographic.latitude,
      height: cartographic.height,
    }
  }

  // 通过经纬度来获取
  function positionByLonlat({ lon, lat, byRadians = true, dz = 30 }) {
    let height = heightByLonlat({ lon, lat, dz })
    if (byRadians) {
      let toR = Cesium.Math.toRadians
      return [toR(lon), toR(lat), height]
    }
    return [lon, lat, height]
  }

  // 计算一个圆
  function computeCircle(radius, edges = 10) {
    const positions = []
    const toRadians = Cesium.Math.toRadians
    for (let i = 0, radians = 0; i < 360; i += edges) {
      radians = toRadians(i)
      positions.push(
        new Cesium.Cartesian2(
          radius * Math.cos(radians),
          radius * Math.sin(radians)
        )
      )
    }
    return positions
  }

  function getDataSource(jsonObject, opts = { clampToGround: true }) {
    return Cesium.GeoJsonDataSource.load(jsonObject, opts).then((ds) => {
      return ds
    })
  }

  // 替代 eval
  function evalVal(str) {
    return new Function('return ' + str)()
  }

  // 屏幕坐标转经纬度
  function pixel2Lonlat(pos) {
    let toEarth = window.earthObj
    let scene = toEarth._scene
    let cartographic = scene.globe.ellipsoid.cartesianToCartographic(scene.pickPosition(pos))
    let toD = Cesium.Math.toDegrees
    return {
      lon: toD(cartographic.longitude),
      lat: toD(cartographic.latitude),
    }
  }
 
  // propertyBagToObj
  function propertyBagToObj(propertyBag) {
    let obj = {};
    for (const propertyName in propertyBag) {
      if (propertyBag.isConstant) {
        obj = Object.assign({},{},propertyBag.getValue(propertyBag[propertyName][0])) 
      } 
    }
    //
    let lastEntity = {
      id: obj.id,
      code: obj.code || obj.deviceCode || obj.facilityCode,
      name: obj.name || obj.deviceName || obj.facilityName,
      type: obj.type || obj.deviceTypeName || obj.facilityTypeName,
      groupType: obj.groupType || '',
      rawData: obj,
      extData: {
        from: "SenceClick",
      },
    };

    return lastEntity;
  }

  // 必须是4326坐标参考，次方法才有效。批量增加geojson对象高程
  function addElevationInGeojson(geojson,Liftingheight,groupType){
    let jsonList = geojson;
    if(!jsonList.features.length){
      return false
    }
    let features = jsonList.features;
    let dataType = jsonList.features[0].geometry.type
    if(['MultiPoint', 'MultiLineString'].includes(dataType)){
      features.forEach((feat) => {
        feat.geometry.coordinates[0].forEach((cood)=>{
          cood.push(Liftingheight);
        })
        //
        feat.properties.groupType = groupType
      });
    }else if(['MultiPolygon'].includes(dataType)){
      features.forEach((feat) => {
        feat.geometry.coordinates[0][0].forEach((cood)=>{
          cood.push(Liftingheight);
        })
        //
        feat.properties.groupType = groupType
      });
    }else if(['Point'].includes(dataType)){
      features.forEach((feat) => {
        feat.geometry.coordinates.push(Liftingheight);
        //
        feat.properties.groupType = groupType
      })
    }else if(['LineString', 'Polygon'].includes(dataType)){
      features.forEach((feat) => {
        feat.geometry.coordinates[0].forEach((cood)=>{
          cood.push(Liftingheight);
        })
        //
        feat.properties.groupType = groupType
      });
    }
    return jsonList
  }

  //纹理图绘制 暂时只支持5个颜色
  function getColorRamp(elevationRamp) {
    var ramp = document.createElement("canvas");
    ramp.width = 1;
    ramp.height = 100;
    var ctx = ramp.getContext("2d");

    var values = elevationRamp;
    var grd = ctx.createLinearGradient(0, 0, 0, 100);
    grd.addColorStop(values[0], "#3273C3"); //black
    grd.addColorStop(values[1], "#2657A8"); //blue
    grd.addColorStop(values[2], "#224F9F"); //pink
    grd.addColorStop(values[3], "#133671"); //red
    grd.addColorStop(values[4], "#112F64"); //orange
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    return ramp;
  }

  return {
    // 坐标转换
    heightByLonlat,
    cartesian3ToCarto,
    positionByLonlat,
    computeCircle,
    getDataSource,
    evalVal,
    pixel2Lonlat,
    propertyBagToObj,
    addElevationInGeojson,
    getColorRamp
  }
}
