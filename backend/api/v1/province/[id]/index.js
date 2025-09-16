import { isValidObjectId } from 'mongoose';
import withCors from '../../../../lib/cors.js';
import provinceService from '../../../../services/province.service.js';
import { getHttpMethodFlags, sendErrorResponse, sendJsonResponse } from '../../../../utils/index.js';

/**
 * @swagger
 * /province/{id}:
 *   get:
 *     summary: Lấy thông tin tỉnh/thành phố theo ID
 *     description: Trả về thông tin chi tiết của một tỉnh/thành phố dựa trên ID.
 *     tags:
 *       - Province
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố
 *         example: 68c651b1f9ca2a6cf8daf771
 *     responses:
 *       200:
 *         description: Thông tin tỉnh/thành phố
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Province'
 *       400:
 *         description: ID tỉnh/thành không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: ID tỉnh/thành không hợp lệ
 *       404:
 *         description: Không tìm thấy tỉnh/thành
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy tỉnh/thành
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
		return sendErrorResponse(res, 400, 'ID tỉnh/thành không hợp lệ');
	}

	try {
		if (get) {
			const [err, province] = await provinceService.getById(id);
			if (err) return sendErrorResponse(res, err.code, err.message);
			return sendJsonResponse(res, 200, province);
		}
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}

	return sendErrorResponse(res, 405, 'Phương thức không được phép');
});
