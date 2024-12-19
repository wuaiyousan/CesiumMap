/*
 * @Author: fishScola
 * @Date: 2022-04-25 16:24:41
 * @LastEditors: fishScola
 * @LastEditTime: 2023-01-05 18:25:27
 * @Description: router for index.html
 */
// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: () => import('../views/auth/Login.vue'),
    // },
    {
      path: '/',
      name: 'Overview',
      component: () => import('../views/Overview.vue'),
      redirect: '/Overview/index',
      children: [
        {
          path: 'Overview/index',
          name: 'index',
          component: () => import('../views/supply/SupplyView.vue'),
        },
      ],
    },
  ],
})

// nprogress简单配置
NProgress.inc(0.2)
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
})

// 路由前导与后置设置
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
