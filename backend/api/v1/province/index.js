import withCors from '../../../lib/cors.js';
import provinceService from '../../../services/province.service.js';
import { generatePaginateOptions, getHttpMethodFlags, isEmpty, sendErrorResponse, sendJsonResponse } from '../../../utils/index.js';

/**
 * @swagger
 * /province:
 *   get:
 *     summary: Lấy danh sách tỉnh/thành phố
 *     description: Trả về danh sách tỉnh/thành phố với khả năng tìm kiếm và phân trang.
 *     tags:
 *       - Province
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Tên tỉnh/thành phố (tìm kiếm chứa chuỗi)
 *         example: Hà Nội
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Mã tỉnh/thành phố (khớp chính xác)
 *         example: HN
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
 *         description: Danh sách tỉnh/thành phố
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Province'
 *       404:
 *         description: Không tìm thấy tỉnh/thành nào
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Không tìm thấy tỉnh/thành nào
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

			const [errProvinces, provinces] = await provinceService.getList(query, {}, { ...paginateOptions });
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
	const { name, code } = req.query;

	if (!isEmpty(name)) {
		query.name = { $regex: `${name}`, $options: 'i' };
	}

	if (!isEmpty(code)) {
		query.code = String(code).toUpperCase();
	}

	return query;
}
