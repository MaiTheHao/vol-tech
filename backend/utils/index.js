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
	return value && typeof value === 'object' && ((typeof value.toObject === 'function' && value.constructor?.name === 'model') || value._bsontype === 'ObjectID' || value.constructor?.name === 'ObjectId');
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
 * Tạo options cho mongoose query để thực hiện paginate.
 * @param {*} page - Số trang.
 * @param {*} limit - Giới hạn mỗi trang.
 */
export function generatePaginateOptions(page, limit) {
	if (isEmpty(page) || page < 1) page = 1;
	if (isEmpty(limit) || limit < 0) limit = 10;
	const result = {};

	result.limit = limit;
	result.skip = (page - 1) * limit;

	return result;
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
 * Đặt cookie trong header của response.
 * @param {*} res - Đối tượng response.
 * @param {*} name - Tên cookie.
 * @param {*} value - Giá trị cookie.
 * @param {*} options - Các tuỳ chọn cookie như maxAge, domain, path, expires, httpOnly, secure, sameSite.
 */
export function setCookie(res, name, value, options = {}) {
	let cookieStr = `${name}=${encodeURIComponent(value)}`;
	if (options.maxAge) cookieStr += `; Max-Age=${options.maxAge}`;
	if (options.domain) cookieStr += `; Domain=${options.domain}`;
	if (options.path) cookieStr += `; Path=${options.path}`;
	if (options.expires) cookieStr += `; Expires=${options.expires.toUTCString()}`;
	if (options.httpOnly) cookieStr += '; HttpOnly';
	if (options.secure) cookieStr += '; Secure';
	if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
	const existingSetCookie = res.getHeader('Set-Cookie');
	if (existingSetCookie) {
		if (Array.isArray(existingSetCookie)) {
			res.setHeader('Set-Cookie', [...existingSetCookie, cookieStr]);
		} else {
			res.setHeader('Set-Cookie', [existingSetCookie, cookieStr]);
		}
	} else {
		res.setHeader('Set-Cookie', cookieStr);
	}
}

/**
 * Lấy giá trị cookie từ header của request.
 * @param {*} req - Đối tượng request.
 * @param {*} name - Tên cookie cần lấy.
 * @returns {string|null} Giá trị cookie nếu tồn tại, ngược lại trả về null.
 */
export function getCookie(req, name) {
	const cookieHeader = req.headers?.cookie;
	if (!cookieHeader) return null;
	const cookies = cookieHeader.split(';').map((c) => c.trim());
	const cookie = cookies.find((c) => c.startsWith(`${name}=`));
	return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
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

/**
 * Kiểm tra giá trị có rỗng hay không.
 * @param {*} value
 * @returns {boolean} Trả về true nếu rỗng, ngược lại trả về false.
 */
export function isEmpty(value) {
	if (value == null) return true;
	if (isString(value)) return value.trim().length === 0;
	if (isArray(value)) return value.length === 0;
	if (isObject(value)) return Object.keys(value).length === 0;
	return false;
}
