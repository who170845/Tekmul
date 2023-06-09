import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "about" */ '../views/main.vue')
  },
  {
    path: '/key',
    name: 'key',
    component: () => import(/* webpackChunkName: "about" */ '../views/keyword.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import(/* webpackChunkName: "about" */ '../views/map.vue')
  },
  {
    path: '/tes',
    name: 'tes',
    component: () => import(/* webpackChunkName: "about" */ '../views/tes.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
