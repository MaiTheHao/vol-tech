import { getHttpMethodFlags } from '../utils/index.js';

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];
const allowedMethods = process.env.CORS_METHODS || 'GET,POST,PUT,DELETE';
const allowCredentials = process.env.CORS_CREDENTIALS === 'true';

export default function withCors(handler) {
	return async function corsWrappedHandler(req, res) {
		const origin = req.headers.origin;
		if (allowedOrigins.includes('*')) {
			res.setHeader('Access-Control-Allow-Origin', '*');
		} else if (origin && allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}

		res.setHeader('Access-Control-Allow-Methods', allowedMethods);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		if (allowCredentials) {
			res.setHeader('Access-Control-Allow-Credentials', 'true');
		}

		const { options } = getHttpMethodFlags(req);
		if (options || req.method === 'OPTIONS') {
			res.writeHead(204);
			res.end();
			return;
		}

		return handler(req, res);
	};
}
