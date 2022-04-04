<template>
<div>
</div>
</template>
<script>
import common from '../utils/common';
import Cookies from 'js-cookie'
export default {  
    created: async function(){ 
        let {token} = this.$route.query;
        if(!token || (token||'').toLocaleLowerCase() === 'undefined' || (token||'').toLocaleLowerCase() === 'null' ){
            this.$store.commit('clearToken'); 
            common.reWxOauth()
        } else {
            this.$store.commit('setToken',token); 
            Cookies.set('local_token', token, { expires: (new Date( (+ new Date()) + 5 * 60 * 1000)) })
            this.goBeforeLoginUrl() // 返回进入的页面
        }
    },
    methods: {
        goBeforeLoginUrl(){
            // 读取记录的访问url
            var url = Cookies.get("before_login_url");
            if(!url){
                Cookies.set("before_login_url", location.origin, { expires: (new Date( (+ new Date()) + 10 * 60 * 1000)) })
                common.reWxOauth()
                return false
            }
            Cookies.remove("before_login_url")
            location.href = url;
        }
    }
}
</script>

