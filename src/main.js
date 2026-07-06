import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import our new router configuration
import './style.css';

const app = createApp(App);

app.use(router); // Inject the routing engine into the Vue application instance

app.mount('#app');