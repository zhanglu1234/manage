import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
////导入样式表
import './assets/css/global.css'




import * as echarts from 'echarts'


import axios from 'axios'

axios.defaults.baseURL = '/'

Vue.prototype.$http = axios
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')