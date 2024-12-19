/*
 * @Author: fishScola
 * @Date: 2021-12-13 16:38:07
 * @LastEditors: fishScola
 * @LastEditTime: 2022-05-24 15:18:13
 * @Description: 常用处理方法汇总
 */

class HandUtil {
  static clickedQ = []

  static isClickable({ name, delay }) {
    if (this.clickedQ.includes(name)) {
      return false
    } else {
      this.clickedQ.push(name)
      window.setTimeout(() => {
        this.clickedQ = this.clickedQ.filter((item) => item !== name)
      }, delay || 300)
      return true
    }
  }

  static filterByExcluding(props, excludeList = ['geometry']) {
    let out = {}
    if (props) {
      for (let key in props) {
        if (!excludeList.includes(key)) {
          out[key] = props[key]
        }
      }
    }
    return out
  }

  // hex -> rgb
  static hexToRgb(hex) {
    // 十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 16进制颜色转为RGB格式
    let sColor = hex.toLowerCase()
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      //  处理六位的颜色值
      let sColorChange = []
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return sColorChange
    } else {
      return null
    }
  }

  // hex -> rgba
  static hexToRgba(hex, alpha = 0.6) {
    let rgb = this.hexToRgb(hex)
    if (rgb) {
      return 'rgba(' + rgb.join(',') + ',' + alpha + ')'
    }
    return hex
  }

  // 获取颜色序列
  static getColors({
    min = 0,
    max = 0,
    interval = 10,
    color = '#2E9BD3',
    factor = 1.0,
    precision = 2,
  }) {
    let rgb = this.hexToRgb(color)
    if (!rgb) {
      return []
    }
    // 依据等值距分段
    let out = []
    let toMin = Math.floor(min)
    let toMax = Math.ceil(max)
    let parts = Math.ceil((toMax - toMin) / interval)
    for (let i = 1; i <= parts; i++) {
      out.push({
        from: toMin + interval * (i - 1),
        to: Math.min(toMin + interval * i, toMax),
        color:
          'rgba(' +
          rgb.join(',') +
          ',' +
          Number((factor * i) / parts).toFixed(precision) +
          ')',
      })
    }
    return out
  }
}

export default HandUtil
