export const routes = [
	{
		path: '/register',
		name: 'Register',
		component: r => require(['../views/Register.vue'], r)
	},
	{
		path: '/login',
		name: 'Login',
		component: r => require(['../views/Login.vue'], r)
	},
	{
		path: '/forget',
		name: 'Forget',
		component: r => require(['../views/Forget.vue'], r)
	},
	{
		path: '/newpasswrod',
		name: 'newPasswrod',
		component: r => require(['../views/newPasswrod.vue'], r)
	},
	{
		path: '/totality',
		name: 'Totality',
		component: r => require(['../views/Totality.vue'], r),

		// 二级路由
		children: [
			{
				path: 'home',
				name: 'Home',
				component: r => require(['../views/Home.vue'], r)
			},
			{
				path: 'menu',
				name: 'Menu',
				component: r => require(['../views/Menu.vue'], r)
			},
			{
				path: 'shop',
				name: 'Shop',
				component: r => require(['../views/Shop.vue'], r)
			},
			{
				path: 'my',
				name: 'My',
				component: r => require(['../views/My.vue'], r)
			}
		]

	},
	{
		path: '/details',
		name: 'Details',
		component: r => require(['../views/Details.vue'], r)
	},
	{
		path: '/account',
		name: 'Account',
		component: r => require(['../views/Account.vue'], r)
	},
	{
		path: '/like',
		name: 'Like',
		component: r => require(['../views/Like.vue'], r)
	},
	{
		path: '/address',
		name: 'Address',
		component: r => require(['../views/Address.vue'], r)
	},
	{
		path: '/secure',
		name: 'Secure',
		component: r => require(['../views/Secure.vue'], r)
	},
	{
		path: '/newlyaddress',
		name: 'newlyAddress',
		component: r => require(['../views/newlyAddress.vue'], r)
	},
	{
		path: '/pay',
		name: 'Pay',
		component: r => require(['../views/Pay.vue'], r)
	},
	{
		path: '/order',
		name: 'Order',
		component: r => require(['../views/Order.vue'], r)
	},
	{
		path: '*',
		redirect: {
			name: 'Login'
		}
	}
]