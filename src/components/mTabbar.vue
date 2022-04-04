<template>
  <mt-tabbar v-model="selected" :fixed='true' @click.native="clickTab" class="bottom-tabbar">
      <mt-tab-item id="/">
        <img slot="icon" src="../../public/static/images/tab/icon-home-hover.jpg" v-if="selected=='/'">
        <img slot="icon" src="../../public/static/images/tab/icon-home.jpg" v-else>
        首页
      </mt-tab-item>
      <mt-tab-item id="/user">
        <img slot="icon" src="../../public/static/images/tab/icon-user-hover.jpg" v-if="selected=='/user'">
        <img slot="icon" src="../../public/static/images/tab/icon-user.jpg" v-else>
        我的
      </mt-tab-item>
    </mt-tabbar>
</template>

<script>
export default {
    name: "Tabbar",
    data(){
        return {
            selected: this.$route.path,
        }
    },
    created(){
        
    },
    methods: {
        clickTab: function(){
            if(this.selected === this.$route.path){
                this.$emit("senData",new Date().getTime());
            }
        }
    },
    watch: {
        '$route': function(val){
            if(this.selected != val.path){
                this.selected = val.path
            }
        },
        selected: function(){
            this.isBack =false;
            this.$router.push({
                path: this.selected
            })
        }
    }
}
</script>

<style lang="less">
    /* tabbar  */
    .bottom-tabbar {
        max-width: 750px; /* no */
        height: 1.12rem;
        box-sizing: content-box;
        background-color: #fff;
        box-shadow:0px 0px 0.16rem rgba(93, 97, 100, 0.11);
        .mint-tab-item {
            // padding: 0.04rem 0;
            padding: 0.1rem 0;
            color:#AAAAAA;
            .mint-tab-item-label{
                font-size: 11px;/*no*/
            }
        }
        .mint-tab-item.is-selected {
            background-color: unset!important;
            color: #101010!important;
        }
        .mint-tab-item-icon {
            margin:0 auto 0.08rem;
        }
    }
/* tabber end */
</style>
