const ENV = {
	VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost',
	VITE_API_PORT: import.meta.env.VITE_API_PORT ?? '3000',
	VITE_API_PREFIX: import.meta.env.VITE_API_PREFIX ?? '/api',
	VITE_API_VER: import.meta.env.VITE_API_VER ?? '/v1',
	VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT ?? 5000,
};

const APP_CONFIG = {
	api: {
		baseURL: ENV.VITE_API_BASE_URL,
		port: ENV.VITE_API_PORT,
		prefix: ENV.VITE_API_PREFIX,
		ver: ENV.VITE_API_VER,
		timeout: ENV.VITE_API_TIMEOUT,
		getFullPath: (path) => {
			const port = APP_CONFIG.api.port ? `:${APP_CONFIG.api.port}` : '';
			return `${APP_CONFIG.api.baseURL}${port}${APP_CONFIG.api.prefix}${APP_CONFIG.api.ver}${path}`;
		},
	},
};

export default APP_CONFIG;
