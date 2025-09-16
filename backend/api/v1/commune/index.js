import withCors from '../../../lib/cors.js';
import communeService from '../../../services/commune.service.js';
import { generatePaginateOptions, getHttpMethodFlags, isEmpty, sendErrorResponse, sendJsonResponse } from '../../../utils/index.js';

/**
 * @swagger
 * /commune:
 *   get:
 *     summary: Lấy danh sách quận/huyện/thị xã
 *     description: Trả về danh sách quận/huyện/thị xã với khả năng tìm kiếm theo tỉnh/thành phố và phân trang.
 *     tags:
 *       - Commune
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tên quận/huyện/thị xã (tìm kiếm chứa chuỗi)
 *         example: Quận 1
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Mã quận/huyện/thị xã (khớp chính xác)
 *         example: Q1
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: ID tỉnh/thành phố
 *         example: 68c651b1f9ca2a6cf8daf775
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Số lượng bản ghi trên mỗi trang
 *         example: 10
 *     responses:
 *       200:
 *         description: Danh sách quận/huyện/thị xã
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commune'
 *       404:
 *         description: Không tìm thấy quận/huyện/thị xã nào
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy quận/huyện/thị xã nào
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

	try {
		if (get) {
			const { page, limit } = req.query;
			const paginateOptions = generatePaginateOptions(page, limit);
			const query = generateGetListQuery(req);

			const [errProvinces, provinces] = await communeService.getList(query, {}, { ...paginateOptions });
			if (errProvinces) return sendErrorResponse(res, errProvinces.code, errProvinces.message);

			return sendJsonResponse(res, 200, provinces);
		}
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}

	return sendErrorResponse(res, 405, 'Phương thức không được phép');
});

function generateGetListQuery(req) {
	const query = {};
	const { name, code, province } = req.query;

	if (!isEmpty(name)) {
		query.name = { $regex: `${name}`, $options: 'i' };
	}

	if (!isEmpty(code)) {
		query.code = String(code).toUpperCase();
	}

	if (!isEmpty(province)) {
		query.province = province;
	}

	return query;
}
