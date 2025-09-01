import activityRepository from '../../../repository/activity.repository.js';
import withCors from '../../../lib/cors.js';
import { getHttpMethodFlags, mapOrderSort, sendJsonResponse } from '../../../utils/index.js';
import paginationService from '../../../services/pagination.service.js';

/**
 * API handler cho hoạt động (activity).
 *
 * @async
 * @function handler
 *
 * @description
 * - GET: Lấy danh sách hoạt động với filter (provinceId, communeId) và phân trang (limit, page, sort).
 *   + Query Params:
 *     - provinceId {string} (optional): ID tỉnh/thành phố để lọc.
 *     - communeId {string} (optional): ID xã/phường để lọc.
 *     - limit {number} (optional): Số lượng bản ghi mỗi trang.
 *     - page {number} (optional): Số trang.
 *     - sort {string} (optional): Trường để sắp xếp.
 *     - order {string} (optional): Thứ tự sắp xếp.
 *     - with_province {boolean} (optional): Có lấy thông tin tỉnh/thành phố hay không.
 *     - with_commune {boolean} (optional): Có lấy thông tin xã/phường hay không.
 *   + Response: { success: boolean, data: Array<Object>, pagination: Object }
 * - Các phương thức khác: trả về 405 Method Not Allowed.
 *
 * @returns {void}
 */
async function handler(req, res) {
	const { get } = getHttpMethodFlags(req);

	if (get) {
		try {
			const {
				provinceId,
				communeId,
				limit = 10,
				page = 1,
				sort,
				order,
				with_province,
				with_commune,
			} = req.query || {};
			const filter = {};
			if (provinceId) filter.provinceId = provinceId;
			if (communeId) filter.communeId = communeId;
			const options = {
				limit: +limit,
				page: +page,
				sort: sort ? { [sort]: mapOrderSort(order) } : { createdAt: -1 },
			};

			const populate = [];
			if (with_province === 'true') populate.push('province');
			if (with_commune === 'true') populate.push('communce');

			const [total, activities] = await Promise.all([
				activityRepository.count(filter),
				activityRepository.getList(filter, {
					...options,
					populate,
				}),
			]);

			const paginated = paginationService.paginatedResult(activities, {
				limit: options.limit,
				page: options.page,
				total,
			});

			sendJsonResponse(res, 200, { success: true, ...paginated });
		} catch (err) {
			sendJsonResponse(res, 500, { success: false, message: err.message });
		}
		return;
	}

	sendJsonResponse(res, 405, { success: false, message: 'Phương thức không được cho phép' });
}

export default withCors(handler);
