import Vue from 'vue'
import axios from "axios"
import App from './App'
import router from './router'
import "./assets/css/common.css"
import "./assets/css/moon.css"
import "./assets/css/moon-main.css"
import "./assets/css/animate.css"
import "./assets/fonts/iconfont.css"
import ElementUI from "element-ui"
import Breadcrumb from "./components/share/Breadcrumb.vue"

Vue.use(ElementUI)

axios.defaults.baseURL = "http://127.0.0.1:484"
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 设置请求拦截器
axios.interceptors.request.use(function (config) {
  const token = window.sessionStorage.getItem("token")
  if(token !== null) {
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

Vue.prototype.$http = axios
// Vue.config.productionTip = false

// 公共组件
Vue.component("com-crumb",Breadcrumb)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
