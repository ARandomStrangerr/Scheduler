import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide('expressAddress', 'http://localhost:5174');

app.use(router)

app.mount('#app')
