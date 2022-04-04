<template>
  <div class="page-user-share" v-if="bgImg">
    <div class="poster-box">
      <div ref="capture">
        <div class="test-demo">占位文本</div>
        <div class="main_img-box">
          <img
            v-if="bgImg"
            :src="bgImg"
            @load="loadBgImg"
            @error="isLoadMainImg=false"
            crossorigin="anonymous"
            alt=' '
          >
        </div>
        <div class="user-message-box ufb ufb-ac">
          <div class="user-message-left_box ufb-f1">
            <img class="avatar" :src="avatar" @error="isLoadAvatar=false"  @load="isLoadAvatar=true" alt=" " crossorigin="anonymous" />
            <div class="msg-name">来自{{wxName}}的推荐</div>
            <p class="text-sub">xxx-xxx-xxx</p>
          </div>
          <img class="bg-icon" src="/static/images/img.png" alt="">
          <img class="bg-icon-r" src="/static/images/img.png" alt="">
          <div class="text-bg"><img src="/static/images/img.png" alt=""></div>
          <div class="code-img">
            <img
              v-if="qrcode"
              :src="qrcode"
              @load="loadQrcode"
              @error="isLoadQRcode=false"
              crossorigin="anonymous"
              alt=' '
            />
            <img class="qrcode-logo" src="/static/images/logo.png" alt="">
          </div>
        </div>
      </div>
      <div class="poster-img" data-html2canvas-ignore >
        <img :src="poster" @load="isRendersPosterEnd=true">
      </div>
    </div>
    <div class="loading-mask" v-if="showLoading"></div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import PosterServe from '@/server/poster'
export default {
  wathch: {
    bgImg(){
      this.qrcode=null;
      this.poster=null;
      this.isRendersPosterEnd=false;
      this.isLoadMainImg=false;
      this.isLoadQRcode=false;
      this.setQrcode()
    }
  },
  data() {
    return {
      bgImg: null,
      posterType: null,
      qrcode: null,
      poster: null,
      isRendersPosterEnd: false,
      isLoadMainImg: false,
      isLoadQRcode: false,
      text: false
    };
  },
  computed: {
    avatar(){ return `${this.userinfo.headImgUrl}`},
    wxName(){ return this.userinfo.wxName.length>7? `${this.userinfo.wxName.substr(0,7)}...`: this.userinfo.wxName },
    token(){ return this.$store.state.token },
    userinfo(){ return this.$store.state.userinfo },
    fileapi(){ return this.$store.state.fileapi},
    showLoading(){ return !this.isLoadAllImg||!this.isRendersPosterEnd?true:false },
    isLoadAllImg(){
      const bol = this.isLoadMainImg&&this.isLoadQRcode;
      if(bol){ this.rendersPoster() }
      return bol;
    },
  },
  methods: {
    loadQrcode(){ this.isLoadQRcode = true; },
    loadBgImg(){ this.isLoadMainImg = true; },
    rendersPoster: function() {
      const capture = this.$refs.capture; 
      
      // 放大图片提高清晰度
      const scale = window.devicePixelRatio*2; // 放大倍数
      const canvas = document.createElement("canvas");
      canvas.width = capture.offsetWidth * scale;       //定义canvas 宽度 * 缩放
      canvas.height = capture.offsetHeight * scale;  //定义canvas高度 *缩放
      canvas.style.width = (capture.offsetWidth) + "px";  
      canvas.style.height = (capture.offsetHeight) + "px";
      const ctx = canvas.getContext("2d");
      // ctx.scale(scale, scale);
      html2canvas(capture, {
        canvas: canvas,
        imageTimeout: 1500,
        backgroundColor: 'transparent',
        allowTaint: false,
        useCORS: true,
        logging: false,
        scale: scale,
        width: capture.offsetWidth,
        height: capture.offsetHeight - 4,
        ignoreElements() {
          return false;
        }
      }).then(canvas => {
        ctx.translate(0,0)
        this.isRendersPosterEnd = false;
        this.poster = canvas.toDataURL();
      });
    },
    async beforeSetCode(){
      let qrcodeUrl = `${location.origin}/club/member?shareToken=${this.token}&v=${+new Date()}`; 
      const res_poster = await PosterServe.getPoster.bind(this)({ type: 2 })
      if (res_poster.ret !== 100 ) return false;
      this.bgImg = `${this.fileapi}${res_poster.data}`;
      this.setQrcode(qrcodeUrl);
    },
    async setQrcode(qrcodeUrl){
      if (!qrcodeUrl) return false;
      this.qrcodeUrl = qrcodeUrl;
      QRCode.toDataURL(qrcodeUrl, {})
        .then(url => {
          this.qrcode = url;
          this.wx({
            title: 'xxx',
            desc: 'xxx-xxx',
            link: qrcodeUrl,
            imgUrl: `${location.origin}/static/images/logo.png`
          });
        })
        .catch(err => {
          throw err;
        });
    }
  },
  async created() {
    // document.body.dataset.scroll = 1;
    await this.beforeSetCode()
  },
  beforeDestroy(){
    // document.body.dataset.scroll = 0;
  }
};
</script>

<style lang="less" scoped>
.code-img {
  position: relative;
  width: 184px;
  height: 184px;
  border: 2px solid #D0A253;
}
.page-user-share {
  position: relative;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  .poster-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #f8f8f8;
    user-select: none;
    img {
      border: 0;
    }
  }
  .poster-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    user-select: all;
  }
}
.user-message-box {
  position: relative;
  padding: 0 30px;
  height: 240px;
  background: #fff;
  box-sizing: content-box;
}
.bg-icon {
  position: absolute;
  left: 30px;
  top: 200px;
  width: 40px;
  height: 18px;
}
.bg-icon-r {
  position: absolute;
  left: 480px;
  top: 30px;
  width: 40px;
  height: 18px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
}
.msg-name {
  margin-top: 12px;
  font-size: 30px;
  color: #010101;
}
.text-sub {
  margin-top: 6px;
  padding-bottom: 33px;
  font-size: 24px;
  color: #D1A354;
}
.qrcode-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transform: translate(-20px, -20px);
}
.text-bg {
  position: absolute;
  bottom: 30px;
  right: 230px;
  width: 82px;
  height: 74px;
}
.main_img-box {
  width: 100%;
  min-height: 960px;
}
.test-demo {
  position: absolute;
  top: 0;
  color: transparent;
}
</style>
