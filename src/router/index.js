import Vue from 'vue'
import VueRouter from 'vue-router'
import { Router } from './router'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

/* 
* name=share 微信自定义分享页
*/
export default new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: Router
})
