<template>
  <div class="wrap">
    <div class="searchbox">
      <form class="m-search-form" @submit="searchEvent">
        <div class="search-wrap" :style="{background:type==1?'#fff':'#F8F8F8'}">
            <div class="search-input">
              <img src="/static/images/icon/search.png" alt>
              <input type="text" v-model="keyWord" :placeholder="placeholder"
              :style="{color:keyWord?'#233':'#BDB7AD',background:type==1?'#fff':'#F8F8F8'}">
            </div>
            <button type="submit" class="search-btn-submit" v-if="showBtn" 
              :style="{background:type==1?'#fff':'#F8F8F8'}">{{btntext}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * 如：<m-search @getData="getClass" :placeholder="placeholder"></m-search>
*/
export default {
  name: 'mSearch',
  data(){
    return {
      showBtn: true,
      keyWord: '',
      btntext:'搜索',
    }
  },
  props: {
    placeholder:String,
    type:Number,
  },
  watch: {
    keyWord: function(){
      // this.showBtn = this.keyWord.length>0?true:false;
      this.btntext = '搜索';
    }
  },
  async created(){
    
  },
  methods: {
    searchEvent: function(e){
      e.preventDefault();
      // this.showBtn = 0;
      if(this.btntext == '取消'){
        this.keyWord = '';
        this.btntext = '搜索';
        this.$emit("getData",this.keyWord);
      }else{
        this.btntext = '取消';
        this.$emit("getData",this.keyWord);
      }
      return false;
    },
  }
}
</script>

<style lang="less" scoped>
  .wrap{
    .searchbox{
        margin-top:1px;
        .search-wrap {
          height:88px;
          border-radius: 44px;
          background: #F8F8F8;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          overflow: hidden;
          padding-left: 27px;
          padding-right: 32px;
          .search-input {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex: 1;
            img{
              width:50px;
              height:50px;
              z-index: 1;
              vertical-align:middle;
              margin-right: 0.2rem;
            }
            .mintui-search {
              position: absolute;
              left: .32rem;
              line-height: .64rem;
            }
            input {
              margin-top: 1px;
              font-size: 14px;/*no*/
              color: #666666;
              border:0px;
              background: #F8F8F8;
              flex: 1;
              width:100%;
              padding-right: 15px;
            }
            input::placeholder {
              color:#BDB7AD!important;
            }
          }
          .search-btn-submit {
            line-height: 17px;/*no*/
            font-size: 17px;/*no*/
            color: #CB9E52;
            background: #F8F8F8;
            font-weight: 650;
            margin-top: 1px;
          }
        }
      }
  }
</style>