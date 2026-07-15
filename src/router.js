import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectDetailView from './views/ProjectDetailView.vue';
import NotFoundView from './views/NotFoundView.vue'; // 1. Import the new view

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/project/:slug',
    name: 'ProjectDetail',
    component: ProjectDetailView,
    props: true
  },
  {
    // 2. Catch-all route to intercept any invalid URL path strings entered by the user
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  },
  {
      path: '/project/:slug',
      name: 'ProjectDetail',
      // Lazy-load this route for optimized performance
      component: () => import('./views/ProjectDetail.vue'),
      props: true // Allows passing the slug parameter directly as a prop
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;