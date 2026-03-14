import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css' // Import CSS của Antd v4 (với v3 là antd.css)
import './style.css'

const app = createApp(App)

app.use(router)
app.use(Antd)
app.mount('#app')
