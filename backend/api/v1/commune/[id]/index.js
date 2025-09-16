import { isValidObjectId } from 'mongoose';
import withCors from '../../../../lib/cors.js';
import communeService from '../../../../services/commune.service.js';
import { getHttpMethodFlags, sendErrorResponse, sendJsonResponse } from '../../../../utils/index.js';

/**
 * @swagger
 * /commune/{id}:
 *   get:
 *     summary: Lấy thông tin quận/huyện/thị xã theo ID
 *     description: Trả về thông tin chi tiết của một quận/huyện/thị xã dựa trên ID.
 *     tags:
 *       - Commune
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quận/huyện/thị xã
 *         example: 68c65485f9ca2a6cf8daf794
 *     responses:
 *       200:
 *         description: Thông tin quận/huyện/thị xã
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       400:
 *         description: ID quận/huyện/thị xã không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: ID quận/huyện/thị xã không hợp lệ
 *       404:
 *         description: Không tìm thấy quận/huyện/thị xã
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy quận/huyện/thị xã
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
		return sendErrorResponse(res, 400, 'ID quận/huyện/thị xã không hợp lệ');
	}

	try {
		if (get) {
			const [err, commune] = await communeService.getById(id);
			if (err) return sendErrorResponse(res, err.code, err.message);
			return sendJsonResponse(res, 200, commune);
		}
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}

	return sendErrorResponse(res, 405, 'Phương thức không được phép');
});
