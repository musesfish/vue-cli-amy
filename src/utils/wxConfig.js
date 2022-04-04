import Vue from 'vue';
import common from '@/utils/common'

/* global WeixinJSBridge */
// document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
//   WeixinJSBridge && WeixinJSBridge.call('hideOptionMenu');
// });
/* global wx */
/**
 * 微信自定义分享
 * @param {Json|Object} shareOpt - 微信分享配置 { [shareTimelineTitleDesc]: <分享朋友圈title> }
 * @param {*} callback - 微信分享成功回调
 */
const wxConfig = async function (shareOpt, callback) {
  let url = decodeURI(location.origin); // 分享默认链接: 首页
  let imgUrl = `${location.origin}/static/images/logo.jpg?v=${+new Date()}`
  let link = url;
  let title = 'vue-cli-amy';
  const default_options = {
    title: title,
    desc: 'vue-cli-amy',
    imgUrl: encodeURI(imgUrl.trim())
  }
  let options = {
    ...default_options
  }

  // 自定义分享（非通用）
  if (shareOpt) {
    url = decodeURI(shareOpt.link);
    options = {
      title: shareOpt.title||'vue-cli-amy',
      desc: shareOpt.desc||'vue-cli-amy',
      imgUrl: !shareOpt.imgUrl ? imgUrl: encodeURI(shareOpt.imgUrl.trim()),
      success: callback||function(){},
    }
  }
  
  link = Vue.prototype.common.setUrlParams(url, 'v', '', { v: (+new Date()) })
  link = Vue.prototype.common.setUrlParams(url, 'shareToken', '', { shareToken: Vue.prototype.store.state.token })
  // options.link = encodeURI(link);
  options.link = link;

  common.resportLogs(`wx share link: ${link}`)

  // 微信sdk配置

  let __url = location.href;
  if (Vue.prototype.common.equipmentType() === 'ios') {
    // IOS
    // entryUrl 是入口链接
    __url = encodeURIComponent(window.entryUrl)
  } else {
    __url = encodeURIComponent(location.href)
  }

  wx.error( (res)=> {
    console.log('wx_error', res)
    try {
      common.resportLogs(`wx_error: ${JSON.stringify(res)}, signUrl: ${__url}, signData: ${JSON.stringify(data||{})} options: ${JSON.stringify(options)}`)
    } catch {
      //
    }
  })

  function setWxConfig(){
    // // 朋友圈
    // wx.onMenuShareTimeline({
    //   ...options,
    //   title: (shareOpt&&shareOpt.shareTimelineTitleDesc)?shareOpt.shareTimelineTitleDesc:options.title,
    //   success: function(){
    //     common.resportLogs(`wx share success: ${JSON.stringify(options)}`)
    //     shareOpt && shareOpt.shareTimelineCallback && shareOpt.shareTimelineCallback()
    //     callback&&callback()
    //   }
    // })
    // // 朋友
    // wx.onMenuShareAppMessage(options)
    // wx.onMenuShareQQ(options)
    // wx.onMenuShareQZone(options)
    // 朋友圈 v 1.4.0
    wx.updateTimelineShareData({
      ...options,
      title: (shareOpt&&shareOpt.shareTimelineTitleDesc)?shareOpt.shareTimelineTitleDesc:options.title,
      success: function(){
        common.resportLogs(`wx share success: ${JSON.stringify(options)}`)
        shareOpt && shareOpt.shareTimelineCallback && shareOpt.shareTimelineCallback()
        callback&&callback()
      }
    })
    // 朋友 1.4.0
    wx.updateAppMessageShareData(options)


    try {
      common.resportLogs(`wx share options: ${JSON.stringify(options)}`)
    } catch {
      //
    }

    if (WeixinJSBridge) WeixinJSBridge.call('showOptionMenu');
    wx && wx.showOptionMenu();
  }

  // 需在用户可能点击分享按钮前就先调用
  wx.ready(function() {
    setWxConfig()
  })

  // wx.ready前的分享配置
  // document.title = (shareOpt&&shareOpt.shareTimelineTitleDesc)?shareOpt.shareTimelineTitleDesc:(window.__cache_title||'vue-cli-amy');
  // window.__wx_share_default_imgUrl.src = options.imgUrl;
  if (common.equipmentType() === 'ios' && window._is_wxconfig_ok ) {
    // setWxConfig()
    return false;   
  }
  // 微信分享 - 获取签名
  const{ret, data} = await Vue.http.get(`/wxoauth/getJsapiSignature?url=${__url}`).then(res=> res.body).catch(err=> console.log(err)) || {}
  if (window.appLoadDom.style.display != 'none') {
    clearTimeout(global.__hide_loading_timer)
    global.__hide_loading_timer = setTimeout(() => {
        window.appLoadDom.style.display = 'none';
    }, 240);
  }
  if (ret !== 100) return false;
  window._is_wxconfig_ok = true;
  wx.config({
    ...data,
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    // appId: opt.appId, // 必填，公众号的唯一标识
    // timestamp: opt.timestamp, // 必填，生成签名的时间戳
    // nonceStr: opt.nonceStr, // 必填，生成签名的随机串
    // signature: opt.signature,// 必填，签名
    jsApiList: [
      // 'onMenuShareTimeline',
      'updateAppMessageShareData',
      // 'onMenuShareAppMessage',
      'updateTimelineShareData',
      // 'onMenuShareQQ',
      // 'onMenuShareQZone',
      'hideOptionMenu',
      'showOptionMenu',
    ] // 必填，需要使用的JS接口列表
  });
  
  if (window.WeixinJSBridge) WeixinJSBridge.call('showOptionMenu');
  else wx && wx.showOptionMenu();
}

export default wxConfig