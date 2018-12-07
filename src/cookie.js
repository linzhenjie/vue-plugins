class Cookie {
  get (name) {
    let len = name.length
    let max = document.cookie.length
    if (max < len + 1) return
    let start = document.cookie.indexOf(name + '=')
    if (start < 0) return
    start = start + len + 1
    let end = document.cookie.indexOf(';', start)
    if (end < 0) end = max
    return unescape(document.cookie.substring(start, end))
  }
  set (name, value, time = null, path = '/') {
    var exdate = new Date()
    exdate.setTime(exdate.getTime() + (time * 1000))
    document.cookie = name + '=' + escape(value) +
      ((time === null) ? '' : ';expires=' + exdate.toGMTString()) +
      (process.env.DOMAIN ? ';domain=' + process.env.DOMAIN : '') +
      (';path=' + path)
  }
  del (name) {
    return this.set(name, null, -1)
  }
}

export default function (Vue, options) {
  Vue.cookie = new Cookie(options)
  Object.defineProperties(Vue.prototype, {
    $cookie: {
      get () {
        return Vue.cookie
      }
    }
  })
}
