import { isValidObjectId } from 'mongoose';
import withCors from '../../../../lib/cors.js';
import activeRepository from '../../../../repository/active.repository.js';
import { getHttpMethodFlags, sendErrorResponse, sendJsonResponse } from '../../../../utils/index.js';

/**
 * @swagger
 * /active/{id}:
 *   get:
 *     summary: Lấy thông tin hoạt động tình nguyện theo ID
 *     description: Trả về thông tin chi tiết của một hoạt động tình nguyện dựa trên ID.
 *     tags:
 *       - Active
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hoạt động tình nguyện
 *         example: 68bd02a3971b15e48094f587
 *     responses:
 *       200:
 *         description: Thông tin hoạt động tình nguyện
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Active'
 *       400:
 *         description: ID hoạt động không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: ID hoạt động không hợp lệ
 *       404:
 *         description: Không tìm thấy hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy hoạt động
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
	const { get } = getHttpMethodFlags(req);
	const { id } = req.query;

	if (!isValidObjectId(id)) {
		return sendErrorResponse(res, 400, 'ID hoạt động không hợp lệ');
	}

	try {
		if (get) {
			const active = await activeRepository.findById(id);
			if (!active) {
				return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');
			}
			return sendJsonResponse(res, 200, active);
		}
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
 
	return sendErrorResponse(res, 405, 'Phương thức không được phép');
});
