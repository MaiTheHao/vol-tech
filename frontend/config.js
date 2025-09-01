const APP_CONFIG = {
	api: {
		baseURL: 'http://192.168.20.128',
		port: '3000',
		prefix: '/api',
		ver: '/v1',
		timeout: 5000,
		getFullPath: (path) => {
			const port = APP_CONFIG.api.port ? `:${APP_CONFIG.api.port}` : '';
			return `${APP_CONFIG.api.baseURL}${port}${APP_CONFIG.api.prefix}${APP_CONFIG.api.ver}${path}`;
		},
	},
};

export default APP_CONFIG;
