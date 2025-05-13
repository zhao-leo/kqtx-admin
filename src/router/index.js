import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import('../views/RedirectView.vue'),
    },
    {
      path: '/panel',
      name: 'panel',
      component: () => import('../views/PanelView.vue'),
      redirect: '/panel/basic',
      children: [
        {
          path: 'basic',
          name: 'panel-basic',
          component: () => import('../views/panel/BasicPanel.vue'),
        },
        {
          path: 'show',
          name: 'panel-show',
          component: () => import('../views/panel/ShowPanel.vue'),
        },
        {
          path: 'report',
          name: 'panel-report',
          component: () => import('../views/panel/ReportPanel.vue'),
        }
      ]
    }
  ],
})

export default router
