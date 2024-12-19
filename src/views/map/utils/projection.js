/*
 * @Author: fishScola
 * @Date: 2021-01-12 15:21:39
 * @LastEditors: fishScola
 * @LastEditTime: 2021-01-12 15:25:10
 * @Description: 添加对接入数据的空间参考处理
 */
import { default as proj4 } from 'proj4'

if (typeof Cesium !== 'undefined') {
  Cesium.GeoJsonDataSource.crsNames[
    'urn:ogc:def:crs:EPSG::4490'
  ] = Cesium.GeoJsonDataSource.crsNames['EPSG:4490'] = function(coordinates) {
    const fromProjection = `GEOGCS["China Geodetic Coordinate System 2000",
    DATUM["China_2000", SPHEROID["CGCS2000",6378137,298.257222101,AUTHORITY["EPSG","1024"]], AUTHORITY["EPSG","1043"]],
    PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]],
    UNIT["degree",0.0174532925199433, AUTHORITY["EPSG","9122"]],
    AUTHORITY["EPSG","4490"]]`

    const toProjection = `GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],
        AUTHORITY["EPSG", "6326"]], PRIMEM["Greenwich", 0, AUTHORITY["EPSG", "8901"]],
        UNIT["degree", 0.0174532925199433, AUTHORITY["EPSG", "9122"]], AUTHORITY["EPSG", "4326"]]`

    const x = coordinates[0]
    const y = coordinates[1]

    const newCoordinates = proj4(fromProjection, toProjection, [x, y])
    return Cesium.Cartesian3.fromDegrees(
      newCoordinates[0],
      newCoordinates[1],
      0
    )
  }
}
