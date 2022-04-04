<template>
  <div :class="{wrap:true,disabled:obj.disabledcss}">
    <div :class="{bks:true,bkss:obj.type == 'textarea',bbor:obj.bor,}">
      <div class="tatle" :style="{paddingRight:obj.wid ? obj.wid : '0rem',}">
        <span v-if="obj.required">*</span>
        {{obj.name}}
      </div>
      <div v-if="obj.type=='radio'" class="radio">
        <ul>
          <li v-for="(vals,inds) in obj.arr" :key="inds" :class="{active:vals.value == obj.value}" @click="changeFn(inds)">
            <span class="dot"><i></i></span>
            <span>{{vals.name}}</span>
          </li>
        </ul>
      </div>
      <div v-if="obj.type=='choose'">
        <van-field
          @click="showFn"
          colon
          label-align="right"
          v-model="obj.value"
          :placeholder="obj.placeholder"
          :rules="[{ required: obj.required }]"
          :error="obj.error"
          :disabled=true
        />
        <van-action-sheet v-model="show" :actions="obj.arr" @select="selFn" />
      </div>
      <div :class="{btatle:true,gold:obj.gold}" v-else>
        <van-field
          colon
          :show-word-limit="obj.type == 'textarea'"
          label-align="right"
          v-model="obj.value"
          :placeholder="!obj.disabled?obj.placeholder:''"
          :rules="[{ required: obj.required }]"
          :error="obj.error"
          @input="inputFn"
          @blur="inputFn('blur')"
          :maxlength=obj.maxlength
          :disabled="obj.disabled"
          :type="obj.type"
        />
      </div>
    </div>
    <div v-if="obj.error" class="field-tips-error">* {{obj.errmsg}}</div>
    <div v-if="obj.tip" class="field-tips-error">{{obj.tip}}</div>
  </div>
</template>

<script>
/**
 * 如：<m-input listname = "list" :obj = "{...val,ind}" @setVal="setVal"></m-input>
 * listname: ""
 * obj: {}
 * setVal: ()=>{}
 */
import Vue from "vue";
import { ActionSheet,Field} from "vant";
Vue.use(ActionSheet);
Vue.use(Field);
export default {
  name: 'mInput',
  data(){
    return {
      show:false,
    }
  },
  props: {
    listname:String,
    obj:{
      default:{},
      type:Object,
    }
  },
  created(){

  },
  methods: {
    changeFn(inds){
      this.$emit("setVal",{obj:{...this.obj,listname:this.listname},radio:{...this.obj.arr[inds]}});
    },
    showFn(){
      this.show = true;
    },
    selFn(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false;
      this.$emit("setVal",{obj:{...this.obj,listname:this.listname},choose:{...item}});
    },
    inputFn(fntype){
      if(fntype == 'blur'){
        this.$emit("setVal",{obj:{...this.obj,listname:this.listname,fntype}});
      }else{
        this.$emit("setVal",{obj:{...this.obj,listname:this.listname,}});
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .radio{
    ul{
      display: flex;
      flex-direction: row;
      font-size: 30px;
      margin-left: 30px;
      li{
        color:#666666;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 60px;
        .dot{
          margin-right: 15px;
          width:30px;
          height:30px;
          border-radius: 30px;
          background: #F8F8F8;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          i{
            width:10px;
            height:10px;
            border-radius: 10px;
            background: #DBDBDB;
            display: inline-block;
          }
        }
      }
      .active{
        color:#CB9E52;
        .dot{
          background: #613F05;
          i{
            background: #CB9E52;
          }
        }
      }
    }
  }
  .disabled{
    .bks{
      background: #F0EEEA!important;
      ::v-deep .van-cell{
        background: #F0EEEA!important;
      }
    }
  }
  .wrap{
    .bbor{
      border:2px solid #F8F8F8;
    }
    .bks {
      height: 90px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      border-radius: 12px;
      padding: 30px 0;
      background: #fff;
      .btatle{
        flex: 3;
        width:100%;
      }
      .tatle {
        padding-left: 33px;
        font-size: 28px;
        color: #101010;
        // font-weight: bold;
        span {
          color: #cb9e52;
        }
      }
      ::v-deep .van-field__control{
        color:#101010!important;
        font-size: 28px!important;
        height:38px!important;
        line-height:38px!important;
      }
      ::v-deep .van-cell{
        padding-right:0px;
        border-radius: 12px;
      }
      .gold{
        ::v-deep .van-field__control{
          color:#CB9E52!important;
          font-size: 28px!important;
          height:38px!important;
          line-height:38px!important;
        }
        ::v-deep input.van-field__control:disabled{
          color:#CB9E52!important;
          -webkit-text-fill-color:#CB9E52!important;
        }
      }
    }
    .bkss{
      flex-direction: column;
      min-height: 148px;
      align-items:flex-start;
      .btatle{
        margin-bottom: 300px;
      }
      ::v-deep .van-cell{
        padding-right: 20px!important;
      }
    }
    ::-webkit-input-placeholder {
      color: #666;
      font-size: 28px;
    }
    /* Firefox 4-18 */
    :-moz-placeholder {
      color: #666;
      font-size: 28px;
    }
    /* Firefox 19-50 */
    ::-moz-placeholder {
      color: #666;
      font-size: 28px;
    }
    /* - Internet Explorer 10–11
    - Internet Explorer Mobile 10-11 */
    :-ms-input-placeholder {
      color: #666 !important;
      font-size: 28px !important;
    }
    /* Edge (also supports ::-webkit-input-placeholder) */
    ::-ms-input-placeholder {
      color: #666;
      font-size: 28px;
    }
    /* CSS Working Draft */
    ::placeholder {
      color: #666;
      font-size: 28px;
    }
  }
</style>