import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { getHttpMethodFlags, sendJsonResponse, sendErrorResponse, setCookie } from '../../../utils/index.js';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản người dùng
 *     description: Đăng nhập bằng email và mật khẩu, trả về thông tin người dùng và accessToken trong response, refreshToken được lưu trong cookie.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Thiếu trường bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Email và mật khẩu là bắt buộc
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Email hoặc mật khẩu không đúng
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
		const body = req.body;
		const { email, password } = body;

		if (!email.trim() || !password.trim()) {
			return sendErrorResponse(res, 400, 'Email và mật khẩu là bắt buộc');
		}

		const [error, result] = await authService.login(email, password);
		if (error) return sendErrorResponse(res, error.code || 401, error.message || error);

		setCookie(res, 'refreshToken', result.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7.25 * 24 * 60 * 60 * 1000),
		});

		return sendJsonResponse(res, 200, result);
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
});
