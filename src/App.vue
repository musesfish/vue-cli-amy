<template>
  <div id="app" v-cloak ref="app" >
    <transition name="fade">
      <router-view />
    </transition>
    <pop-mask-offline />
  </div>
</template>

<script>
import PopMaskOffline from './components/popMaskOffline.vue'
export default {
  components: {
    PopMaskOffline
  },
  watch: {
    $route(to){
      this.$nextTick(()=>{
        try {
          // 渣渣IOS
          if (to.path !== 'xxx') {
            this.$refs.app.scrollTop(0, 0)
          }
        } catch {
          //
        }
      })
    },
  },
}
</script>

<style>
@import '~@/assets/font/iconfont.css';
</style>
