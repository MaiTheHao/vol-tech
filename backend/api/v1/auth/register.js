import withCors from '../../../lib/cors.js';
import authService from '../../../services/auth.service.js';
import { getHttpMethodFlags, sendJsonResponse, sendErrorResponse } from '../../../utils/index.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     description: Tạo tài khoản người dùng mới với thông tin cơ bản.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng ký thành công
 *       400:
 *         description: Thiếu trường bắt buộc hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 value:
 *                   error: Thiếu trường bắt buộc
 *               missing_password:
 *                 value:
 *                   error: Mật khẩu là bắt buộc
 *               missing_user_data:
 *                 value:
 *                   error: Thiếu dữ liệu người dùng
 *       409:
 *         description: Email đã được sử dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Email đã được sử dụng
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
 *             examples:
 *               password_error:
 *                 value:
 *                   error: Lỗi khi xử lý mật khẩu
 *               server_error:
 *                 value:
 *                   error: Lỗi máy chủ nội bộ
 */

export default withCors(async function handler(req, res) {
	const { post } = getHttpMethodFlags(req);
	if (!post) {
		return sendErrorResponse(res, 405, 'Phương thức không được phép');
	}

	try {
		const body = req.body;
		const { name, email, password, birthDate, unit, phone } = body;

		if (!name || !email || !password) {
			return sendErrorResponse(res, 400, 'Thiếu trường bắt buộc');
		}

		const [error, message] = await authService.register({ name, email, password, birthDate, unit, phone });
		if (error) return sendErrorResponse(res, error.code || 400, error.message || error);

		return sendJsonResponse(res, 201, { message });
	} catch (err) {
		console.error(err);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
});
