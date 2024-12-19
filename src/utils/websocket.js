import { getToken } from '@/utils/auth'

const AppWebSocket = (() => {
  const collect = new Map()
  const unregistMap = new Map()
  const registMap = new Map()

  const heartBeat = {
    timer: null,
    interval: 15000,
  }

  const reconnect = {
    timer: null,
    interval: 1500,
    locked: false,
    limit: 20,
    count: 0,
  }

  const generateUrl = (websocketDevUrl = '101.201.220.209') => {
    // 识别协议，针对本地开发环境做连接限定
    let { protocol, host } = window.location
    let toProtocol = protocol.replace(/^http/, 'ws')
    let toHost = host
    if (host.startsWith('192.') || host.startsWith('localhost')) {
      // 本地开发态，连接101开发环境websocket
      toHost = websocketDevUrl
    }
    return `${toProtocol}//${toHost}/api/swms-websocket/comprehensive?blade-auth=${getToken()}`
  }

  const initWebsocket = () => {
    // console.log('--initWebsocket--', new Date().getTime())
    let instance = null
    let wsuri = generateUrl()
    try {
      if ('WebSocket' in window) {
        instance = new WebSocket(wsuri)
      } else if ('MozWebSocket' in window) {
        instance = new MozWebSocket(wsuri)
      } else {
        instance = new SockJS(wsuri)
      }
    } catch (error) {
      console.error('Websocket instance initialize failure!')
    }
    // bind event handlers
    bindHandler(instance)
    return instance
  }

  let bindHandler = (instance) => {
    if (!instance) {
      return
    }
    window.onbeforeunload = () => {
      // console.log('--onbeforeunload--', collect)
      instance.close()
    }

    instance.onopen = () => {
      // console.log('--onopen--')
      if (heartBeat.timer) {
        window.clearInterval(heartBeat.timer)
      }
      heartBeat.timer = window.setInterval(() => {
        instance.send('ping')
      }, heartBeat.interval)
      // 检查并注册，在连接期间注册的事件
      doRegist()
      // 连接建立之后
      doEmitEvent('websocket-opened')
    }

    instance.onclose = () => {
      // console.log('--onclose--')
      window.clearInterval(heartBeat.timer)
      reconnectService()
    }

    instance.onmessage = (back) => {
      // console.log('--onmessage--')
      let dataStr = back.data || ''
      if (dataStr === 'pong') {
        return ''
      } else if (dataStr) {
        let json = arr2Obj(JSON.parse(dataStr))
        let tmp = null
        for (const [event, handler] of collect) {
          if (event && handler && json[event] !== undefined) {
            tmp = json[event]
            ;[].concat(handler).forEach((it) => {
              if (it) {
                it(tmp)
              }
            })
          }
        }
      }
    }

    instance.onerror = () => {
      // console.log('--onerror--')
      reconnectService()
    }
  }

  let reconnectService = () => {
    if (reconnect.locked) {
      return
    }
    window.clearInterval(reconnect.timer)
    reconnect.timer = window.setInterval(() => {
      if (reconnect.limit <= reconnect.count) {
        window.clearInterval(reconnect.timer)
        console.error('Websocket reconnect times out of limit!')
      }
      if (sock) {
        reconnect.locked = false
        window.clearInterval(reconnect.timer)
        reconnect.limit = 20
        reconnect.count = 0
      } else {
        reconnect.locked = true
        reconnect.count++
        sock = initWebsocket()
      }
    }, reconnect.interval)
  }

  let getInstance = () => {
    // console.log('--getInstance--', new Date().getTime())
    if (sock) {
      return sock
    } else {
      sock = initWebsocket()
      return sock
    }
  }

  // 返回数据结构转Obj
  let arr2Obj = (arr, keyProp = 'key', valProp = 'data') => {
    let obj = {}
    ;[].concat(arr).forEach((it) => {
      if (it) {
        obj[it[keyProp]] = it[valProp]
      }
    })
    return obj
  }

  // 获取Map的键列表
  let getMapKeys = (inMap) => {
    let out = []
    for (const key of inMap.keys()) {
      if (key !== undefined) {
        out.push(key)
      }
    }
    return out
  }

  // 通过获取的全局事件总线对象，发送相关消息
  let doEmitEvent = (name, info) => {
    let vueInst = window.vueInstance
    let vueConfig = vueInst && vueInst.config
    let eventHub = vueConfig && vueConfig.globalProperties.eventHub
    if (eventHub) {
      eventHub.$emit(name, info)
    }
  }

  // 执行事件注册
  let doRegist = (inMap = registMap) => {
    if (inMap.size) {
      let flag = sendMessage(
        getMapKeys(inMap).map((it) => {
          return {
            receiveType: 'registry',
            path: it,
          }
        })
      )
      if (flag) {
        inMap.clear()
      }
    }
  }

  // 发送消息 - 消息发送失败，后续择机重发
  let sendMessage = (msg) => {
    if (sock.readyState === WebSocket.OPEN) {
      sock.send(typeof msg === 'string' ? msg : JSON.stringify(msg))
      return true
    }
    return false
  }

  var sock = getInstance()

  return {
    on: function (event, handler) {
      let old = collect.get(event)
      if (old) {
        // 允许多个回调，只需要注册一次
        // console.error(`Event name called ${event} is already registed!`)
        collect.set(event, [].concat(old).concat(handler))
      } else {
        // registMap - 注册事件用 | collect - 具体执行事件回调时，匹配到事件路径即可（允许多个回调处理）
        collect.set(event, [].concat(handler))
        registMap.set(event, true)
      }
      // 订阅消息允许重复发送
      window.setTimeout(doRegist, 1200)
    },
    off: function (event, handler) {
      let old = [].concat(collect.get(event) || [])
      if (old.length) {
        old = old.filter((it) => it !== handler)
        collect.set(event, old)
      }
      // 对应的事件没有回调处理即可移除
      if (old.length < 1) {
        collect.delete(event)
        unregistMap.set(event, true)
      }
      // 2s后再行批量取消订阅
      window.setTimeout(() => {
        if (unregistMap.size) {
          let flag = sendMessage(
            getMapKeys(unregistMap).map((it) => {
              return {
                receiveType: 'un_registry',
                path: it,
              }
            })
          )
          if (flag) {
            unregistMap.clear()
          }
        }
      }, 2500)
    },
    send: function (dataStr) {
      if (dataStr) {
        return sendMessage(dataStr)
      }
    },
  }
})()

export { AppWebSocket }
