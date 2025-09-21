import activeService from '../../services/active.service.js';
import { isEmpty } from '../../utils/type-check.js';
import { generatePaginateOptions, mapOrderSort } from '../../utils/index.js';
import { sendJsonResponse, sendErrorResponse } from '../../utils/response.js';
import { isValidObjectId } from 'mongoose';

// GET /active
export async function getList(req, res) {
	try {
		const { page, limit, title, status, commune, createdBy, sortBy, sortOrder } = req.query;
		const options = generatePaginateOptions(page, limit);

		const query = {};
		if (!isEmpty(title)) {
			query.title = { $regex: `${title}`, $options: 'i' };
		}
		if (!isEmpty(status)) {
			query.status = status;
		}
		if (!isEmpty(commune) && isValidObjectId(commune)) {
			query.commune = commune;
		}
		if (!isEmpty(createdBy) && isValidObjectId(createdBy)) {
			query.createdBy = createdBy;
		}

		if (!isEmpty(sortBy)) {
			options.sort = { [sortBy]: mapOrderSort(sortOrder) };
		}

		const [err, actives, errPaginate, activesPaginate] = await Promise.all([activeService.getList(query, {}, options), activeService.count(query)]).then(([listResult, countResult]) => [...listResult, ...countResult]);

		const paginate = {
			totalItems: errPaginate ? 0 : activesPaginate,
			currentPage: options.page,
			totalPages: errPaginate ? 1 : Math.ceil(activesPaginate / options.limit),
			limit: options.limit,
		};

		if (err) return sendErrorResponse(res, err.code || 404, err.message);

		return sendJsonResponse(res, 200, { items: actives, paginate });
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

// POST /active/:id/participants
export async function join(req, res) {
	try {
		const { id } = req.params;
		const userId = req.user.uid;

		if (isEmpty(id)) {
			return sendErrorResponse(res, 400, 'Thiếu id');
		}

		const [err, active] = await activeService.addRegisteredUser(id, userId);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, 'Tham gia hoạt động thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}

// DELETE /active/:id/participants
export async function leave(req, res) {
	try {
		const { id } = req.params;
		const userId = req.user.uid;

		if (isEmpty(id) || isEmpty(userId)) {
			return sendErrorResponse(res, 400, 'Thiếu id hoặc userId');
		}

		const [err, active] = await activeService.removeRegisteredUser(id, userId);
		if (err) return sendErrorResponse(res, err.code || 404, err.message);
		if (!active) return sendErrorResponse(res, 404, 'Không tìm thấy hoạt động');

		return sendJsonResponse(res, 200, 'Rời khỏi hoạt động thành công');
	} catch (error) {
		console.error(error);
		return sendErrorResponse(res, 500, 'Lỗi máy chủ nội bộ');
	}
}
