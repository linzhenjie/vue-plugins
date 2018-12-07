import Vue from 'vue'

let toast = new Vue({
  template: '<div class="popup-toast" :class="{\'hide\':!toast}" v-html="toast"></div>',
  data: function () {
    return {
      toast: null
    }
  },
  render(h) {
    return h('div', { class:
      { 'popup-toast': true, 'hide': !this.toast }
    }, this.toast)
  },
  methods: {
    show (str, timeout = 2000) {
      let vm = this
      vm.toast = str
      setTimeout(() => {
        vm.toast = null
      }, timeout)
    }
  }
}).$mount()

let isAppend = false

export default function (Vue) {
  Vue.prototype.$toast = function (...params) {
    Vue.nextTick(() => {
      if (!isAppend) {
        this.$root.$el.appendChild(toast.$el)
        isAppend = true
      }
      toast.show.apply(this, params)
    })
  }
}
