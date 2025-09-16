export const ROUTES = {
	HOME: {
		path: '/home',
		name: 'Home',
		description: 'Trang chủ',
	},
	LOGIN: {
		path: '/login',
		name: 'Login',
		description: 'Trang đăng nhập người dùng',
	},
	REGISTER: {
		path: '/register',
		name: 'Register',
		description: 'Trang đăng ký người dùng',
	},
	PROFILE: {
		path: '/profile',
		name: 'Profile',
		description: 'Trang hồ sơ người dùng',
	},
	ABOUT: {
		path: '/about',
		name: 'About',
		description: 'Trang giới thiệu về chúng tôi',
	},
	ACTIVE: {
		path: '/active',
		name: 'Active',
		description: 'Trang các mục đang hoạt động',
		withId: (id) => `/active/${id}`,
	},
};
