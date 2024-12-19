/*
 * @Author: fishScola
 * @Date: 2022-10-13 09:49:51
 * @LastEditors: fishScola
 * @LastEditTime: 2023-01-06 10:47:46
 * @Description: 场景视图
 */
// 将三维球体高度转换为层级
// eslint-disable-next-line complexity
function height2Level(height) {
  if (height > 48000000) {
    return 0
  } else if (height > 24000000) {
    return 1
  } else if (height > 12000000) {
    return 2
  } else if (height > 6000000) {
    return 3
  } else if (height > 3000000) {
    return 4
  } else if (height > 1500000) {
    return 5
  } else if (height > 750000) {
    return 6
  } else if (height > 375000) {
    return 7
  } else if (height > 187500) {
    return 8
  } else if (height > 93750) {
    return 9
  } else if (height > 46875) {
    return 10
  } else if (height > 23437.5) {
    return 11
  } else if (height > 11718.75) {
    return 12
  } else if (height > 5859.38) {
    return 13
  } else if (height > 2929.69) {
    return 14
  } else if (height > 1464.84) {
    return 15
  } else if (height > 732.42) {
    return 16
  } else if (height > 366.21) {
    return 17
  } else {
    return 18
  }
}

// 高程 -> 层级
// cesium依据高程计算level,https://www.jianshu.com/p/8a823edd36c0
function altitudeToZoom(altitude, round = false) {
  let A = 40487.57
  let B = 0.00007096758
  let C = 91610.74
  let D = -40467.74
  let to = D + (A - D) / (1 + Math.pow(altitude / C, B))
  if (round) {
    return Math.round(to)
  } else {
    return to
  }
}

// 层级 -> 高程
function zoomToAltitude(zoom) {
  let A = 40487.57
  let B = 0.00007096758
  let C = 91610.74
  let D = -40467.74
  return C * Math.pow((A - D) / (zoom - D) - 1, 1 / B)
}

export { height2Level, altitudeToZoom, zoomToAltitude }
