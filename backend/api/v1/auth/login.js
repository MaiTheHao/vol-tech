import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { getHttpMethodFlags, sendJsonResponse, parseJson, sendErrorResponse } from '../../../utils/index.js';

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);
	if (!post) {
		return sendErrorResponse(res, 405, 'Phương thức không được phép');
	}

	try {
		const body = await parseJson(req);
		const { email, password } = body;

		if (!email || !password) {
			return sendErrorResponse(res, 400, 'Email và mật khẩu là bắt buộc');
		}

		const user = await authService.login(email, password);
		return sendJsonResponse(res, 200, user);
	} catch (err) {
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ', { error: err.message });
	}
});
