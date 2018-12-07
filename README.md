##  vue-plugins 使用方法

在vue项目创建plugins目录,建立入口文件index.js

index.js文件

    //按需引入相关的库
    import { http, cookie , storage } from 'esun-vue-plugins'

    const plugins = {
      http, storage, cookie
    }

    export default function (Vue) {
      Object.keys(plugins).forEach((key) => {
        Vue.use(plugins[key])
      })
    }

Vue项目main.js引入

    import plugins from './plugins'
    Vue.use(plugins)


##  统一函数命令

全局采用 Vue.http()，实例采用 this.$http()

##  API

### Http

http简单封装了axios，采用www-form表单提交方式

定义baseURL：

    process.env.VUE_APP_API_URL = '/api' //webpack环境变量

调用方式

    vm.$http(url, data = {}, config = {}).then((res)=>{
        
    })

提供拦截器：`http.interceptors`

举例：

views/login.vue

    vm.$http('user/user/login', {u:'test',p:'123456'}).then((res)=>{
        //todo login
    }


plugins/index.js

    http.interceptors.request.use(
      (config) => {
        let [service, controll, action] = config.url.split('/')
        config.headers.Service = service //service为后端服务路由，nginx做反向代理
        config.url = controll + '/' + action
        return config
      },
      (error) => {
        return Promise.resolve({ code: -1, msg: error }) //统一错误消息
      }
    )
    http.interceptors.response.use(
      (response) => {
        let ret = response.data
        if (ret.code === 100) {
          //Todo logout
        }
        return ret
      },
      (error) => {
        return Promise.resolve({ code: -1, msg: error.message })
      }
    )


