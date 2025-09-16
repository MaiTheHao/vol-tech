import { extractBearerToken, sendErrorResponse } from '../utils/index.js';
import tokenService from '../services/token.service.js';

function roleGuard(allowedRoles, handler) {
	return async (req, res) => {
		const token = extractBearerToken(req);
		if (!token) {
			return sendErrorResponse(res, 401, 'Bạn chưa xác thực danh tính');
		}

		const [err, payload] = await tokenService.verifyToken(token);
		if (err || !payload || !payload.role) {
			return sendErrorResponse(res, 403, 'Bạn không có đủ quyền hạn truy cập tài nguyên');
		}

		const userRoles = Array.isArray(payload.role) ? payload.role : [payload.role];
		const hasRole = userRoles.some((r) => allowedRoles.some((role) => new RegExp(role, 'i').test(r)));

		if (!hasRole) {
			return sendErrorResponse(res, 403, 'Bạn không có đủ quyền hạn truy cập tài nguyên');
		}

		req.user = payload;

		return handler(req, res);
	};
}

export { roleGuard };
