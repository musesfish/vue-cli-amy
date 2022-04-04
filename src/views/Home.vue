<template>
  <div class="app-container">
    <router-view :key="activeDate"/>
  </div>
</template>
<script>

export default {
    data(){
        return {
            activeDate: '',
        }
    },
    create(){
      setTimeout(()=> {
        if (window.appLoadDom.style.display != 'none') {
          window.appLoadDom.style.display = 'none'
        }
      }, 6e3)
    },
    methods: {
    }
}
</script>

<style>
    .app-container {
      width: 100%;
      height: 100%;
    }
    .mint-msgbox-message {
      overflow: hidden;
      word-break: break-all;
    }
</style>




