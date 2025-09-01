import authService from '../../../services/auth.service.js';
import { getHttpMethodFlags, sendJsonResponse, parseJson } from '../../../utils/index.js';

export default async function loginHandler(req, res) {
	const { post } = getHttpMethodFlags(req);
	if (!post) {
		return sendJsonResponse(res, 405, { error: 'Method Not Allowed' });
	}

	try {
		const body = await parseJson(req);
		const { email, password } = body;

		if (!email || !password) {
			return sendJsonResponse(res, 400, { error: 'Email và mật khẩu là bắt buộc' });
		}

		const user = await authService.login(email, password);
		return sendJsonResponse(res, 200, user);
	} catch (err) {
		return sendJsonResponse(res, 401, { error: err.message });
	}
}
