import App from '../App.vue'
import NotFound from "@/views/NotFound";
import login from "@/views/login/login";
import index from "@/views/index";

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
			requireAuth: false,
			needrole:false
		}
	},
	{
		path: '*',
		name: '*',
		component: login,
		meta:{
			requireAuth: false,
			needrole:false
		}
	},
];

