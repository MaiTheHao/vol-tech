import withCors from '../../../lib/cors.js';
import userRepository from '../../../repository/user.repository.js';
import tokenService from '../../../services/token.service.js';
import { extractBearerToken, sendJsonResponse } from '../../../utils/index.js';

export default withCors(async function handler(req, res) {
	try {
		const token = extractBearerToken(req);
		if (!token) {
			return sendJsonResponse(res, 401, { message: 'Không có hoặc token không hợp lệ' });
		}

		let payload;
		try {
			payload = tokenService.verifyAccessToken(token);
		} catch (err) {
			return sendJsonResponse(res, 401, { message: 'Token không hợp lệ hoặc đã hết hạn' });
		}

		const user = await userRepository.getById(payload.id);
		if (!user) {
			return sendJsonResponse(res, 404, { message: 'Không tìm thấy người dùng' });
		}

		sendJsonResponse(res, 200, user);
	} catch (error) {
		sendJsonResponse(res, 500, { message: 'Lỗi máy chủ nội bộ', error: error.message });
	}
});
