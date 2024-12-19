/*
 * @Author: fishScola
 * @Date: 2023-03-01 10:42:25
 * @LastEditors: fishScola
 * @LastEditTime: 2023-03-01 11:07:16
 * @Description: 热力图
 */

// 热力图
const info = {
  // 数据集
}

export default function UseHeatmap() {
  let defaultOpts = {
    fillStyle: 'rgba(255, 250, 50, 0.8)', // 填充颜色
    globalCompositeOperation: 'lighter', // 颜色叠加方式
    maxSize: 20, // 显示的圆最大半径大小
    // max: ?, // 数值最大值范围
    shadowBlur: 50, // 投影模糊级数
    shadowColor: 'rgba(255, 250, 50, 1)', // 投影颜色
    gradient: {
      0.25: 'rgb(0,201,255)',
      0.55: 'rgb(0,255,0)',
      0.6: 'yellow',
      0.7: 'rgb(255,0,0)',
    },
    draw: 'heatmap', // mapv提供有多种选项，如['bubble', 'heatmap']
  }

  function loadHeatmap(
    tag,
    res,
    options = {
      xKey: 'lgtd',
      yKey: 'lttd',
      zKey: 'population',
      // 热力图
      showOptions: {},
    }
  ) {
    // 1.组装热力图所需数据
    let arr = []
    let { xKey, yKey, zKey, showOptions } = options
    res.forEach((item) => {
      arr.push({
        geometry: {
          type: 'Point',
          coordinates: [Number(item[xKey]), Number(item[yKey])],
        },
        count: item[zKey],
      })
    })
    // 2.执行加载
    if (arr.length && XE) {
      let toOpts = Object.assign({}, defaultOpts, showOptions, {
        max: Math.max.apply(
          null,
          arr.map((item) => item.count)
        ),
      })
      return loadMapv().then(() => {
        info[tag] = new mapv.DataSet(arr)
        info[tag + 'layer'] = XE.mixins.mapVLayer(
          window.earthObj._viewer,
          info[tag],
          toOpts
        )
        return true
      })
    } else {
      return Promise.resolve(false)
    }
  }

  function unloadHeatmap(tag) {
    let toHandle = info[tag]
    if (toHandle && toHandle.set) {
      toHandle.set([])
      try {
        let lyr = info[tag + 'layer']
        if (lyr && lyr.destroy) {
          lyr.destroy()
        }
      } catch (error) {
        //
      } finally {
        delete info[tag]
        delete info[tag + 'layer']
      }
    }
  }

  // 加载mapv
  function loadMapv() {
    if (window.mapv && XE.mixins.mapVLayer) {
      return Promise.resolve([])
    } else {
      return XE.ready().then(() => XE.HTML.loadMapV())
    }
  }

  return {
    loadHeatmap,
    unloadHeatmap,
  }
}
