import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('../views/Comment.vue')
  },
  {
    path: '/customerChat',
    name: 'customerChat',
    component:  () => import('../views/customerChat.vue'),
    meta: {
      requireAuth: true      //开启权限
    }
  },
  {
    path: '/customerServiceLogin',
    name: 'customerServiceLogin',
    component: () => import('../views/customerServiceLogin.vue')
  },
  {
    path: '/customerService',
    name: 'customerService',
    component: () => import('../views/customerService.vue'),
    meta: {
      requireAuth: true      //开启权限
    }
  }

]

const router = createRouter({
   history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
