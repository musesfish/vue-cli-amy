// 连续点击 点击次数大于1使用
class ContinuityClick {
  constructor(options = {}) {
      // 参数
      this._options = options  // 包含 clickCount  需要点击的次数 clickCount为1时必须使用todoFunc回调方法
      this.clickCount = options.clickCount || 2
      this.todoFunc = options.todoFunc || function () {}  // 点击次数>=2的回调方法
      this.singleFunc = options.singleFunc || function() {}  // 单击1次的回调方法
      this.milliseconds = options.milliseconds || 300

      this.lastTime = 0
      this.count = 0
      this.timer = null
  }
  // 返回点击次数 包含点击次数为1时的使用方式  多次以上兼容为1时的用法
  click() {
      let currentTime = new Date().getTime()
      this.count = (currentTime - this.lastTime) < this.milliseconds ? this.count + 1 : 1
      this.lastTime = new Date().getTime()
      if (this.count == this.clickCount) {
          if (typeof(this.todoFunc) == 'function') {
              this.todoFunc();
          }
      } else {
          if (typeof(this.singleFunc) == 'function') {
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                  if (this.count == 1) {
                      this.singleFunc()    
                  }
              }, 250);
          }
      }
  }
}
export default ContinuityClick
