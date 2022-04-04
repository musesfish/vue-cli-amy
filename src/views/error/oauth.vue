<template>
  <div class="container">
    <div class="logo"><img src="/static/images/logo.png" alt="logo"></div>
    <p>微信授权登入失败，请检查网络和设备运行正常后后点击下方按钮授权登录。</p>
    <div @click="reoauth" class="btn-oauth ufb ufb-ac ufb-pc">微信账号登录</div>
  </div>
</template>

<script>
import Api from '@/config/api'
import common from '@/utils/common'
export default {
  data(){
    return {
      shareToken: null
    }
  },
  computed: {
    oauth(){
      return `${Api.wxoauth}${(this.shareToken==null?'':'?shareToken='+this.shareToken)}`
    }
  },
  created(){
    this.shareToken = this.$route.query.shareToken;
    if (window.appLoadDom.style.display != 'none') {
      setTimeout(() => {
          window.appLoadDom.style.display = 'none';
      }, 1500);
    }
  },
  methods: {
    reoauth(){
      location.href = this.oauth
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh;
  padding: 60px;
  font-size: 28px;
  line-height: 48px;
  color: #333;
  text-align: center;
  background: #f8f8f8;
  overflow: auto;
}
.logo {
  margin: 240px auto 120px;
  width: 160px;
  height: 160px;
}
.btn-oauth {
  margin: 60px auto 0;
  width: 240px;
  height: 60px;
  background: linear-gradient(to left , #F3D4A6, #FCEFD5);
  border-radius: 60px;
  color: #613F05;
}
</style>