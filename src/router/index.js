import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/welcome/Welcome')
Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/login'
	},
  {
    path: '/login',
    name: 'Login',
    component: Login
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		children: [
			{
				path:'/home',
				redirect: '/welcome',
			},
			{
				path: '/welcome',
				name:Welcome,
				component: Welcome
			}
		]
	}
]

const router = new VueRouter({
	routes,
	mode: 'history'
})

router.beforeEach((to, from, next) => {
	if(to.path === '/login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
  next()
})

export default router
