import activeService from '../../services/active.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { generatePaginateOptions } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';

// GET /active
export async function getList(req, res) {
	try {
		const { page, limit, title, status, commune, createdBy } = req.query;
		const paginateOptions = generatePaginateOptions(page, limit);

		const query = {};
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

		const [err, actives] = await activeService.getList(query, {}, paginateOptions);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, actives);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// POST /active
export async function create(req, res) {
	try {
		const data = req.body;
		const creator = req.user.uid;

		const [err, active] = await activeService.create(creator, data);
		if (err) {
			return sendErrorResponse(res, err.code || 400, err.message);
		}

		return sendJsonResponse(res, 201, active);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// GET /active/:id
export async function getById(req, res) {
	try {
		const { id } = req.params;
		if (isEmpty(id)) {
			return sendErrorResponse(res, 400, 'Thiếu id');
		}

		const [err, active] = await activeService.getById(id);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, active);
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}
