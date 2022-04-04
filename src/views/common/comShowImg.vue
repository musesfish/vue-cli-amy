<!-- 查看附件 -->
<template>
  <div class="annex-box ufb ufb-ver">
    <div class="annex-list-wrap ufb-f1 ">
      <ul class="annex-list ufb">
        <li class="annex-item ufb ufb-ac ufb-pc" v-for="(i,ind) in files" :key="ind">
          <img @click="handlePreView(ind)" :src="i" alt="">
        </li>
      </ul>
      <div v-if="files.length>0" class="text-tip">长按图片保存至本地</div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  name: 'comShowImg',
  data(){
    return {
      files:[],
    }
  },
  computed: {
    fileapi(){
      const localPath = ['localhost', 'xxx', 'xxx'];
      const hostname = window.location.hostname;
      const hasLocal = localPath.some( i=> i.indexOf(hostname) !== -1)
      return hasLocal? 'xxx': this.$store.state.fileapi;
    },
  },
  created(){
    this.files = JSON.parse(this.$route.query.arr);
    this.files.forEach((v,i)=>{
      this.files[i] = this.fileapi+v;
    })
  },
  methods: {
    handlePreView(ind){
      this.index = ind;
      ImagePreview({
        images: this.files,
        startPosition: ind,
        onClose: () => {},
      });
    },
    handleSelect(ind){
      let set = new Set(this.selected)
      if (set.has(ind)) set.delete(ind);
      else set.add(ind);
      this.selected = [...set]
    },
    handleDonwFiles(){
      this.selected.forEach(
        i => {
          this.downloadfile(this.files[i])
        }
      )
    },
    handleDonwCurrFiles(ind){
      this.downloadfile(this.files[ind])
    },
    downloadfile(filePath){
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function(){
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const url = canvas.toDataURL("image/png")
        const a = document.createElement('a');
        const event = new MouseEvent("click");
        a.download = 'xxx';
        a.href = url;
        a.dispatchEvent(event)
      }
      img.src = filePath;
    },
  }
}
</script>

<style lang="less" scoped>
.annex-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f8f8f8;
  box-sizing: content-box;
}
.btn-donwload-annex {
  height: 88px;
  line-height: 44px;
  background: linear-gradient(to left, #F3D4A6, #FCEFD5);
  border-radius: 44px;
  color: #613F05;
  font-size: 32px;
}
.annex-list-wrap {
  overflow: auto;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
}
.annex-list {
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  padding:32px 45px;
  &:empty::before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url(/static/images/finance/empty.png) no-repeat center center;
    background-size: 286px 264px;
  }
}
.annex-item {
  position: relative;
  width: 210px;
  height: 210px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  padding:20px;
  img {
    width: 100%;
    height: auto;
    max-height: 170px;
    object-fit: cover;
  }
}
.btn-annex {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 16px;
  overflow: hidden;
  background-size: cover;
  &.un-select { background-image: url(/static/images/finance/icon-circle-2.png)}
  &.select { background-image: url(/static/images/finance/icon-circle.png) ; }
}
.text-tip {
  margin-top: 20px;
  font-size: 24px;
  color: #a5a5a5;
  position: absolute;
  bottom:0px;
  margin-bottom: 20px;
  width:100%;
  text-align: center;
}

</style>