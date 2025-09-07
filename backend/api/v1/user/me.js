import withCors from '../../../lib/cors.js';
import userRepository from '../../../repository/user.repository.js';
import tokenService from '../../../services/token.service.js';
import {
	extractBearerToken,
	getHttpMethodFlags,
	sendJsonResponse,
	sendErrorResponse,
	mongooseToObject,
} from '../../../utils/index.js';

export default withCors(async function handler(req, res) {
	const { get } = getHttpMethodFlags(req);

	if (!get) return sendErrorResponse(res, 405, 'Phương thức không được phép');

	try {
		const token = extractBearerToken(req);
		if (!token) return sendErrorResponse(res, 401, 'Không có hoặc token không hợp lệ');

		let payload;
		try {
			payload = tokenService.verifyAccessToken(token);
		} catch (err) {
			return sendErrorResponse(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
		}

		const user = mongooseToObject(await userRepository.getById(payload.id));
		if (!user) return sendErrorResponse(res, 404, 'Không tìm thấy người dùng');

		const { passwordHashed, salt, ...safeUser } = user;

		return sendJsonResponse(res, 200, safeUser);
	} catch (error) {
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ', { err: error.message });
	}
});
