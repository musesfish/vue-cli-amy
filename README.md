# classroom
· mintUI
· Vuex
· Vue
· vue-resouce
. vant

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```


# 请求
1. 两种请求方式 get和post
```
this.$http.get(url,{params:data}).then(res=>{
    // reponseDate res.body
    // callback
})
this.$http.post(url,data,{emulateJSON:true}).then(res=>{
    // callback
})
```

# 资源路径 proxy
服务器端开启nginx代理，路径 /serve/api.js

# 路由
##　跳转
```
this.$router.push({
    path: this.selected
})
```

# css 背景图
1. 存放在 `assets/images/` 路径下的图片build打包到static下或转成base64嵌入页面
2. css中使用相对路径引用


