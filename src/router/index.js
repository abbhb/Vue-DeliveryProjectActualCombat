import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',//改为history模式，去除url里的#
	routes
});


router.beforeEach((to, from, next) => {
	console.log("to")
	console.log(to)
	if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
		if (sessionStorage.getItem('token')) { // vuex.state判断token是否存在,后台会校验是否过期
			console.log(to.meta.roles)
			console.log(sessionStorage.getItem("type"))
			if(to.meta.roles.includes(sessionStorage.getItem("type"))){

				console.log("存在")
				next()	//放行
			}else{
				router.push({path:"/404"})
				// next({path:"/404"})	//跳到404页面
			}
		} else {
			next({
				path: '/login',
				query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {//不需要认证的路由不存在权限的问题

		next()	//放行
		// if(to.meta.roles.includes(quanxian)){
		//
		// 	console.log("存在")
		//
		// }else{
		// 	router.push({name: 'NotFound'})
		//
		// 	// next({path:"/404"})	//跳到404页面
		// }
	}
})
export default router;
