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
