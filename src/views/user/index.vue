<template>
  <div id="usertop" class="page"  >
    <m-tabbar/>
    <div>
      I am User
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      
    }
  },
  computed: {
    userinfo(){ return this.$store.state.userinfo}
  },
  components: {
  },
  async created(){
    //5 刷新其他页面的记录情况
    sessionStorage.setItem("hometop",0);
    sessionStorage.setItem("financetop",0);
    //3 接口请求完并且放到this.$nextTick()内赋值 设置滚动才有效果
    setTimeout(() => {this.setTop();}, 10);
  },
  mounted(){
    //1 监听滚动事件
    document.getElementById("usertop").addEventListener("scroll", this.handleScroll, true); 
  },
  methods: {
    //2 记录滚动位置
    handleScroll(){
      sessionStorage.setItem("usertop",document.getElementById("usertop").scrollTop);
    },
    //4 设置滚动
    setTop(){
      this.$nextTick(() => {
        document.getElementById("usertop").scrollTop = sessionStorage.getItem("usertop") || 0;
      });
    },
  }
}
</script>

<style lang="less" scoped>
.page {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
}
</style>