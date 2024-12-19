/*
 * @Author: fishScola
 * @Date: 2020-04-04 22:20:46
 * @LastEditors: fishScola
 * @LastEditTime: 2022-10-28 11:18:55
 * @Description: 工具方法
 */
// 防止按钮快速重复单击
const PreventQuick = (function PreventQuick() {
  let clickedQ = []

  return {
    isClickable(obj) {
      const tag = obj.name
      if (clickedQ.includes(tag)) {
        return false
      } else {
        clickedQ.push(tag)
        window.setTimeout(() => {
          clickedQ = clickedQ.filter((item) => {
            return item !== tag
          })
        }, obj.delay || 500)
        return true
      }
    },
  }
})()

// 过滤属性字段
const getPropsByIncluding = function (
  fromList,
  includList,
  fn = filterPropsHandler
) {
  let back = []
  ;[].concat(fromList).forEach((element) => {
    if (element) {
      fn(element, back, includList)
    }
  })
  if (fromList instanceof Array) {
    return back
  } else {
    return back[0]
  }
}

// 包含的属性字段
const filterPropsHandler = function (element, list, includList) {
  let out = {}
  for (let key in element) {
    if (includList.includes(key)) {
      out[key] = element[key]
    }
  }
  list.push(out)
}

// hex -> rgba
const hexToRgba = function (hex, alpha = 0.6) {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
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
    return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
  } else {
    return sColor
  }
}

// 从列表中随机选出一个
const randomOneFromList = function (fromList, base = 1e4) {
  if (fromList && fromList.length) {
    return fromList[Math.ceil(Math.random() * base) % fromList.length]
  } else {
    return null
  }
}

// 从一个区间中随机出一个数
const randomOneFromRange = function (max = 100, min = 0, base = 1e4) {
  return (Math.ceil(Math.random() * base) % (max - min + 1)) + min
}

// 动态加载js
const loadJS = function (url, callback) {
  let script = document.createElement('script')
  let fn = callback || (() => '')
  script.type = 'text/javascript'

  //IE
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null
        fn()
      }
    }
  } else {
    //其他浏览器
    script.onload = function () {
      fn()
    }
  }

  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}

// 通过字段列表映射数据
const mapByKeys = (list, keys) => {
  let out = {}
  list.forEach((it) => {
    let tmp = out
    for (let i = 0, len = keys.length, s = null; i < len; i++) {
      s = it[keys[i]]
      // 最后一层，存进去
      if (i === len - 1) {
        if (!tmp[s]) {
          tmp[s] = [it]
        } else {
          tmp[s].push(it)
        }
      } else {
        if (!tmp[s]) {
          tmp[s] = {}
        }
        tmp = tmp[s]
      }
    }
  })
  return out
}

// Array -> {[key]:Array}
const mapByKey = (list, key) => {
  let out = {}
  let t = null
  list.forEach((it) => {
    t = it[key]
    if (out[t]) {
      out[t].push(it)
    } else {
      out[t] = [it]
    }
  })
  return out
}

// 依据字段求和
const sumByKey = (list, key) => {
  let s = 0.0
  list.forEach((it) => {
    s += it[key] || 0
  })
  return s
}
// 依据多个key
const sumByKeys = (list, keys) => {
  let s = []
  list.forEach((it) => {
    keys.forEach((item, index) => {
      if (s[index] === undefined) {
        s[index] = 0.0
      }
      s[index] += it[item] || 0
    })
  })
  return s
}

function notEmpty(val) {
  return val !== undefined && val !== null && val !== '' ? true : false
}

function formatVal(val, unit = '', placeholder = '--') {
  if (notEmpty(val)) {
    return unit ? val + ' ' + unit : val
  } else {
    return placeholder
  }
}

function toPrecision(val, precision = 6) {
  return Number(val.toFixed(precision))
}

// 替代 eval
function evalVal(str) {
  return new Function('return ' + str)()
}

export {
  PreventQuick,
  getPropsByIncluding,
  hexToRgba,
  randomOneFromList,
  randomOneFromRange,
  loadJS,
  mapByKey,
  mapByKeys,
  sumByKey,
  sumByKeys,
  notEmpty,
  formatVal,
  toPrecision,
  evalVal,
}
