import Vue from 'vue';
import Cookies from 'js-cookie'
import Vuex from 'vuex'
import Api from '../config/api'

Vue.use(Vuex)

const errImg = 'static/images/img.png'; // 默认图片

const store = new Vuex.Store({
    state: {
        userinfo: {},
        api: Api.api,
        fileapi: Api.file,
        isPro: Api.isPro,
        errImg: errImg,
        wxImg: Api.wximg,
        wxoauth: Api.wxoauth,
        classRoom: '',
        userId: undefined,
        token: undefined,
        tabbar: '/',
        shareToken: null,
        tab: '',
    },
    getters: {
        setCurrentUrl: () => {
            let url = location.href.replace(/[?|&]wxr=[0-9]{13}/g, '');
            history.replaceState({}, document.title, url);
        },
    },
    mutations: {
        setUserInfo(state, msg) {
            state.userinfo = msg;
            state.userId = msg.id;
        },
        setToken(state, msg) {
            state.token = msg
        },
        clearToken(state) {
            state.token = null;
        },
        setTabbar(state, msg) {
            state.tabber = msg
        },
        setShareToken(state, msg) {
            state.shareToken = msg
        },
        updateUserInfo(state, callback) {    // 更新用户数据
            Vue.http.get('xxx')
                .then(res => {
                    let data = res.body;
                    state.userinfo = data.data;
                    Cookies.set("userInfo", JSON.stringify(data.data), { expires: 1 });
                    Cookies.set("userId", data.data.id, { expires: 365 });
                    callback && callback(data.data)
                }).catch(function (response) {
                    console.log(response);
                });
        },
    }
})

export default store