/*
 * @Author: fishScola
 * @Date: 2022-06-24 15:24:34
 * @LastEditors: xionghaiying
 * @LastEditTime: 2024-04-02 09:11:04
 * @Description: UseGlobalMessage - 全局消息处理
 */
// import { AppWebSocket } from '@/utils/websocket.js'

export default function UseGlobalMessage() {
  // 使用推送
  function useWebsocketEvent(eventName, callback) {
    // onMounted(() => {
    //   AppWebSocket.on(eventName, callback)
    // })

    // onBeforeUnmount(() => {
    //   AppWebSocket.off(eventName, callback)
    // })
  }

  // 注册
  function registWSEvent(eventName, callback) {
    // AppWebSocket.on(eventName, callback)
  }

  // 撤销注册
  function unregistWSEvent(eventNameList, callbackFn) {
    ;[].concat(eventNameList || []).forEach((it) => {
      if (it) {
        // AppWebSocket.off(it, callbackFn)
      }
    })
  }

  function getEventList(fromObj) {
    let out = []
    for (const key in fromObj) {
      if (Object.hasOwnProperty.call(fromObj, key)) {
        out = out.concat(fromObj[key])
      }
    }
    return out
  }

  // 取消订阅测站数据
  function unregistStations(toObj, stationPostHandler, deleteProps = true) {
    let toEvents = getEventList(toObj)
    if (toEvents.length) {
      unregistWSEvent(toEvents, stationPostHandler)
      if (deleteProps) {
        for (const key in toObj) {
          if (Object.hasOwnProperty.call(toObj, key)) {
            delete toObj[key]
          }
        }
      }
    }
  }

  var theEventHub = null
  function getEventHub() {
    if (!theEventHub) {
      let vueInst = window.vueInstance
      let vueConfig = vueInst && vueInst.config
      theEventHub = vueConfig && vueConfig.globalProperties.eventHub
    }
    return theEventHub
  }

  // 订阅测站推送消息 - deprecated（废弃，暂时无使用）
  function subscribeWebsocket(toObj, stationPostHandler) {
    // 按类型订阅测站推送
    let callbackFn = ({ type, ids }) => {
      if (ids.length) {
        if (!toObj[type]) {
          toObj[type] = []
        }
        // 逐个订阅该类测站
        let event = ''
        ids.forEach((id) => {
          if (id !== undefined) {
            event = `/station/monitor/${type}/${id}`
            registWSEvent(event, stationPostHandler)
            toObj[type].push(event)
          }
        })
      }
    }

    const eventHub = getEventHub()
    if (eventHub) {
      eventHub.$on('scene-station-regist', callbackFn)
    } else {
      console.error('[subscribeWebsocket]:global target eventHub is empty!')
    }

    onBeforeUnmount(() => {
      if (eventHub) {
        eventHub.$off('scene-station-regist', callbackFn)
      }
      unregistStations(toObj, stationPostHandler)
    })
  }

  // 全局总线消息上 - 订阅与发送
  function doEventSubscribe(eventName, eventHandler) {
    const eventHub = getEventHub()
    if (eventHub) {
      eventHub.$on(eventName, eventHandler)
    } else {
      console.error('[doEventSubscribe]:global target eventHub is empty!')
    }
    onUnmounted(() => {
      if (eventHub) {
        eventHub.$off(eventName, eventHandler)
      }
    })
  }

  function doEventSend(eventName, eventInfo) {
    const eventHub = getEventHub()
    if (eventHub) {
      eventHub.$emit(eventName, eventInfo)
    } else {
      console.error('[doEventSend]:global target eventHub is empty!')
    }
  }

  // 测站订阅与取消订阅
  function doStationRegist({ type, ids, callbackFn }) {
    let out = []
    if (ids && ids.length) {
      // 逐个订阅该类测站
      let event = ''
      ids.forEach((id) => {
        if (id !== undefined) {
          event = `/station/monitor/${type}/${id}`
          registWSEvent(event, callbackFn)
          out.push(event)
        }
      })
    }
    return out
  }

  function doStationUnregist({ type, ids, callbackFn }) {
    let out = []
    if (ids && ids.length) {
      ids.forEach((id) => {
        if (id !== undefined) {
          out.push(`/station/monitor/${type}/${id}`)
        }
      })
    }
    if (out.length) {
      unregistWSEvent(out, callbackFn)
    }
  }

  return {
    useWebsocketEvent,
    subscribeWebsocket,
    // 全局总线消息处理
    doEventSubscribe,
    doEventSend,
    // 测站
    doStationRegist,
    doStationUnregist,
  }
}
