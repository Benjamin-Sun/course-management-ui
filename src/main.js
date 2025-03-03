import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index"; 
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

createApp(App).use(router).mount("#app");
