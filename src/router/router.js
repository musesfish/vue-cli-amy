/**
 * @meta
 *    isShare: 自定义页面分享
 *    noShare: 非分享页面, 仅权限入口页使用
 *    isActivity: 活动页面，路由重定向当前页query带上或更新st、shareToken为当前用户
 */
export const Router = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/HomePage.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../views/user/index.vue'),
        meta: { title: '个人中心' }
      },
    ]
  },
  {
    path: '/author',
    name: 'author',
    component: () => import('../views/author.vue'),
    meta: {
      noShare: true
    }
  },
  {
    path: '/404',
    component: () => import('../views/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/oauth',
    name: 'oauth',
    component: () => import('../views/error/oauth.vue'),
    meta: { noShare: true}
  },
  {
    path: '/common/comShowImg', //图片展示下载共用页
    name: 'ComShowImg',
    component: () => import('../views/common/comShowImg.vue'),
    meta: { title: '附件' }
  },
  {
    path: '/poster/member', //合成图片分享组件
    name: 'Member',
    component: () => import('../views/poster/member.vue'),
    meta: { title: '海报' }
  },
]
