<template>
  <div class="popImg" v-if="show" >
    <div class="box" @click="closePop">
      <div class="swiper" v-if="ok">
        <swiper :options="swiperOption" v-if="banner && banner.length">
          <swiper-slide v-for="(value,index) in banner" :key="index">
            <img :src="getImg(value)" :data-src="getImg(value)">
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 如：<pop-imgarr :show="isshow" :banner="imgurls" @closePop="closeImg" :initialSlide="ind" />
*/
export default {
  name: 'popImgarr',
  data(){
    return {
      fileapi: this.$store.state.fileapi,
      isShow:false,
      ok:false,
      swiperOption: {
        slidesPerView: 1,
        initialSlide:0,
        centeredSlides:true,
        autoplay:false,
        speed: 300,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletClass : 'my-bullet'
        },
      }
    }
  },
  props: {
    banner:Array,
    show:Boolean,
    initialSlide:Number,
  },
  watch:{
    initialSlide:{
      immediate: true,
      handler() {
        this.ok = true;
        this.swiperOption.initialSlide = this.initialSlide;
      }
    }
  },
  methods: {
    closePop:function(){
      this.$emit("closePop");
    },
    getImg: function(url) {
      return this.fileapi + url;
    },
  },
}
</script>

<style lang="less" scoped>
  .popImg{
    z-index: 11;
    background-color: rgba(0, 0, 0, .9);
    height: 100%;
    width: 100%;
    position:fixed;
    top:0px;
    left:0px;
    .box{
      width:100%;
      height: 100%;
      .swiper{
        height: 100%;
        display: flex;
        .swiper-slide {
           height: 100%;
           width: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
          img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            -webkit-transition: all 0.5s linear;
            transition: all 0.5s linear;
          }
        }
        .swiper-pagination{
          display: flex;
          width:100%;
          justify-content: center;
          align-items: center;
          margin-top:100px;
        }
      }
    }
  }

</style>