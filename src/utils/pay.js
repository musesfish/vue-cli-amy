import Vue from 'vue';
import Cookies from 'js-cookie'

/* global WeixinJSBridge */

/**
 * 微信支付
 * @param {*} orderUrl 预置类型 ['member', 'wxpay] member: 下单并发起支付 wxpay: 已有订单唤醒支付 
 * @param {*} params { [orderSn]: 订单编号, [redirect]: 重定向路由(未设置时刷新当前路由) }
 * @param {*} callback 回调方法
 */
const pay = async function (orderUrl, params = {}, callback) {
    const openId = Vue.prototype.store.state.token;
    let saveurl = 'xxx';
    let payurl = "xxx";

    if (orderUrl === 'xxx') {
        const shareToken = Cookies.get('share_token')
        let query = []
        if (shareToken) query.push(`shareToken=${shareToken}`)
        saveurl = `xxx?${query.join('&')}`;
    }
    // 已有订单唤醒支付
    else if (orderUrl === 'wxpay') {
        return wxPay(params.orderSn)
    }

    const redirectUrl = params.redirect;

    if (!saveurl) return false;
    const resp = await Vue.http.post(saveurl, params).then(res => res.body).catch(function (response) {
        console.log(response);
    });

    if (resp.ret === 100) {
        wxPay(resp.data)
    } else if (resp.ret == 307) {
        callback && callback({
            isPay: true
        })
    }


    // 唤醒支付
    function wxPays(orderSn) {
        Vue.http.post(payurl, { ...params }, { emulateJSON: true })
            .then(data => {
                data = data.body;
                // 支付
                function onBridgeReady() {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data.data, function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            if (!redirectUrl) {
                                location.reload();
                            } else {
                                location.replace(`${location.origin}${redirectUrl}`)
                            }
                            callback && callback({
                                isPay: true,
                            })
                        } else {
                            callback && callback({
                                isPay: false,
                                err_msg: res.err_msg,
                            })
                        }
                    })
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }

            })
            .catch(function (response) {
                console.log(response);
            });
    }
    // 唤醒支付
    function wxPay(orderSn) {
        Vue.http.get(payurl, { params: { orderSn: orderSn, openId } })
            .then(data => {
                data = data.body;
                // 支付
                function onBridgeReady() {
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data.data, function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            if (!redirectUrl) {
                                location.reload();
                            } else {
                                location.replace(`${location.origin}${redirectUrl}`)
                            }
                            callback && callback({
                                isPay: true,
                            })
                        } else {
                            callback && callback({
                                isPay: false,
                                err_msg: res.err_msg,
                            })
                        }
                    })
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }

            })
            .catch(function (response) {
                console.log(response);
            });
    }
}

export default pay