import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '.././components/Login.vue'
import home from '.././components/home.vue'
import welcome from '.././components/welcome.vue'
import goods from '.././components/goods/goods.vue'

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
					path: '/goodslist',
					component: goods
				}
			]
		}
	]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
	if(to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})
export default router