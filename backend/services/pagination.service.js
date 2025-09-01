class PaginationService {
	static _instance = null;

	static getInstance() {
		if (!PaginationService._instance) {
			PaginationService._instance = new PaginationService();
		}
		return PaginationService._instance;
	}

	/**
	 * Phân trang cho Mongoose query hoặc mảng
	 * @param {Object|Array} dataSource - Mongoose query (có .countDocuments và .find) hoặc mảng
	 * @param {Object} options - { page, limit, sort }
	 * @returns {Promise<Object>} { data, pagination }
	 */
	async paginate(dataSource, options = {}) {
		const { page = 1, limit = 10, sort = { name: 1 } } = options;

		let data, total;

		if (Array.isArray(dataSource)) {
			total = dataSource.length;
			const start = (parseInt(page) - 1) * parseInt(limit);
			const end = start + parseInt(limit);
			data = dataSource.slice(start, end);
		} else {
			// Giả sử là Mongoose Model hoặc Query
			total = (await dataSource.countDocuments?.()) ?? 0;
			data =
				(await dataSource
					.find?.({})
					.sort(sort)
					.skip((parseInt(page) - 1) * parseInt(limit))
					.limit(parseInt(limit))) ?? [];
		}

		const currentPage = parseInt(page);
		const pageLimit = parseInt(limit);
		const totalPages = Math.ceil(total / pageLimit);

		return {
			data,
			pagination: {
				page: currentPage,
				limit: pageLimit,
				total,
				pages: totalPages,
				hasNext: currentPage < totalPages,
				hasPrev: currentPage > 1,
			},
		};
	}

	/**
	 * Hàm trả về kết quả phân trang từ dữ liệu đã phân trang sẵn
	 * @param {Array} result - Dữ liệu đã phân trang
	 * @param {Object} options - { limit, page, total }
	 * @returns {Object} { data, pagination }
	 */
	paginatedResult(result, options = {}) {
		const { limit = 10, page = 1, total = 0 } = options;
		const pageLimit = parseInt(limit);
		const totalItems = parseInt(total);
		const currentPage = parseInt(page);
		const totalPages = Math.ceil(totalItems / pageLimit);

		return {
			data: result,
			pagination: {
				page: currentPage,
				limit: pageLimit,
				total: totalItems,
				pages: totalPages,
				hasNext: currentPage < totalPages,
				hasPrev: currentPage > 1,
			},
		};
	}
}

const paginationService = PaginationService.getInstance();
export default paginationService;
