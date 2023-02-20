import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import comment from '../views/Comment.vue'
import customerChat from '../views/customerChat.vue'
import customerServiceLogin from '../views/customerServiceLogin.vue'
import customerService from '../views/customerService.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/comment',
    name: 'comment',
    component: comment
  },
  {
    path: '/customerChat',
    name: 'customerChat',
    component: customerChat,
    meta: {
      requireAuth: true      //开启权限
    }
  },
  {
    path: '/customerServiceLogin',
    name: 'customerServiceLogin',
    component: customerServiceLogin
  },
  {
    path: '/customerService',
    name: 'customerService',
    component: customerService,
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
