<template>
  <div class="page" id="hometop">
    <m-tabbar/>
    <div>
      I am Homepage
    </div>
    <div class="swiper">
      <swiper :options="swiperOption" v-if="hasBannerData">
        <swiper-slide v-for="(value,index) in banner" :key="index">
          <div @click="jumpurl(value.linkUrl,1)">
            <img :src="imgUrl(value.imgUrl)" :data-src="imgUrl(value.imgUrl)">
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
let vm = null;
export default {
  name: "home",
  data() {
    return {
      //swiper4
      swiperOption: {
        //ios一张图下不轮播
        // slidesPerView: "auto",
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay:{
          disableOnInteraction: false,
        },
        speed: 500,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          bulletClass : 'my-bullet'
        },
        on:{//轮播之后有些点击不跳转
          click:function(){
            if(vm.banner){
              let len = vm.banner.length,
                  ind = this.clickedIndex-1;
              if(ind >= len){
                vm.jumpurl(vm.banner[0].linkUrl,1);
              }else{
                vm.jumpurl(vm.banner[ind].linkUrl,1);
              }
            }
          },
        }
      },
      banner:[],
      hasBannerData: false,
      errImg: 'this.src="' + this.$store.state.errImg + '"',
      fileapi: this.$store.state.fileapi,
      userInfo:{},
    };
  },
  async created() {
    vm = this;
  },
  computed: {
    userinfo(){ return this.$store.state.userinfo}
  },
  mounted(){
    //1 监听滚动事件
    document.getElementById("hometop").addEventListener("scroll", this.handleScroll, true); 
  },
  methods: {
    //2 记录滚动位置
    handleScroll(){
      sessionStorage.setItem("hometop",document.getElementById("hometop").scrollTop);
    },
    //4 设置滚动
    setTop(){
      this.$nextTick(() => {
        document.getElementById("hometop").scrollTop = sessionStorage.getItem("hometop") || 0;
      });
    },
    imgUrl: function(url) {
      return this.fileapi + url;
    },
    jumpurl(url,num){ //跳转
      if(num == 1){
        location.href = url;
      }else if(!url){
        this.$messagebox.alert('此功能开发中，敬请期待~', {title: '温馨提醒',confirmButtonText:'关闭'})
      }else{
        this.$router.push({ path: url});
      }
    },
  },
};
</script>
<style lang="less" scoped>
.page {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  .swiper{
    height: 3.2rem;
    position: relative;
    transform:translate3d(0,0,0);
    .swiper-container{
      border-radius: 6px;/*no*/
    }
    .swiper-slide {
      transform:translate3d(0,0,0);
      img {
        height: 3.2rem;
        overflow: hidden;
        -webkit-transition: all 0.5s linear;
        transition: all 0.5s linear;
      }
    }
    .swiper-pagination{
      display: flex;
      width:100%;
      justify-content: center;
      align-items: center;
      margin-top:0.12rem;
      .swiper-pagination-bullet-active {
          width: 10px;
          border-radius: 2px;
          background-color: #CB9E52!important;
      }
    }
  }
}
</style>

