import communeService from '../../services/commune.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { generatePaginateOptions } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';

// GET /commune
export async function getList(req, res) {
	try {
		const { page, limit, name, code, province } = req.query;
		const paginateOptions = generatePaginateOptions(page, limit);

		const query = {};
		if (!isEmpty(name)) {
			query.name = { $regex: `${name}`, $options: 'i' };
		}
		if (!isEmpty(code)) {
			query.code = String(code).toUpperCase();
		}
		if (!isEmpty(province)) {
			query.province = province;
		}

		const [err, communes] = await communeService.getList(query, {}, paginateOptions);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, communes);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// GET /commune/:id
export async function getById(req, res) {
	try {
		const { id } = req.params;
		if (isEmpty(id)) {
			return sendErrorResponse(res, 400, 'Thiếu id');
		}

		const [err, commune] = await communeService.getById(id);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!commune) return sendErrorResponse(res, 404, 'Không tìm thấy xã');

		return sendJsonResponse(res, 200, commune);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}
