import Vue from 'vue'
import Cookies from 'js-cookie'
import Api from '@/config/api'
import * as Sentry from "@sentry/vue";
const common = {
    reWxOauth(_time=1200){
        clearTimeout(window.__reauth)
        let count = Cookies.get('oauth_error_count')||0;
        count++;
        common.clearUserInfo();
        Cookies.set('oauth_error_count', count, { expires: 1 })
        const SHARETOKEN = Cookies.get('share_token')
        let origin = count<3?Api.wxoauth:`${location.origin}/oauth`
        let t = + new Date();
        let url = origin + (SHARETOKEN==null?`?v=${t}`:`?shareToken=${SHARETOKEN}&v=${t}`)
        window.__reauth = setTimeout(()=> {
            const ua = common.equipmentType().toLocaleLowerCase();
            if (ua === 'ios') {
                var nextPage = document.createElement('a');
                nextPage.setAttribute('href',url);
                nextPage.click();
            } else {
                window.location.href = url;
            }
        }, _time)
    },
    // 检查客户端是否能操作cookie
    verifyHasSaveCookies(){
        clearTimeout(timeout)
        const t = + new Date();
        const KEY = 'test_wx_device_save_cookies'
        Cookies.set(KEY, t)
        const timeout = setTimeout(() => {
            const val = Cookies.get(KEY);
            if (val !== t) Sentry.captureMessage(`device un save cookies`);
        }, 1e3);
    },
    // 清除登录信息
    clearUserInfo(){
        Cookies.remove('local_token');
        Cookies.remove('userId');
        Cookies.remove('userInfo');
    },
    clearOauthErrorRecord(){
        Cookies.remove('oauth_error_count')
    },
    bannerJump(t, url) {
        let reg = new RegExp(`^${location.origin}`);
        if (reg.test(url)) {
            t.$router.push({
                path: url.replace(reg, '')
            })
        } else {
            location.href = url;
        }
    },
    getClicks(str) {
        return (str - 0 >= 10000) ? ((str / 10000).toFixed(0)) + 'W' : str;
    },
    // 返回设备的类型
    equipmentType: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            return 'android'
        } else if (isiOS) {
            return 'ios'
        } else {
            return 'web'
        }
    },
    /**
     * 图片转base64数据
     * @param {string} [url] - 图片地址
     */
    getBase64Image: function (url) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL('image/png');
            return dataURL;
        }
    },
    //获取#后的参数
    getHashString(name, url) {
        const reg = new RegExp("(^|)" + name + "=([^&]*)(&|$)");
        let meetArr = url || window.location.hash.substr(1).match(reg);
        if (meetArr != null) {
            return meetArr[2]
        } else {
            return null
        }
    },
    //获取？后的参数
    getQueryString(name, url) {
        const reg = new RegExp("(^|)" + name + "=([^&]*)(&|$)");
        let meetArr = url || window.location.search.substr(1).match(reg);
        if (meetArr != null) {
            return meetArr[2]
        } else {
            return null
        }
    },
    /* 替换URL的参数 */
    replaceUrlParams: function (url, key, value) {
        let u = url.replace(/(\\?|^|&|#)name=([^&|^#]*)(&|$|#)/, "$1" + key + "=" + value + "$2");
        return u;
    },
    getUrlParam: function (sUrl, sKey) {
        let result = {};//用来存储参数键值对
        sUrl.replace(/\??(\w+)=([\w+-@%*?#!~`();"']+)&?/g, function(str, key, value) {
            if (result[key] !== undefined) {//键值已定义
            var t = result[key];
            result[key] = [].concat(t, value);//把新元素拼接成一个数组
            } else {//键值未定义
            result[key] = value;//直接为对象创建这个新属性
            }
        });
        
        if (sKey === undefined) {//函数第二个参数未传入时，返回整个对象
            return result;
        } else {//传入了第二个参数，直接返回键值
            return result[sKey] || "";
            }
        },
    /**
     * 移除url参数和添加url参数 
     * @param {Object} [param] - 新增加的参数
     * */
    setUrlParams: function (url, key, value, param={}) {
        let query = common.getUrlParam(url);
        let origin = url.split('?')[0]
        if (Object.keys(query).length === 0) {
            return `${origin}?${common.parseParams(param)}`
        }
        query[key] = value;
        if (!value) delete query[key]; 
        let params = {
            ...query, 
            ...param
        }
        return `${origin}?${common.parseParams(params)}`
    },
    // json转url参数
    parseParams: function (data) {
        try {
            var tempArr = [];
            for (var i in data) {
                var key = encodeURIComponent(i);
                var value = encodeURIComponent(data[i]);
                tempArr.push(key + '=' + value);
            }
            var urlParamsStr = tempArr.join('&');
            return urlParamsStr;
        } catch (err) {
            return '';
        }
    },
    // 转化为 hh:mm:ss
    convertDate: function (t) {
        var h = parseInt(t / (60*60));
        var m = parseInt(t % (60*60) / 60);
        var s = t % 60 % 60 % 60;
        return this.markZero(h, 2) + ":" + this.markZero(m, 2) + ":" + this.markZero(s, 2)
    },
    // 补零
    markZero: function (n, len=2) {
        var str = (n / Math.pow(10, len)).toFixed(len) + "";
        len = len == null ? 2 : len;
        return str.substr(str.indexOf('.') + 1)
    },
    splitTimeDate(d, config = { format: 'yyyy-mm-dd', split: '.' } ){
        if (!d) return '';
        d = d.replace(/-/g, '/')
        let date = new Date(d);
        if (date.toString() === 'Invalid Date' ) return '';
        const year = date.getFullYear();
        const month = common.markZero(date.getMonth()+1);
        const day = common.markZero(date.getDate());
        const hours = common.markZero(date.getHours());
        const min = common.markZero(date.getMinutes())
        if (config.format === 'yyyy-mm-dd mm:hh') {
            let list_before = [ year, month, day ];
            let list_after = [ hours, min]
            return `${list_before.join(config.split)} ${list_after.join(":")}`
        }
        // yyyy-mm-dd
        let list = [ year, month, day ];
        return list.join(config.split)
    },
    getNowDate(str){
        let date = new Date();
        if (str == 'y') {
            return date.getFullYear();
        }else if (str == 'm') {
            let m = (date.getMonth()-0+1).toString();
            if(m.length == 1){
                m = '0'+m;
            }
            return m;
        }else if (str == 'd') {
            let d = date.getDate().toString();
            if(d.length == 1){
                d = '0'+d;
            }
            return d;
        }
    },
    // 千分符
    formatMoney(s){
        if(!s) return s;
        var noNegative = true; //默认是正值。
        s=parseFloat(s+"").toFixed(2); 
        s=s+""; //转换成字符串
        if(parseFloat(s) < 0){ //是负数
            s = Math.abs(s).toFixed(2) + "";  
            noNegative = false; 
        }
        var zheng=s.split(".")[0]; 
        var dian=s.split(".")[1]; 
        //将整数部分，利用字符串的charAt() 方法，转换成数组。
        var zhengArr=[];
        for(let i=0;i<zheng.length;i++){
            zhengArr.push(zheng.charAt(i));
        }
        zhengArr=zhengArr.reverse();
        var t="";
        for(let i=0;i<zhengArr.length;i++){
            if(i%3==2&&i!=zhengArr.length-1){ //为第三位，并且并不是最后了。如123456时，6并不加,
                t+=zhengArr[i]+",";
            }else{
                t+=zhengArr[i]+""; //加上空格
            }
        }
        return (noNegative?"":"-")+t.split("").reverse().join("")
        +"."+dian;
    },
    /**
     * 禁用ios橡皮筋效果
     */
    ios_stopDrop() {
        if (common.equipmentType() === 'ios') {
        // let startY, endY;
        
        // document.body.addEventListener('touchstart', function(e){
        //     startY = e.targetTouches[0].pageY;
        // })
        // document.body.addEventListener('touchmove', function(e) {
        //     const scroll_el = document.querySelector('#app');
        //     endY = e.targetTouches[0].pageY;
        //     console.log(scroll_el.scrollTop)
        //     // // 上滑
        //     if ( endY >= startY && scroll_el.scrollTop < 0 ) {
        //         e.preventDefault()
        //     }
        //     // if (endY<startY && scroll_el.scrollTop + document.body.offsetHeight >= scroll_el.scrollHeight ) {
        //     //     e.preventDefault()
        //     // }         
        // }, {passive: false});
        }
    },
    // 上报日志
    resportLogs(log){
        // 仅正式环境上传日志
        if (location.origin !== 'xxx') return false;
        let str = log;
        if (!str) return false;
        clearTimeout(window.__cache_logs_timer)
        if (!window.__cache_logs) window.__cache_logs = [];
        try {
            const t = new Date().toLocaleString();
            window.__cache_logs.push(t)
            window.__cache_logs.push(str)
            window.__cache_logs_timer = setTimeout( async ()=> {
                const list = [...window.__cache_logs]
                const params = {
                    v: '210805.beta',
                    t: new Date().toLocaleString(),
                    url: location.href,
                    appVersion: navigator.appVersion,
                    connection: navigator.connection,
                    log: list,
                };
                const { ret } = await Vue.http.post(`xxx`, { log: JSON.stringify(params) }, {emulateJSON:true}).then(res => res.body).catch(()=> {})
                if (ret === 100) {
                    window.__cache_logs = [];
                }
            }, 1e3)
        } catch {   
            // 
        }
    },
    /**
     * [isDuringDate 比较当前时间是否在指定时间段内]
     * @author dongsir
     * @DateTime 2019-08-21
     * @version  1.0
     * @param    date   [beginDateStr] [开始时间]
     * @param    date   [endDateStr]   [结束时间]
     * @return   Boolean
     */
    isDuringDate(beginDateStr, endDateStr) {
        var curDate = new Date(),
            beginDate = new Date(beginDateStr),
            endDate = new Date(endDateStr);
        if (curDate >= beginDate && curDate <= endDate) {
            return true;
        }
        return false;
    },
    getDateStr(AddDayCount=0){
        const date = new Date()
        date.setDate(date.getDate() + AddDayCount) // 获取AddDayCount天后的日期
        const year = date.getFullYear()
        const mon = date.getMonth() // 获取当前月份的日期
        const day = date.getDate()
        const result = {
          year,
          mon,
          day,
        }
        return result
    },
    getListDate(){
        const LISTMONTH = [
            { label: '01', value: 1, en: 'Jan' },
            { label: '02', value: 2, en: 'Feb' },
            { label: '03', value: 3, en: 'Mar' },
            { label: '04', value: 4, en: 'Apr' },
            { label: '05', value: 5, en: 'May' },
            { label: '06', value: 6, en: 'Jun' },
            { label: '07', value: 7, en: 'Jul' },
            { label: '08', value: 8, en: 'Aug' },
            { label: '09', value: 9, en: 'Sept' },
            { label: '10', value: 10, en: 'Oct' },
            { label: '11', value: 11, en: 'Nov' },
            { label: '12', value: 12, en: 'Dec' },
        ],LISTQUARTER = [
            { label: '01季度', value: 1 },
            { label: '02季度', value: 2 },
            { label: '03季度', value: 3 },
            { label: '04季度', value: 4 },
        ];
        const result = {
            LISTMONTH,
            LISTQUARTER,
        }
        return result
    },
    getWeekEnText(val){
        const list = ["Mon","Tue","Wed","Thur","Fri","Sat","Sun"];
        return list[Number(val)]||''
    },
    getMonthEnText(val){
        const list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
        return list[Number(val)]||''
    },
    LISTYEAR(minYear=2011){
        const nowYear = new Date().getFullYear();
        let year = minYear;
        let list = [];
        while(year<=nowYear){
          list.push({
            label: `${year}`,
            value: year
          })
          year++;
        }
        return list
    },
    /**
     * 判断某个原生DOM元素是否不在屏幕可见区内
     * @param {*} el 原生DOM元素 num 一定距离内可见
     */
    isElementNotInViewport (el,num) {
        if(!el) return false;
        let rect = el.getBoundingClientRect();
        return (
            rect.top+num >= (window.innerHeight || document.documentElement.clientHeight) ||
            rect.bottom <= 0
        );
    },
    /**
     * 图形字体换算方法
     * 当前视口
     */
    nowSize(val,initWidth=375){
        let nowClientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
        return val * (nowClientWidth/initWidth);
    },
    //四舍五入保留2位小数（不够位数，则用0替补）
    KeepTwoDecimalFull(num,type){
        if(num === '') return ''
        var result = Math.round(num * 100) / 100;
        var s_x = result.toString();
        if((!type || s_x!=='0')){
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2 ) {
            s_x += '0';
        }
        }
        return s_x;
    },
    /**
     * 汉字验证(开户银行)/
     */
    isChinese(word,min,max){
        min = min || 2
        max = max || 10
        var reg = new RegExp("^([\u4e00-\u9fa5\.]{"+min+","+max+"})$","g");
    
        if (reg.test(word)) {
            return true
        }else{
            return false
        }
    },
    /**
     * 邮箱
     */
    isEmails(value){
        if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)) {
        return true
        }else{
        return false
        }
    },
    /**
     * 银行账户(只能是数字)/
     */
    isBankAccount(val,min,max){
        min = min || 12
        max = max || 20
        let reg = new RegExp("^[0-9]{"+min+","+max+"}$","g")
    
        if (reg.test(val)) {
        return true
        }else{
        return false
        }
    },
    /**
     * 身份证
     * 大陆 18位数字或17位数字+(x|X)
     * 台湾 8位或18位数字（新）、10位含字母（旧）
     * 澳门 8位（1或2个英文字母及6个数字组成）
     * 香港 8位（1或2个英文字母及6个数字组成）
    */
    isIdCard(val){
        if (/(^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$)|(^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(\([0−9aA]\)|[0-9aA])$)|(^[a-zA-Z][0-9]{9}$)|(^[1|5|7][0-9]{6}\([0-9Aa]\))/.test(val)) {
            return true
        } else {
            return false
        }
    },
    /**
     * 金额（工资）
     */
    isMoney(value){
        value = Number(value)
        if (/^(([0-9]*)|(([0]\.\d*|[0-9]*\.\d*)))$/.test(value) && value!=='') {
            return true
        }else{
            return false
        }
    },
    // 手机号码
    isPhoneNumber(phoneNumber){
        const reg = /^1[3456789]\d{9}$/
        return reg.test(phoneNumber)
    }
}
export default common