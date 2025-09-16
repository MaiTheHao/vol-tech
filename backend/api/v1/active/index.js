import withCors from '../../../lib/cors.js';
import { roleGuard } from '../../../lib/guard.js';
import activeService from '../../../services/active.service.js';
import { generatePaginateOptions, getHttpMethodFlags, isEmpty, sendErrorResponse, sendJsonResponse } from '../../../utils/index.js';

/**
 * @swagger
 * /active:
 *   get:
 *     summary: Lấy danh sách hoạt động tình nguyện
 *     description: Trả về danh sách hoạt động tình nguyện với khả năng tìm kiếm và phân trang.
 *     tags:
 *       - Active
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Tiêu đề hoạt động (tìm kiếm chứa chuỗi)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [closed, ongoing, completed, cancelled]
 *         description: Trạng thái hoạt động
 *       - in: query
 *         name: commune
 *         schema:
 *           type: string
 *         description: ID xã/phường/thị trấn
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: ID người tạo hoạt động
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Số lượng bản ghi trên mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách hoạt động tình nguyện
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Active'
 *       404:
 *         description: Không tìm thấy hoạt động nào
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       405:
 *         description: Phương thức không được phép
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Tạo hoạt động tình nguyện mới
 *     description: Tạo một hoạt động tình nguyện mới với thông tin chi tiết.
 *
 *     tags:
 *       - Active
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActiveRequest'
 *     responses:
 *       201:
 *         description: Tạo hoạt động thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Active'
 *       400:
 *         description: Thiếu trường bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       405:
 *         description: Phương thức không được phép
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default withCors(async function handler(req, res) {
	const { get, post } = getHttpMethodFlags(req);

	try {
		if (get) {
			const { page, limit } = req.query;
			const paginateOptions = generatePaginateOptions(page, limit);
			const query = generateGetListQuery(req);

			const [err, actives] = await activeService.getList(query, {}, { ...paginateOptions });
			if (err) return sendErrorResponse(res, err.code || 500, err.message || 'Lỗi lấy danh sách hoạt động');

			return sendJsonResponse(res, 200, actives);
		}

		if (post) {
			return roleGuard(['admin', 'editor'], async (req, res) => {
				const data = req.body;
				data.createdBy = req.user.uid;

				const [err, active] = await activeService.create(data);
				if (err) {
					return sendErrorResponse(res, err.code, err.message);
				}

				return sendJsonResponse(res, 201, active);
			})(req, res);
		}
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}

	return sendErrorResponse(res, 405, 'Phương thức không được phép');
});

function generateGetListQuery(req) {
	const query = {};
	const { title, status, commune, createdBy } = req.query;

	if (!isEmpty(title)) {
		query.title = { $regex: `${title}`, $options: 'i' };
	}
	if (!isEmpty(status)) {
		query.status = status;
	}
	if (!isEmpty(commune)) {
		query.commune = commune;
	}
	if (!isEmpty(createdBy)) {
		query.createdBy = createdBy;
	}

	return query;
}
