import App from '../App.vue'
import NotFound from "@/views/NotFound";
import index from "@/views/index";
import login from "@/views/login/login";
import UserInfo from "@/views/user/UserInfo";
import ChangePassword from "@/views/user/ChangePassword";
import mendianguanli from "@/views/mendian/mendianguanli";
import memberguanli from "@/views/member/memberguanli";
import category from "@/views/category/category";
import food from "@/views/food/food";
import combo from "@/views/combo/combo";
import orders from "@/views/orders/orders.vue";
export default [
	{
		path: '/',
		component: App,
		meta:{
			requireAuth: false,
			needrole:false
		},
		children: [
			{
				path: '',
				redirect: '/login',
				meta:{
					requireAuth: false,
					needrole:false
				}
			},
		]
	},
	{
		path: '/login',
		name: 'login',
		component: login,
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '/404',
		name: 'NotFound',
		component: NotFound,
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '/index',
		name: 'index',
		component: index,
		meta:{
			requireAuth: true,
			needrole:false
		},
		children: [
			{
				path: '/userinfo',
				name: 'userinfo',
				component: UserInfo,
				meta:{
					requireAuth: true,
					needrole:false
				}
			},
			{
				path: '/changepassword',
				name: 'changepassword',
				component: ChangePassword,
				meta:{
					requireAuth: true,
					needrole:false
				}
			},
			{
				path: '/mendianguanli',
				name: 'mendianguanli',
				component: mendianguanli,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1]
				}
			},
			{
				path: '/memberguanli',
				name: 'memberguanli',
				component: memberguanli,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1,2]
				}
			},
			{
				path: '/category',
				name: 'category',
				component: category,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1,2,3]
				}
			},
			{
				path: '/food',
				name: 'food',
				component: food,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1,2,3]
				}
			},
			{
				path: '/combo',
				name: 'combo',
				component: combo,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1,2,3]
				}
			},
			{
				path: '/orders',
				name: 'orders',
				component: orders,
				meta:{
					requireAuth: true,
					needrole:true,
					roles:[1,2,3]
				}
			},
		]
	},
	{
		path: '*',
		name: '404NotFound',
		redirect: '/404',
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
];

