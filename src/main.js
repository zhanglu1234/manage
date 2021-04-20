import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
////导入样式表
import './assets/css/global.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://10.200.26.75:8888'

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')