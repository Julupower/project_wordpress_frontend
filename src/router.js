import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectDetailView from './views/ProjectDetailView.vue';

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
    props: true // Automatically injects the string matching ':slug' as a prop into the component
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

