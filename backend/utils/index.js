/**
 * Kiểm tra input có phải là boolean.
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là boolean, ngược lại trả về false.
 */
export function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Kiểm tra input có phải là số.
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là số, ngược lại trả về false.
 */
export function isNumber(value) {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * Kiểm tra input có phải là string.
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là chuỗi, ngược lại trả về false.
 */
export function isString(value) {
	return typeof value === 'string';
}

/**
 * Kiểm tra input có phải là mảng.
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là mảng, ngược lại trả về false.
 */
export function isArray(value) {
	return Array.isArray(value);
}

/**
 * Kiểm tra input có phải là object thuần (không phải null, array, function).
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là object thuần, ngược lại trả về false.
 */
export function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Kiểm tra input có phải là đối tượng Mongoose (Document hoặc ObjectId).
 * @param {*} value - Giá trị cần kiểm tra.
 * @returns {boolean} Trả về true nếu là đối tượng Mongoose, ngược lại trả về false.
 */
export function isMongooseObject(value) {
	return (
		value &&
		typeof value === 'object' &&
		((typeof value.toObject === 'function' && value.constructor?.name === 'model') ||
			value._bsontype === 'ObjectID' ||
			value.constructor?.name === 'ObjectId')
	);
}

/**
 * Chuyển đổi đối tượng Mongoose thành object JavaScript thuần.
 * @param {*} value - Đối tượng Mongoose hoặc giá trị bất kỳ.
 * @returns {Object|*} Object JS nếu là Mongoose object, ngược lại trả về chính giá trị truyền vào.
 */
export function mongooseToObject(value) {
	if (value && typeof value.toObject === 'function') {
		return value.toObject();
	}
	return value;
}

/**
 * Trích xuất token Bearer từ header Authorization của request.
 * @param {import('http').IncomingMessage} req - Đối tượng request.
 * @returns {string|null} Token nếu tồn tại, ngược lại trả về null.
 */
export function extractBearerToken(req) {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader || typeof authHeader !== 'string') return null;
	const match = authHeader.match(/^Bearer\s+(.+)$/i);
	return match ? match[1] : null;
}

/**
 * Lấy các cờ boolean tương ứng với phương thức HTTP của request.
 * @param {import('http').IncomingMessage} req - Đối tượng request.
 * @returns {{get: boolean, post: boolean, put: boolean, delete: boolean}} Đối tượng chứa các cờ phương thức.
 */
export function getHttpMethodFlags(req) {
	const method = req.method?.toLowerCase();
	return {
		get: method === 'get',
		post: method === 'post',
		put: method === 'put',
		delete: method === 'delete',
	};
}

/**
 * Chuyển đổi giá trị order thành số thứ tự sắp xếp (1 hoặc -1) cho MongoDB sort.
 * @param {number|boolean|string} order - Giá trị thứ tự sắp xếp, có thể là số, boolean hoặc chuỗi.
 *   - Nếu là số: 1 sẽ trả về 1 (tăng dần), các giá trị khác trả về -1 (giảm dần).
 *   - Nếu là boolean: true trả về 1, false trả về -1.
 *   - Nếu là chuỗi: 'asc', '1', 'true' trả về 1; 'desc', '-1', 'false' trả về -1.
 * @returns {number} Số thứ tự sắp xếp: 1 (tăng dần) hoặc -1 (giảm dần). Nếu không hợp lệ sẽ trả về -1.
 */
export function mapOrderSort(order) {
	if (isNumber(order)) return order === 1 ? 1 : -1;
	if (isBoolean(order)) return order ? 1 : -1;
	if (isString(order)) {
		const val = order.trim().toLowerCase();
		if (['asc', '1', 'true'].includes(val)) return 1;
		if (['desc', '-1', 'false'].includes(val)) return -1;
	}
	return -1;
}

/**
 * Phân tích dữ liệu JSON từ request body.
 * @param {import('http').IncomingMessage} req - Đối tượng request.
 * @returns {Promise<Object>} Promise trả về object đã parse từ JSON.
 */
export async function parseJson(req) {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			try {
				const data = JSON.parse(body || '{}');
				resolve(data);
			} catch (err) {
				reject(new Error('Invalid JSON'));
			}
		});
		req.on('error', (err) => {
			reject(err);
		});
	});
}

/**
 * Gửi response dạng JSON về client.
 * @param {import('http').ServerResponse} res - Đối tượng response.
 * @param {number} statusCode - Mã trạng thái HTTP.
 * @param {Object} data - Dữ liệu trả về dạng JSON.
 */
export function sendJsonResponse(res, statusCode, data) {
	res.statusCode = statusCode;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(data));
}

/**
 * Gửi response lỗi về client dưới dạng JSON, cho phép custom thêm dữ liệu.
 * @param {import('http').ServerResponse} res - Đối tượng response.
 * @param {number} statusCode - Mã trạng thái HTTP lỗi.
 * @param {string|Object} message - Thông báo lỗi hoặc object lỗi.
 * @param {Object} [rest] - Dữ liệu bổ sung tuỳ chọn.
 */
export function sendErrorResponse(res, statusCode, message, rest = {}) {
	const errorObj = typeof message === 'string' ? { error: message, ...rest } : { ...message, ...rest };
	sendJsonResponse(res, statusCode, errorObj);
}
