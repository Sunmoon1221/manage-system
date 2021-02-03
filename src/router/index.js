import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/welcome/Welcome')
const UserList = () => import('../views/userList/UserList')
const RightList = () => import('../views/rightList/RightList')
const RoleList = () => import('../views/roleList/RoleList')
const GoodsCate = () => import('../views/goodsCate/GoodsCate')
const Params = () => import('../views/params/Params')
const GoodsList = () => import('../views/goodsList/GoodsList')
const GoodsAdd = () => import('../views/goodsList/GoodsAdd')
const Order = () => import('../views/order/Order')
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
			},
			{
				path: '/users',
				name:UserList,
				component: UserList
			},
			{
				path:'/rights',
				name: RightList,
				component: RightList
			},
			{
				path: '/roles',
				name: 'RoleList',
				component: RoleList
			},
			{
				path:'/categories',
				name: 'GoodsCate',
				component: GoodsCate
			},
			{
				path: '/params',
				name: 'Params',
				component: Params
			},
			{
				path: '/goods',
				name: 'GoodsList',
				component: GoodsList
			},
			{
				path: '/goods/add',
				name: 'GoodsAdd',
				component: GoodsAdd
			},
			{
				path: '/orders',
				name: 'Order',
				component: Order
			},

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
