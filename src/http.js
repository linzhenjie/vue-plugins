import axios from 'axios'

let config = {
  withCredentials: true, // 让ajax携带cookie
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 12 * 1000,
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [
    (data) => {
      if (!data) return
      if (data.constructor === FormData) return data
      let ret = ''
      for (let it in data) {
        if (data[it] === null || data[it] === undefined)  continue
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }
  ]
}

const _axios = axios.create(config)

export default {
  interceptors: _axios.interceptors,
  install(Vue) {
    Vue.http = function(url, data = {}, config = {}) {
      config.data = data
      return _axios(url, config)
    }
    Object.defineProperties(Vue.prototype, {
      $http: {
        get() {
          return Vue.http
        }
      }
    })
  }
}
