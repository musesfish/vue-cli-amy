import Vue from 'vue';

/* 
 * 订单支付
 * params: { orderNo: <订单id>, token: <openID> }
*/

/* global WeixinJSBridge */
const orderPay = async function (params, callback) {
    const openId = Vue.prototype.store.state.token;
    const payurl = "xxx";
    Vue.http.get(payurl, { params: { orderNo: params.orderNo, openId: openId } })
    .then( ({ body }) => {
        const { data, ret } = body;
        // 支付
        function onBridgeReady() {
            WeixinJSBridge.invoke('getBrandWCPayRequest', data, function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    callback&&callback()
                } else {
                    if(res.err_msg === 'get_brand_wcpay_request:cancel'){
                        // Vue.$toast("取消支付")
                    }
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

export default orderPay