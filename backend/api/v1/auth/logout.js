import withCors from '../../../lib/cors.js';
import tokenService from '../../../services/token.service.js';
import { getHttpMethodFlags, sendErrorResponse, sendJsonResponse, getCookie, setCookie, isEmpty } from '../../../utils/index.js';

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất tài khoản người dùng
 *     description: Đăng xuất người dùng bằng cách thu hồi refresh token và xóa cookie.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thành công
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
 *               error: Lỗi server
 */

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);

	if (!post) {
		return sendErrorResponse(res, 405, 'Phương thức không được phép');
	}

	try {
		const refreshToken = getCookie(req, 'refreshToken');

		if (!isEmpty(refreshToken)) {
			if (refreshToken) await tokenService.blacklistToken(refreshToken);

			setCookie(res, 'refreshToken', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'Strict',
				expires: new Date(0),
			});
		}

		return sendJsonResponse(res, 200, { message: 'Đăng xuất thành công' });
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi server');
	}
});
