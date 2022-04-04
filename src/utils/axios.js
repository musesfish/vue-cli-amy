import Vue from 'vue'
import VueResource from 'vue-resource'
import Cookies from 'js-cookie'
import Api from '../config/api';
import common from '../utils/common';
Vue.use(VueResource)

let codeMsg = {
    400: '请求参数错误',
    401: '当前请求需要用户验证（令牌、用户名、密码）',
    403: '访问禁止',
    404: '请求的资源不存在',
    405: '请求行中指定的请求方法不能被用于请求相应的资源。',
    406: '请求格式错误',
    410: '请求资源被永久删除',
    500: '服务器错误',
    502: '网关错误',
    503: '服务不可用，服务器维护中',
    504: '服务器正在维护升级，请稍后访问'
}

let indicatorTimer = null;
const filterToastUrl = [
    '/webapi/wxoauth/getJsapiSignature',
    '/webapi/wx/user/isSubscribe', // 关注接口静默请求
    'https://thirdwx.qlogo.cn',
    'http://thirdwx.qlogo.cn',
]
const filterToastRouter = [
    '/author'
]
// 不清除的旧路由请求
const filterPreviousRequest = [
    'xxx',
]

function hasUnToastUrl(url){
    let _url;
    try {
        _url = url.split('?')[0]
    } catch {
        _url = url;
    }
    return filterToastUrl.find( i => _url === i ) || filterToastRouter.find( i=> location.pathname === i )
}

export default {
    init() {
        Vue.http.interceptors.push((request, next) => {
            if(!Array.isArray(window.__previousRequest)) window.__previousRequest = [];
            if (!filterPreviousRequest.includes(request.url)) window.__previousRequest.push(request);
            let isFile = null;
            clearTimeout(indicatorTimer);
            if (request.url.indexOf('api.weixin.qq.com') < 0) { // 不是微信
                if(request.responseType === "arraybuffer"){
                  isFile = 'arraybuffer';
                }
                if (!hasUnToastUrl(`/webapi${request.url}`) ) { // 非授权页显示
                    Vue.$indicator.open()
                }
                if (request.url.indexOf('http') !== 0) {
                    request.url = Api.api + request.url;
                }
                if (request.params == undefined) request.params = {};
                request.params.token = Vue.prototype.store.state.token;
                let userId = Cookies.get('userId')
                // let userId = 53;
                if (userId != undefined) {
                    request.params.userId = userId;
                }
            }
            next((response) => {
                indicatorTimer = setTimeout(() => {
                    Vue.$indicator.close();
                }, 600)
                // 请求成功
                let responseUrl;
                try {
                    responseUrl = response.url.split('?')[0]
                } catch {
                    responseUrl = response.url;
                }
                if (response.status >= 200 && response.status < 300) {
                    if (response.body.ret != 100 && !isFile && response.body.ret != 809 && response.body.ret != 801 && response.body.ret != 804 && response.body.ret != 802 && response.body.ret != 803 && response.body.ret!=402 && response.body.ret!=117) {//809 801 804 802 803 优惠券的状态 
                        try {
                            common.resportLogs(`request, ${JSON.stringify(response)}`)
                        } catch {
                            //
                        }
                        // 用户不存在
                        if (response.body.ret == 110) {
                            // 用户不存在，清除token信息和用户信息
                            Cookies.remove('token');
                            Cookies.remove('userId');
                            Cookies.remove('userInfo');
                            Vue.prototype.store.commit('clearToken')
                            let msg = response.body.msg;
                            msg = msg.replace(/用户不存在/, '用户信息已失效');
                            Cookies.set('before_login_url', location.href, { expires: (new Date( (+ new Date()) + 10 * 60 * 1000)) })
                            Vue.$messagebox.confirm(`${msg}`, '', {
                                showCancelButton: false,
                                closeOnClickModal: false,
                                confirmButtonText: '重新登录'
                            }).then( action => {
                                if (action === 'confirm') {
                                  common.reWxOauth()
                                }
                            })
                        } else {
                            
                            let errMsg = `${response.body.msg}`;
                            let filterRetCode = [
                                1102,
                                112, 
                            ]
                            if( !filterRetCode.includes(response.body.ret) && !hasUnToastUrl(responseUrl)){
                                Vue.$messagebox({
                                    title: '温馨提示',
                                    message: errMsg
                                })
                            } else {
                                console.error(errMsg)
                            }
                            
                        }
                    }
                } else {
                    if (!filterToastUrl.includes(responseUrl)){
                        let errorText = codeMsg[response.status] || response.statusText;
                        if(errorText != '') { 
                            Vue.$messagebox({
                                title: '温馨提示',
                                message: errorText,
                            })
                        }
                    }
                }
                return response
            })
        })
    }
}


