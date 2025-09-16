import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { getCookie, getHttpMethodFlags, isEmpty, sendErrorResponse, sendJsonResponse, setCookie } from '../../../utils/index.js';

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Làm mới access token
 *     description: Tạo access token mới từ refresh token có trong cookie. Đồng thời tạo refresh token mới và thu hồi refresh token cũ.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       401:
 *         description: Token làm mới không hợp lệ hoặc đã bị thu hồi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_token:
 *                 value:
 *                   error: Token làm mới không hợp lệ
 *               revoked_token:
 *                 value:
 *                   error: Token làm mới đã bị thu hồi
 *               missing_token:
 *                 value:
 *                   error: Token làm mới không hợp lệ
 *       405:
 *         description: Phương thức không được phép
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Phương thức không được phép
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Lỗi máy chủ nội bộ
 */

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);

	if (!post) {
		return sendErrorResponse(res, 405, 'Phương thức không được phép');
	}

	try {
		const oldRefreshToken = getCookie(req, 'refreshToken');
		if (isEmpty(oldRefreshToken)) {
			return sendErrorResponse(res, 401, 'Token làm mới không hợp lệ');
		}

		const [err, data] = await authService.refreshAccessToken(oldRefreshToken);
		if (err) return sendErrorResponse(res, err.code || 401, err.message || err);

		const { accessToken, refreshToken: newRefreshToken } = data;

		setCookie(res, 'refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7.25 * 24 * 60 * 60 * 1000),
		});

		return sendJsonResponse(res, 200, { accessToken });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
});
