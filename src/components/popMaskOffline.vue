<template>
  <div class="mask-offline" v-if="visibility">
    <div class="offline-card-msg ufb ufb-ver ufb-pc" :class="offline_classname">
      <svg t="1626502302813" class="icon-offline-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2454" width="200" height="200"><path d="M196.821333 136.96l4.010667 3.541333 725.333333 725.333334a42.666667 42.666667 0 0 1-56.32 63.872l-4.010666-3.541334L682.666667 743.04V789.333333a64 64 0 0 1-128 0v-174.293333L140.501333 200.832a42.666667 42.666667 0 0 1 56.32-63.872zM192 682.666667A64 64 0 0 1 256 746.666667v42.666666a64 64 0 0 1-128 0v-42.666666A64 64 0 0 1 192 682.666667z m213.333333-170.666667a64 64 0 0 1 64 64v213.333333a64 64 0 0 1-128 0v-213.333333A64 64 0 0 1 405.333333 512z m426.666667-341.333333A64 64 0 0 1 896 234.666667v480.298666l-128-128V234.666667A64 64 0 0 1 832 170.666667z m-213.333333 170.666666A64 64 0 0 1 682.666667 405.333333v96.298667l-122.453334-122.410667A64 64 0 0 1 618.666667 341.333333z" fill-opacity=".87" p-id="2455"></path></svg>
      <p class="text-offline">网络连接中断</p>
    </div>
  </div>
</template>

<script>
/**
 * 如：<pop-mask-offline />
*/
export default {
  data(){
    return {
      visibility: false,
    }
  },
  computed: {
    offline_classname(){ return this.visibility?'offline_enter': ''; }
  },
  created(){
    window.addEventListener('online', () => {
      this.visibility = false;
    })
    window.addEventListener('offline', () => {
      this.visibility = true;
    })
  }
}
</script>

<style lang="less" scoped>
.mask-offline {
  --mask-offline-size: 420px;
  --mask-offline-size_neg: -420px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .3);
}
.offline-card-msg {
  margin: 0 auto;
  width: var(--mask-offline-size);
  height: var(--mask-offline-size);
  padding: 30px;
  border-radius: 24px;
  overflow: hidden;
  background: #f8f8f8;
  transform: translate(0, var(--mask-offline-size_neg));
  &.offline_enter {
    animation: offline_enter 320ms ease-in-out forwards;
  }
}
.icon-offline-svg {
  display: block;
  margin: 0 auto;
  width: 180px;
  height: 180px;
  fill: #333;
}
.text-offline {
  margin-top: 20px;
  color: #333;
  font-size: 28px;
  text-align: center;
}
@keyframes offline_enter {
  0% { }
  100% { transform: translate(0, 150px); }
}
</style>