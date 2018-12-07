let start = 0
let regMap = []

class Socket {
  constructor () {
    let self = this
    self.url = process.env.VUE_APP_SOCKET_URL
    self.connect()
    window.onbeforeunload = function () {
      console.log('页面关闭，关闭Websokcet')
      self.ws.close()
    }
  }
  heartbeat () {
    // 维持连接
    setInterval(() => {
      if (start) {
        // ping,Todo
        // register('100000',function(data){
        //   console.log(data)
        // },1)
      }
    }, 2000)
  }
  connect () {
    try {
      let self = this
      self.ws = new WebSocket(self.url)
      console.log('正在连接websocket，地址:', self.url)
      self.ws.onopen = function () {
        console.log('连接websocket服务器成功!', self.ws)
        start = 1
        regMap.map((item) => {
          self.ws.send(item[0])
        })
      }
      self.ws.onmessage = function (e) {
        let cmd = e.data.substr(0, 6)
        regMap = regMap.filter((item) => {
          if (item[0].substr(0, 6) === cmd) {
            let data = JSON.parse(e.data.substr(6))
            item[1](data)
            return !item[2]
          }
          return true
        })
      }
      self.ws.onerror = function (e) {
        console.error('WebSocket发生错误: ', e)
      }
      self.ws.onclose = function (e) {
        start = 0
        console.error('WebSocket关闭，正在重新连接', e)
        self.connect(self.url)
      }
    } catch (e) {
      console.error('浏览器不支持WebSocket', e)
    }
  }
  register (msg, callback, only = 0) {
    let self = this
    regMap.push([msg, callback, only])
    if (start) {
      self.ws.send(msg)
    }
  }
}

export default function (Vue, options) {
  Vue.socket = new Socket(options)
  Object.defineProperties(Vue.prototype, {
    $socket: {
      get () {
        return Vue.socket
      }
    }
  })
}
