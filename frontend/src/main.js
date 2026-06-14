import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import './styles/app.css';
import { useAuthStore } from './stores/auth.store';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(vuetify);

// Restore session from localStorage before mounting.
useAuthStore().restore();

app.mount('#app');
