<template>
  <div class="picker">
    <div v-if="modalshow" class="modal" @click.stop="showModal">
      <div class="box">
        <div class="tops">
          <span class="title">选择切换选项</span>
          <div class="changebox" @click.stop="showModal">
            <span>切换</span>
            <img :src="upurl" alt="">
          </div>
        </div>
        <div class="neck">
          <div class="oneneck" @click="seltype(1)">
            <span>按月</span>
            <div class="imgbox">
              <img :src="type==1?yellow:gray" alt="">
            </div>
          </div>
          <div class="oneneck" @click="seltype(2)">
            <span>按季度</span>
            <div class="imgbox">
              <img :src="type==2?yellow:gray" alt="">
            </div>
          </div>
          <div class="oneneck" @click="seltype(3)">
            <span>按年</span>
            <div class="imgbox">
              <img :src="type==3?yellow:gray" alt="">
            </div>
          </div>
        </div>
        <div class="bottom" v-if="type != 3">
          <div v-for="(val,ind) in years" :key="ind" 
            @click="selectYear(val.value)"
            :class="{seldiv:seletedYear==val.value}"
          >
          {{val.value}}
          </div>
        </div>
      </div>
    </div>
    <div v-if="type==1" class="wbox">
      <div class="top">
        <div class="topleft">{{(tab<10)?('0'+tab):tab}}</div>
        <div class="topright">
          <div>{{enday}}</div>
          <div>{{enmonth}} {{seletedYear}}</div>
        </div>
        <div v-if="mode==1" class="changebox" @click="showModal">
          <span>切换</span>
          <img :src="downurl" alt="">
        </div>
      </div>
      <div class="wrapbox" ref="wrapbox"> 
        <!-- <div class="srcolldiv" :style="{width:(data.length*55+10)*2/100+'rem'}"> -->
        <div class="srcolldiv" :style="{width:(data.length*58+10)*2/100+'rem'}">
          <div v-for="(value,index) in data" :key="index" :class="{onebox:true,active:tab==value.value}" 
            @click="changeTab(index)">
            <div class="label">{{value.label}}</div>
            <div class="en">{{value.en}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type==2" :class="{wbox2:mode!=1,wbox:mode==1}">
      <div class="tops mb" v-if="mode==1">
        <span class="title">季度利润表</span>
        <div v-if="mode==1" class="changebox" @click="showModal">
          <span>切换</span>
          <img :src="downurl" alt="">
        </div>
      </div>
      <div class="wrapbox">
        <div class="srcolldiv" style="marginLeft:-30px;">
          <div v-for="(value,index) in data" :key="index" :class="{onebox:true,active:tab==value.value}"  
          @click="changeTab(index)">
            <div class="label2">{{value.label.slice(0,2)}}</div>
            <div class="label2s">{{value.label.slice(2)}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type==3" :class="{wbox3:mode!=1,wbox:mode==1}">
      <div class="tops mb" v-if="mode==1">
        <span class="title">年度利润表</span>
        <div v-if="mode==1" class="changebox" @click="showModal">
          <span>切换</span>
          <img :src="downurl" alt="">
        </div>
      </div>
      <div class="wrapbox" ref="wrapbox1">
        <!-- <div v-if="type==3" class="srcolldiv" :style="{width:(data.length*55+10)*2/100+'rem'}"> -->
        <div v-if="type==3" class="srcolldiv" :style="{width:(data.length*58+10)*2/100+'rem'}">
          <div v-for="(value,index) in data" :key="index" :class="{onebox:true,active:tab==value.value}" 
          @click="changeTab(index)">
            <div class="label3">{{value.label.slice(0,2)}}</div>
            <div class="label3">{{value.label.slice(2)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 如：<m-datePicker :type=1 :tab=6 @getTab="getTab" :disabled=true :utilMonth=8 />
 * type: 1 月 2 季度 3年份
 * tab: 当前选中时间值
 * seletedYear: 当前选中年份 （利润表）
 * disabled:  true:无法选中其他月份  默认false
 * mode:  1:有切换按钮(年 季度 月) 0:无切换按钮（仅月的）  默认0
 * 季度的值: 一季度 1 二季度 2 三季度 3 四季度 4
 * （不设置preMonth utilMonth 展示的是12个月）
 * preMonth:  展示前个月的月份，不显示之后的月份 默认true
 * utilMonth:  如 11:显示11月(包含11)之前所有月份 (utilMonth 优先级高于 preMonth 两者不共存)
 * ( 刚好是一月份 则展示上一年的十二个月 最佳使用：如 profitState.vue 一样对tab seletedYear 先行判断赋值 )
 */
import Common from '@/utils/common';
export default {
  name: 'datePicker',
  data(){
    return {
      NowMonth: Common.getDateStr(0).mon, //上个月份（不变）
      NowYear: Common.getDateStr(0).year, //当前年份（不变）
      years:[],
      yellow:"/static/images/finance/duiy.png",
      gray:"/static/images/finance/duig.png",
      upurl:"/static/images/finance/up.png",
      downurl:"/static/images/finance/down.png",
      modalshow:false,
      enday:'Mon',
      enmonth:'Jan',
      data:[],
      distance:Common.nowSize(30),
    }
  },
  props: {
    seletedYear:{
      default:new Date().getFullYear(),
      type:Number,
    },
    mode:Number,
    type:Number,
    tab:Number,
    utilMonth:Number,
    disabled:Boolean,
    preMonth:{
      default:true,
      type:Boolean,
    },
  },
  watch: {
    tab: {
      immediate: true,
      handler() {
        this.type == 3 && this.$refs.wrapbox1 && (this.$refs.wrapbox1.scrollLeft = (this.tab-this.data[0].value)*this.distance)
        this.type == 1 && this.$refs.wrapbox && (this.$refs.wrapbox.scrollLeft = (this.tab-1)*this.distance);
        this.enmonth = Common.getMonthEnText(this.tab-1);
      }
    },
    type: {
      immediate: true,
      handler() {
        if(this.mode == 1) this.changeData();
      }
    },
    utilMonth:{
      immediate: true,
      handler() {
        this.changeData();
      }
    }
  },
  updated:function(){
    this.$nextTick(() => {
      this.type == 3 && this.$refs.wrapbox1 && (this.$refs.wrapbox1.scrollLeft = (this.tab-this.data[0].value)*this.distance)
    })
  },
  mounted(){
    this.type == 1 && (this.$refs.wrapbox.scrollLeft = (this.tab-1)*this.distance)
    this.type == 3 && this.$refs.wrapbox1 && (this.$refs.wrapbox1.scrollLeft = (this.tab-this.data[0].value)*this.distance)
  },
  created(){
    this.years = Common.LISTYEAR();
  },
  methods: {
    seltype(num){
      this.$emit("seltype",num);
    },
    selectYear(val){
      this.$emit("changeyear",val);
    },
    showModal(data){
      if(Common.equipmentType() == 'ios'){
        this.modalshow = !this.modalshow;
      }else{
        if(data.path[0].className == 'modal' || data.path[1].className == 'changebox' ){
          this.modalshow = !this.modalshow;
        }
      }
    },
    changeData(){
      if(this.type==3){ // 年
        this.data = Common.LISTYEAR();
        this.tab || (this.tab = 2019);
      }else if(this.type==2){ //季度
        this.data = Common.getListDate().LISTQUARTER;
        this.tab || (this.tab = 1);
      }else{ //月
        this.data = Common.getListDate().LISTMONTH;
        if(this.utilMonth){
          this.data = this.data.slice(0,this.utilMonth); 
        }else if(this.seletedYear == this.NowYear && this.preMonth){ // 当前年份之下 preMonth为true的 当前月及之后月份不予以展示
          this.data = this.data.slice(0,this.NowMonth);
        }
        let nowDate = new Date();
        this.enday = Common.getWeekEnText(nowDate.getDay()-1);
        this.enmonth = Common.getMonthEnText(this.tab-1);
      }
    },
    changeTab(ind){
      if(this.disabled){return false;}
      let value = this.data[ind].value;
      if(this.mode == 1){//有多种时间类型的
        this.$emit("getTab",{value,year:this.seletedYear,type:this.type});
      }else{
        this.$emit("getTab",{value});
      }
    },
  }
}
</script>

<style lang="less" scoped>
.picker{
  .changebox{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 29px;
    span{
      font-size: 30px;
      color:#CB9E52;
      padding-right: 12px;
    }
    img{
      width:30px;
      height:18px;
      margin-top: 2px;
    }
  }
  .tops{
    height:109px;
    display: flex;
    justify-content: space-between;
    align-items:center;
    background: #fff;
    .title{
      font-weight: bold;
      color:#101010;
      font-size: 32px;
      padding-left: 30px;
    }
  }
  .mb{
    margin-bottom: 10px;
  }
  .modal{
    z-index: 999;
    min-height: 100vh;
    overflow-y: auto;
    position: absolute;
    top:0px;
    left:0px;
    background: rgba(00, 00, 00, .25);
    width:100%;
    .box{
      background: #F8F8F8;
      padding-bottom: 40px;
    }
    .neck{
      background: #F8F8F8;
      padding-left: 4%;
      margin-top: 38px;
      .oneneck{
        width:690px;
        height:88px;
        border-radius: 12px;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0 34px;
        margin-top: 20px;
        span{
          // color:#1A3059;
          color:#101010;
          font-size: 28px;
        }
        .imgbox{
          flex: 1;
          display: flex;
          justify-content: flex-end;
          img{
            width:26px;
            height:26px;
          }
        }
      }
    }
    .bottom{
      display: flex;
      background: #F8F8F8;
      flex-wrap: wrap;
      padding-left: 4%;
      padding-top: 30px;
      padding-bottom: 23px;
      div{
        height:80px;
        width:158px;
        border-radius: 12px;/*no*/
        background: #D4D4D4;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 20px;
        font-weight: bold;
        color:#fff;
      }
      .seldiv{
        background: #CB9E52;
      }
    }
  }
  .wbox{
    height:270px;
    overflow:hidden;
    // background: red;
  }
  .wbox2{
    height:200px;
    overflow:hidden;
    // background: green;
    padding-top: 60px;
  }
  .wbox3{
    height:200px;
    overflow:hidden;
    // background: blue;
    padding-top: 60px;
  }
  .top{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 40px;
    padding-top: 25px;
    padding-bottom: 25px;
    .topleft{
      font-size: 68px;
      color:#613F05;
      font-weight: bold;
      padding-right: 12px;
    }
    .topright{
      font-size: 30px;
      color:#613F05;
      line-height: 0.3rem;
      flex: 1;
    }
  }
  .wrapbox{
    overflow-x: auto;
    overflow-y: hidden;
    height:200px;
    .srcolldiv{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-right:20px;
      position: relative;
      .onebox{
        border-radius: 30px;
        width:95px;
        height:100px;
        text-align: center;
        flex-shrink: 0;
        white-space: nowrap;
        background: #F8F8F8;
        margin-left:20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-bottom: 2px;
        .label{
          font-size: 38px;
          line-height: 42px;
          color:#613F05;
          // font-weight: bold;
        }
        .label2{
          font-size: 30px;
          line-height: 34px;
          color:#613F05;
          // font-weight: bold;
        }
        .label2s{
          font-size: 20px;
          line-height: 24px;
          color:#D4C9B7;
        }
        .label3{
          font-size: 32px;
          line-height: 36px;
          color:#613F05;
          // font-weight: bold;
        }
        .en{
          font-size: 20px;
          line-height: 24px;
          color:#D4C9B7;
        }
      }
      .active{
        background: #CB9E52;
        .label,.label2,.label2s,.label3,.en{
          color:#fff;
          // font-weight: bold;
        }
        .label3{
          // font-size:38px;
        }
        .label2{
          font-size: 38px;
          line-height: 42px;
        }
        .label1{
          font-size: 38px;
        }
      }
      .active::after{
        content: "";
        width: 12px;
        height:12px;
        border-radius: 12px;
        background: #613F05;
        position: absolute;
        bottom:-6px;
        border:1px solid #fff;
      }
    }
  }
}
</style>