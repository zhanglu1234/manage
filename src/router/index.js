import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '.././components/Login.vue'
import home from '.././components/home.vue'
import welcome from '.././components/welcome.vue'
import applyInfo from '.././components/driverApply/applyInfo.vue'
import orderInfo from '.././components/order/orderInfo.vue'
import clientInfo from '.././components/client/clientInfo.vue'
import test from '../components/test.vue'

Vue.use(VueRouter)

//const routes = [
//
//]
const router = new VueRouter({
	routes: [

		{
			path: '/',
			redirect: '/login'
		},

		{
			path: '/login',
			component: Login
		},

		{
			path: '/home',
			component: home,
			redirect: '/welcome',
			children: [{
				path: '/welcome',
				component: welcome
			},
			{
				path: '/applyInfo',
				component: applyInfo
			}
			]
		},
		{
			path: '/home',
			component: home,
			children: [
				{
					path: '/order',
					component: orderInfo
				}
			]
		},
		{
			path: '/home',
			component: home,
			children: [
				{
					path: '/client',
					component: clientInfo
				}
			]
		}, {
			path: '/test',
			component: test
		}
	]
})

// //挂载路由导航守卫
// router.beforeEach((to, from, next) => {
// 	if(to.path === '/login') return next();
// 	const tokenStr = window.sessionStorage.getItem('token')
// 	if(!tokenStr) return next('/login')
// 	next()
// })
export default router