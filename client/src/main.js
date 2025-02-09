import { createApp } from 'vue'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App);

const googleClientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;

app.use(vue3GoogleLogin, {
  clientId: googleClientId
});

app.mount('#app');
