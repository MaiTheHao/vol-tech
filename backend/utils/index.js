export async function parseJson(req) {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			try {
				const data = JSON.parse(body || '{}');
				resolve(data);
			} catch (err) {
				reject(new Error('Invalid JSON'));
			}
		});
		req.on('error', (err) => {
			reject(err);
		});
	});
}

export function getHttpMethodFlags(req) {
	const method = req.method?.toLowerCase();
	return {
		get: method === 'get',
		post: method === 'post',
		put: method === 'put',
		delete: method === 'delete',
	};
}

export function sendJsonResponse(res, statusCode, data) {
	res.statusCode = statusCode;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(data));
}

export function extractBearerToken(req) {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader || typeof authHeader !== 'string') return null;
	const match = authHeader.match(/^Bearer\s+(.+)$/i);
	return match ? match[1] : null;
}
