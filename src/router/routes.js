import App from '../App.vue'
import NotFound from "@/views/NotFound";
import index from "@/views/index";
import login from "@/views/login/login";
import UserInfo from "@/views/user/UserInfo";
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
		]
	},
	{
		path: '*',
		name: '*',
		redirect: '/404',
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
];

