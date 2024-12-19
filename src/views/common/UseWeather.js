/*
 * @Author: fishScola
 * @Date: 2022-07-16 21:01:14
 * @LastEditors: fishScola
 * @LastEditTime: 2022-07-16 21:54:04
 * @Description: UseWeather
 */

export default function UseWeather() {
  // 天气图片资源
  var modules = null

  // 获取assets静态资源
  function getFiles() {
    let toObj = {}
    let imgObj = import.meta.globEager('../../assets/img/overview/weather/*')
    for (const path in imgObj) {
      if (Object.hasOwnProperty.call(imgObj, path)) {
        let tag = path.substring(
          path.lastIndexOf('/') + 1,
          path.lastIndexOf('.')
        )
        toObj[tag] = imgObj[path]
      }
    }
    return toObj
  }

  function getWeatherImg(weather, defaultTag = 'cloudy') {
    if (!modules) {
      modules = getFiles()
    }
    let out = modules[weather] || modules[defaultTag]
    return (out && out.default) || ''
  }

  return {
    getWeatherImg,
  }
}
