import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { parseJson, getHttpMethodFlags, sendJsonResponse, sendErrorResponse } from '../../../utils/index.js';

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);
	if (!post) return sendErrorResponse(res, 405, 'Phương thức không được phép');

	try {
		const body = await parseJson(req);
		const { name, email, password, birthDate, unit, phone } = body;

		if (!name || !email || !password) {
			sendErrorResponse(res, 400, 'Thiếu trường bắt buộc');
			return;
		}

		await authService.register({ name, email, password, birthDate, unit, phone });

		return sendJsonResponse(res, 201, { message: 'Đăng ký thành công' });
	} catch (err) {
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ', { error: err.message });
	}
});
