export function getHttpMethodFlags(req) {
	const method = req.method?.toLowerCase();
	return {
		get: method === 'get',
		post: method === 'post',
		put: method === 'put',
		delete: method === 'delete',
	};
}
