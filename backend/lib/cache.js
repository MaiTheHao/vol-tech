/**
 * Higher-order function để thêm headers cache vào response.
 * @param {*} handler
 *  Hàm xử lý gốc (original handler).
 * @param {*} options
 *  - cacheControl: Chuỗi để thiết lập header Cache-Control. Mặc định là 'public, s-maxage=300, stale-while-revalidate=60'.
 *  - etag: Chuỗi để thiết lập header ETag. Nếu request có header If-None-Match trùng với etag này, trả về 304.
 * @returns
 */
export default function withCache(handler, options = {}) {
	const { cacheControl = 'public, s-maxage=300, stale-while-revalidate=60', etag } = options;

	return async function cacheWrappedHandler(req, res) {
		if (cacheControl) {
			res.setHeader('Cache-Control', cacheControl);
		}
		if (etag) {
			res.setHeader('ETag', etag);
			if (req.headers['if-none-match'] === etag) {
				res.writeHead(304);
				res.end();
				return;
			}
		}
		return handler(req, res);
	};
}
