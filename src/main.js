/* global appLoadDom */

import Vue from 'vue'
import store from './store/store.js'
import wxConfig from './utils/wxConfig.js'
import App from './App.vue'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from './utils/axios'
import common from './utils/common'

import 'swiper/dist/css/swiper.css'
import './assets/css/global.less'
import './assets/css/mint-ui.css'

import Mint from 'mint-ui';
import Vant, { Loading } from 'vant';

//引入echart
Vue.prototype.$echarts = require("echarts")

import Vconsole from 'vconsole';

if (common.getQueryString('debug')==='1') {
    new Vconsole()
}

Vue.use(Mint);
Vue.use(Vant.Popup);
Vue.use(Vant.Picker);
Vue.use(Vant.Lazyload);

axios.init(router, store)

import mTabbar from "./components/mTabbar"
import datePicker from "./components/datePicker"
import mSearch from "./components/mSearch"

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
    // 处理错误
    // `info` 是 Vue 特有的错误信息，例如，错误是在哪个生命周期钩子函数中发现的。
    // info 只在 2.2.0+ 可访问
    if (err) {
        throw `${err} ${info} ${vm}`
    }
}

Vue.prototype.common = common
Vue.use(VueAwesomeSwiper)
Vue.component("m-tabbar", mTabbar)
Vue.component('m-datePicker', datePicker) 
Vue.component('m-search', mSearch) 
window.entryUrl = location.href; // 记录ios入口链接
window.debounce_wx = null;

common.ios_stopDrop()
// ios返回上一页不执行JS
if ((common.equipmentType()||'').toLocaleLowerCase() === 'ios') {
    window.onpageshow = function (e) {
        if (e.persisted) {
            window.location.reload()
        } 
    } 
}
// 授权验证 
router.beforeEach(async (to, from, next) => {
    console.log('beforeEach-to',to)
    next();
    // if (to.path === '/oauth') {
    //     next();
    //     return false;
    // }
})

router.afterEach((to) => {
    console.log('afterEach-to',to)
    if (to.path !== '/oauth') common.resportLogs(`切换路由：${to.fullPath}`)
    if (!to.meta.isShare && !to.meta.noShare) {
        wxConfig(); // 微信分享-通用配置
    }
    document.title = to.meta.title || 'vue-cli-amy'
    window.scrollTo(0, 0);
    document.querySelector('#app').scrollTop = 0
})

Vue.prototype.wx = wxConfig; // 微信分享
Vue.prototype.store = store;


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
