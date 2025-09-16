import withCors from '../../../lib/cors.js';
import tokenService from '../../../services/token.service.js';
import { extractBearerToken, getHttpMethodFlags, sendJsonResponse, sendErrorResponse } from '../../../utils/index.js';
import userService from '../../../services/user.service.js';

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại từ access token
 *     description: Trả về thông tin người dùng dựa trên access token Bearer trong header Authorization.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     passwordHashed:
 *                       type: string
 *                       description: Bị loại bỏ khỏi response
 *                       example: null
 *                     salt:
 *                       type: string
 *                       description: Bị loại bỏ khỏi response
 *                       example: null
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 value:
 *                   error: Không có hoặc token không hợp lệ
 *               invalid_token:
 *                 value:
 *                   error: Token không hợp lệ hoặc đã hết hạn
 *               blacklisted_token:
 *                 value:
 *                   error: Token đã bị thu hồi hoặc không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy người dùng
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
const handler = async function (req, res) {
	const { get } = getHttpMethodFlags(req);

	if (!get) return sendErrorResponse(res, 405, 'Phương thức không được phép');

	try {
		const token = extractBearerToken(req);
		if (!token) return sendJsonResponse(res, 401, 'Không có hoặc token không hợp lệ');

		const [errToken, payload] = await tokenService.verifyToken(token);
		if (errToken) return sendJsonResponse(res, errToken.code, errToken.message);

		const [errUser, user] = await userService.getById(payload.uid, { passwordHashed: 0, salt: 0 }, { lean: true });
		if (errUser) return sendJsonResponse(res, 404, errUser.code, errUser.message);

		return sendJsonResponse(res, 200, user);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
};

export default withCors(handler);
